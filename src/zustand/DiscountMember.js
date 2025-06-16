import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Swal from "sweetalert2";
import { useStoreStore } from "./storeStore"; // Adjust path as needed

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
      t: (key) => key, // Translation function placeholder

      // Actions to update state
      setTotalBill: (amount) => set({ totalBill: amount }),
      setDiscountType: (type) => set({ discountType: type }),
      setDiscountValue: (value) => set({ discountValue: value }),
      setSelectedMethod: (method) => set({ selectedMethod: method }),
      setUseTwoDiscount: (use) => set({ useTwoDiscount: use }),
      setMemberDataSearch: (data) => set({ memberDataSearch: data }),
      setDataBillEdit: (data) => set({ dataBillEdit: data }),
      setTranslationFunction: (translateFn) => set({ t: translateFn }),

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

        // Get storeDetail from useStoreStore
        const storeDetail = useStoreStore.getState().storeDetail;

        let TotalDiscountFinal = totalBill;

        // 1. Apply member and/or manual discount if not using points
        if (discountType === "PERCENT") {
          console.log("log 1");
          // Combine member and manual discount if both exist
          if (discountType === "PERCENT" && discountValue > 0) {
            // ໃຫ້ສ່ວນຫຼຸດໃບບິນເປັນເປີເຊັນ
            console.log("log 1.1");
            if (
              discountValue > 0 &&
              memberDataSearch?.discountPercentage > 0 &&
              selectedMethod !== "USEPOINT" &&
              useTwoDiscount
            ) {
              console.log("log 1.2");
              // ໃຫ້ສ່ວນຫຼຸດໃບບິນ ແລະ ສະມາຊິກເປັນເປີເຊັນ ຕ້ອງກົດ ຢືນຢັນ
              const memberDiscount =
                parseInt(memberDataSearch?.discountPercentage) || 0;
              const manualDiscount = parseInt(discountValue) || 0;
              const totalDiscount = memberDiscount + manualDiscount;
              TotalDiscountFinal =
                totalBill - (totalBill * totalDiscount) / 100;
            } else {
              console.log("log 1.3");
              // ໃຫ້ສ່ວນຫຼຸດໃບບິນ ແລະ ສະມາຊິກເປັນເປີເຊັນ ບໍ່ຕ້ອງກົດ ຢືນຢັນ
              const memberDiscount =
                parseInt(memberDataSearch?.discountPercentage) || 0;
              const manualDiscount = parseInt(discountValue) || 0;
              const totalDiscount = memberDiscount + manualDiscount;
              TotalDiscountFinal =
                totalBill - (totalBill * totalDiscount) / 100;
            }
          } else if (discountType === "LAK") {
            console.log("log 2");
            // ໃຫ້ສ່ວນຫຼຸດໃບບິນເປັນຈຳນວນເງິນ
            TotalDiscountFinal = TotalDiscountFinal - parseInt(discountValue);
          } else if (
            memberDataSearch?.discountPercentage !== undefined &&
            memberDataSearch?.discountPercentage > 0 &&
            selectedMethod === "USEPERCENT"
          ) {
            // ມີຄະແນນທີ່ຕັ້ງຄ່າມາກັບເມນູແຕ່ຕ້ອງການໃຫ້ສ່ວນຫຼຸດ
            console.log("log 3");
            if (
              selectedMethod === "USEPERCENT" &&
              discountType === "PERCENT" &&
              memberDataSearch?.discountPercentage > 0
            ) {
              TotalDiscountFinal =
                totalBill -
                (totalBill * memberDataSearch?.discountPercentage) / 100;
            } else {
              TotalDiscountFinal =
                totalBill - (totalBill * parseInt(discountValue)) / 100;
            }
          } else if (
            // ໃຫ້ສ່ວນຫຼຸດກັບສະມາຊິກແບບບໍ່ມີໃນໃບບິນ
            memberDataSearch?.discountPercentage !== undefined &&
            memberDataSearch?.discountPercentage > 0 &&
            selectedMethod === "USEPOINT"
          ) {
            console.log("log 4");
            if (discountType === "PERCENT" && discountValue > 0) {
              console.log("log 4.1");
              Swal.fire({
                icon: "warning",
                title: t("noti"),
                text: `ມີການໃຊ້ສ່ວນຫຼຸດບິນແລ້ວ ${discountValue} ${
                  discountType === "PERCENT" ? "%" : storeDetail?.firstCurrency
                } ທ່ານຕ້ອງການໃຊ້ທັງສອງເລີຍບໍ່`,
                showDenyButton: true,
                confirmButtonText: "ຢືນຢັນ",
                denyButtonText: "ຍົກເລິກ",
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  set({ useTwoDiscount: true });
                } else if (result.isDenied) {
                  set({ useTwoDiscount: false });
                }
              });
            } else if (
              selectedMethod === "USEPERCENT" &&
              discountType === "PERCENT" &&
              discountValue > 0
            ) {
              console.log("log 4.2");
              TotalDiscountFinal =
                totalBill -
                (totalBill * memberDataSearch?.discountPercentage) / 100;
            } else if (
              selectedMethod === "USEPERCENT" &&
              discountType === "PERCENT" &&
              discountValue === 0 &&
              totalBill * memberDataSearch?.discountPercentage > 0
            ) {
              console.log("log 4.3");
              TotalDiscountFinal =
                totalBill -
                (totalBill * memberDataSearch?.discountPercentage) / 100;
            }
            // else {
            //   console.log("log 4.4");
            //   TotalDiscountFinal =
            //     totalBill -
            //     (totalBill * memberDataSearch?.discountPercentage) / 100;
            // }
          }
        } else if (discountType === "LAK") {
          console.log("log 5");
          if (
            selectedMethod === "USEPERCENT" &&
            memberDataSearch?.discountPercentage > 0
          ) {
            console.log("log 5.1");
            let DiscountFinalLAK = TotalDiscountFinal - parseInt(discountValue);
            TotalDiscountFinal =
              DiscountFinalLAK -
              (DiscountFinalLAK * memberDataSearch?.discountPercentage) / 100;
          } else {
            if (
              selectedMethod === "USEPOINT" &&
              memberDataSearch?.discountPercentage > 0
            ) {
              console.log("log 5.1.1");
              const totalDiscountFinalLAK =
                TotalDiscountFinal - parseInt(discountValue);
              TotalDiscountFinal =
                totalDiscountFinalLAK -
                (totalDiscountFinalLAK * memberDataSearch?.discountPercentage) /
                  100;
            } else {
              console.log("log 5.1.2");
              TotalDiscountFinal = TotalDiscountFinal - parseInt(discountValue);
            }
          }
        }
        // 2. If no member discount, but bill edit discount exists
        else if (dataBillEdit?.discount > 0) {
          TotalDiscountFinal =
            totalBill - (totalBill * dataBillEdit.discount) / 100;
        } else if (
          memberDataSearch?.discountPercentage !== undefined &&
          memberDataSearch?.discountPercentage > 0
        ) {
          TotalDiscountFinal =
            totalBill -
            (totalBill * memberDataSearch?.discountPercentage) / 100;
        }

        // 4. Prevent negative total
        if (TotalDiscountFinal < 0) TotalDiscountFinal = 0;

        return TotalDiscountFinal;
      },

      // Helper function to reset discount state
      resetDiscount: () =>
        set({
          discountType: "PERCENT",
          discountValue: 0,
          useTwoDiscount: false,
        }),

      // Helper function to apply discount and update state
      applyDiscount: () => {
        const discountedTotal = get().calculateDiscountedTotal();
        // You can add additional logic here if needed
        return discountedTotal;
      },
    }),
    {
      name: "discount-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist specific fields that you want to keep
        totalBill: state.totalBill,
        discountType: state.discountType,
        discountValue: state.discountValue,
        selectedMethod: state.selectedMethod,
        useTwoDiscount: state.useTwoDiscount,
        memberDataSearch: state.memberDataSearch,
        dataBillEdit: state.dataBillEdit,
        // Note: We don't persist functions like 't' and calculation functions
      }),
      version: 1, // Version for migration if needed
      onRehydrateStorage: (state) => {
        console.log("Hydration starts for discount store");

        // Return a function that will be called when hydration is finished
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
