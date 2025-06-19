import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Swal from "sweetalert2";
import { useStoreStore } from "./storeStore";
import matchRoundNumber from "../helpers/matchRound";

const useDiscountStore = create(
  persist(
    (set, get) => ({
      // State variables
      totalBill: 0,
      discountType: "PERCENT", // "PERCENT" or "LAK"
      discountValue: 0,
      selectedMethod: "USEPOINT", // "USEPERCENT", "USEPOINT"
      useTwoDiscount: false,
      memberDataSearch: null,
      dataBillEdit: null,
      paymentMethodUseDiscount: "CASH", // แก้ไข spelling และใช้ UPPERCASE
      t: (key) => key, // Translation function placeholder

      // Actions to update state
      setTotalBill: (amount) => set({ totalBill: matchRoundNumber(amount) }),
      setDiscountType: (type) => set({ discountType: type }),
      setDiscountValue: (value) => set({ discountValue: value }),
      setSelectedMethod: (method) => set({ selectedMethod: method }),
      setUseTwoDiscount: (use) => set({ useTwoDiscount: use }),
      setMemberDataSearch: (data) => set({ memberDataSearch: data }),
      setDataBillEdit: (data) => set({ dataBillEdit: data }),
      setTranslationFunction: (translateFn) => set({ t: translateFn }),
      setPaymentMethodUseDiscount: (
        method // แก้ไข spelling
      ) => set({ paymentMethodUseDiscount: method }),

      // Helper function to determine if should auto apply member discount
      shouldAutoApplyMemberDiscount: () => {
        const { paymentMethodUseDiscount } = get();

        // เคส "ไม่ต้องเลือก" - ใช้ส่วนลดอัตโนมัติ
        const autoApplyMethods = [
          "CASH",
          "TRANSFER",
          "CASH_TRANSFER",
          "DELIVERY",
        ];

        // เคส "ต้องเลือก" - cash + transfer + point
        const manualSelectMethod = "CASH_TRANSFER_POINT";

        // ถ้าเป็น auto apply methods
        if (autoApplyMethods.includes(paymentMethodUseDiscount)) {
          return true;
        }

        // ถ้าเป็น cash_transfer_point
        if (paymentMethodUseDiscount === manualSelectMethod) {
          return false;
        }

        // Default: ใช้อัตโนมัติ (safety fallback)
        return true;
      },

      // Main discount calculation function
      calculateDiscountedTotal: () => {
        const state = get();
        const {
          totalBill,
          discountType,
          discountValue,
          selectedMethod,
          useTwoDiscount,
          memberDataSearch,
          dataBillEdit,
          t,
        } = state;

        const storeDetail = useStoreStore.getState().storeDetail;
        const isAutoApply = state.shouldAutoApplyMemberDiscount();

        // Helper functions for clarity
        const getMemberDiscountPercent = () => {
          return parseInt(memberDataSearch?.discountPercentage) || 0;
        };

        const getManualDiscountValue = () => {
          return parseInt(discountValue) || 0;
        };

        const applyPercentDiscount = (amount, percent) => {
          return amount - (amount * percent) / 100;
        };

        const applyFixedDiscount = (amount, discount) => {
          return amount - discount;
        };

        const showTwoDiscountConfirmation = () => {
          Swal.fire({
            icon: "warning",
            title: t("noti"),
            text: `มีการใช้ส่วนลดบิลแล้ว ${discountValue} ${
              discountType === "PERCENT" ? "%" : storeDetail?.firstCurrency
            } ท่านต้องการใช้ทั้งสองเลยหรือไม่?`,
            showDenyButton: true,
            confirmButtonText: "ยืนยัน",
            denyButtonText: "ยกเลิก",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              set({ useTwoDiscount: true });
            } else if (result.isDenied) {
              set({ useTwoDiscount: false });
            }
          });
        };

        let finalTotal = totalBill;
        const memberDiscountPercent = getMemberDiscountPercent();
        const manualDiscount = getManualDiscountValue();
        const hasManualDiscount = discountValue > 0;
        const hasMemberDiscount = memberDiscountPercent > 0;

        // console.log(
        //   `Payment Method: ${state.paymentMethodUseDiscount}, Auto Apply: ${isAutoApply}`
        // );

        // Priority 1: Two discount scenario (highest priority)
        if (
          useTwoDiscount &&
          discountType === "PERCENT" &&
          hasManualDiscount &&
          hasMemberDiscount
        ) {
          const totalDiscountPercent = memberDiscountPercent + manualDiscount;
          finalTotal = applyPercentDiscount(totalBill, totalDiscountPercent);
          // console.log(
          //   `Case 1: Applied combined discount ${totalDiscountPercent}%`
          // );
        }

        // Priority 2: Auto Apply Methods - ใช้ส่วนลดสมาชิกอัตโนมัติ
        else if (isAutoApply && hasMemberDiscount) {
          // ใช้ส่วนลดสมาชิกอัตโนมัติ + manual discount (ถ้ามี)
          if (hasManualDiscount) {
            if (discountType === "PERCENT") {
              // รวมส่วนลดทั้งสอง
              const totalDiscountPercent =
                memberDiscountPercent + manualDiscount;
              finalTotal = applyPercentDiscount(
                totalBill,
                totalDiscountPercent
              );
              // console.log(
              //   `Case 2a: Auto applied member discount ${memberDiscountPercent}% + manual discount ${manualDiscount}%`
              // );
            } else if (discountType === "LAK") {
              // ลดจำนวนเงินก่อน แล้วลดเปอร์เซ็นต์
              const afterFixedDiscount = applyFixedDiscount(
                totalBill,
                manualDiscount
              );
              finalTotal = applyPercentDiscount(
                afterFixedDiscount,
                memberDiscountPercent
              );
              // console.log(
              //   `Case 2b: Auto applied member discount ${memberDiscountPercent}% + manual discount ${manualDiscount} LAK`
              // );
            }
          } else {
            // เฉพาะส่วนลดสมาชิก
            finalTotal = applyPercentDiscount(totalBill, memberDiscountPercent);
            // console.log(
            //   `Case 2c: Auto applied member discount ${memberDiscountPercent}% only`
            // );
          }
        }

        // Priority 3: Manual Select Methods (CASH_TRANSFER_POINT)
        else if (!isAutoApply) {
          if (selectedMethod === "USEPERCENT" && hasMemberDiscount) {
            // เลือกใช้ส่วนลดสมาชิก
            if (hasManualDiscount && !useTwoDiscount) {
              // ถามว่าจะใช้ทั้งสองหรือไม่
              showTwoDiscountConfirmation();
              finalTotal = applyPercentDiscount(
                totalBill,
                memberDiscountPercent
              );
              // console.log(
              //   `Case 3a: Manual select member discount, asking about manual discount`
              // );
            } else if (hasManualDiscount && useTwoDiscount) {
              // ใช้ทั้งสอง
              if (discountType === "PERCENT") {
                const totalDiscountPercent =
                  memberDiscountPercent + manualDiscount;
                finalTotal = applyPercentDiscount(
                  totalBill,
                  totalDiscountPercent
                );
                // console.log(
                //   `Case 3b: Manual select both discounts ${totalDiscountPercent}%`
                // );
              } else if (discountType === "LAK") {
                const afterFixedDiscount = applyFixedDiscount(
                  totalBill,
                  manualDiscount
                );
                finalTotal = applyPercentDiscount(
                  afterFixedDiscount,
                  memberDiscountPercent
                );
                // console.log(`Case 3c: Manual select member + LAK discount`);
              }
            } else {
              // เฉพาะส่วนลดสมาชิก
              finalTotal = applyPercentDiscount(
                totalBill,
                memberDiscountPercent
              );
              // console.log(`Case 3d: Manual select member discount only`);
            }
          } else if (selectedMethod === "USEPOINT") {
            // เลือกใช้คะแนน - ไม่ใช้ส่วนลดสมาชิก
            if (hasManualDiscount) {
              // ใช้เฉพาะ manual discount
              if (discountType === "PERCENT") {
                finalTotal = applyPercentDiscount(totalBill, manualDiscount);
                // console.log(
                //   `Case 3e: Use points, apply manual discount ${manualDiscount}%`
                // );
              } else if (discountType === "LAK") {
                finalTotal = applyFixedDiscount(totalBill, manualDiscount);
                // console.log(
                //   `Case 3f: Use points, apply manual discount ${manualDiscount} LAK`
                // );
              }
            } else {
              // ไม่มีส่วนลดใดๆ (จะใช้คะแนนแลกสินค้า)
              finalTotal = totalBill;
              // console.log(`Case 3g: Use points only, no discount applied`);
            }
          }
        }

        // Priority 4: Manual discount only (no member)
        else if (hasManualDiscount && !hasMemberDiscount) {
          if (discountType === "PERCENT") {
            finalTotal = applyPercentDiscount(totalBill, manualDiscount);
            // console.log(`Case 4a: Manual discount only ${manualDiscount}%`);
          } else if (discountType === "LAK") {
            finalTotal = applyFixedDiscount(totalBill, manualDiscount);
            // console.log(`Case 4b: Manual discount only ${manualDiscount} LAK`);
          }
        }

        // Priority 5: Bill edit discount (fallback)
        else if (dataBillEdit?.discount > 0) {
          finalTotal = applyPercentDiscount(totalBill, dataBillEdit.discount);
          console
            .log
            // `Case 5: Applied bill edit discount ${dataBillEdit.discount}%`
            ();
        }

        // Priority 6: No discounts
        else {
          finalTotal = totalBill;
          // console.log(`Case 6: No discount applied`);
        }

        // Prevent negative total
        finalTotal = Math.max(0, finalTotal);

        // console.log(`Final calculation: ${totalBill} -> ${finalTotal}`);
        return finalTotal;
      },

      // Helper function to get discount summary for UI
      getDiscountSummary: () => {
        const state = get();
        const isAutoApply = state.shouldAutoApplyMemberDiscount();
        const memberDiscountPercent =
          parseInt(state.memberDataSearch?.discountPercentage) || 0;
        const manualDiscount = parseInt(state.discountValue) || 0;

        return {
          isAutoApply,
          paymentMethod: state.paymentMethodUseDiscount,
          memberDiscount: memberDiscountPercent,
          manualDiscount: manualDiscount,
          selectedMethod: state.selectedMethod,
          canSelectMethod: !isAutoApply, // ใน CASH_TRANSFER_POINT เท่านั้น
          hasMemberDiscount: memberDiscountPercent > 0,
          hasManualDiscount: manualDiscount > 0,
        };
      },

      // Helper function to handle method change with validation
      handleMethodChange: (newMethod) => {
        const state = get();
        const isAutoApply = state.shouldAutoApplyMemberDiscount();

        // ถ้าเป็น auto apply methods ไม่ให้เปลี่ยน method
        if (isAutoApply) {
          // console.log("Auto apply mode - method change ignored");
          return;
        }

        // เฉพาะ CASH_TRANSFER_POINT เท่านั้นที่เปลี่ยนได้
        if (state.paymentMethodUseDiscount === "CASH_TRANSFER_POINT") {
          set({ selectedMethod: newMethod });
          // console.log(`Method changed to: ${newMethod}`);
        }
      },

      // Helper function to update payment method and reset related states
      updatePaymentMethod: (method) => {
        const normalizedMethod = method.toUpperCase();
        const isAutoApply = [
          "CASH",
          "TRANSFER",
          "CASH_TRANSFER",
          "DELIVERY",
        ].includes(normalizedMethod);

        set({
          paymentMethodUseDiscount: normalizedMethod,
          selectedMethod: isAutoApply ? "USEPERCENT" : "USEPOINT",
          useTwoDiscount: false, // Reset เมื่อเปลี่ยน payment method
        });

        // console.log(
        //   `Payment method updated: ${normalizedMethod}, auto apply: ${isAutoApply}`
        // );
      },

      // Helper function to get payment method display name
      getPaymentMethodName: () => {
        const { paymentMethodUseDiscount } = get();

        const methodNames = {
          CASH: "ເງິນສົດ",
          TRANSFER: "ເງິນໂອນ",
          CASH_TRANSFER: "ເງິນສົດ + ເງິນໂອນ",
          CASH_TRANSFER_POINT: "ເງິນສົດ + ເງິນໂອນ + ຄະແນນ",
          DELIVERY: "Delivery",
        };

        return (
          methodNames[paymentMethodUseDiscount] || paymentMethodUseDiscount
        );
      },

      // Helper function to calculate discount amount (for display)
      getDiscountAmount: () => {
        const state = get();
        const { totalBill } = state;
        const discountedTotal = state.calculateDiscountedTotal();
        return totalBill - discountedTotal;
      },

      // Helper function to reset discount state
      resetDiscount: () =>
        set({
          discountType: "PERCENT",
          discountValue: 0,
          useTwoDiscount: false,
          selectedMethod: "USEPOINT",
        }),

      // Helper function to apply discount and return final amount
      applyDiscount: () => {
        const discountedTotal = get().calculateDiscountedTotal();
        return matchRoundNumber(discountedTotal);
      },
    }),
    {
      name: "discount-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        totalBill: state.totalBill,
        discountType: state.discountType,
        discountValue: state.discountValue,
        selectedMethod: state.selectedMethod,
        useTwoDiscount: state.useTwoDiscount,
        memberDataSearch: state.memberDataSearch,
        dataBillEdit: state.dataBillEdit,
        paymentMethodUseDiscount: state.paymentMethodUseDiscount,
      }),
      version: 2, // เพิ่ม version เพื่อ migration
      migrate: (persistedState, version) => {
        if (version < 2) {
          // เพิ่ม default values สำหรับ fields ใหม่
          return {
            ...persistedState,
            paymentMethodUseDiscount: "CASH",
          };
        }
        return persistedState;
      },
      onRehydrateStorage: (state) => {
        console.log("Hydration starts for discount store");
        return (state, error) => {
          if (error) {
            console.log("An error happened during hydration:", error);
          } else {
            console.log("Hydration finished for discount store");
          }
        };
      },
    }
  )
);

export default useDiscountStore;
