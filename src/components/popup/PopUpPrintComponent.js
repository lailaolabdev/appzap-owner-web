import moment from "moment";
import Select from "react-select";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import axios from "axios";
import { base64ToBlob } from "../../helpers";
import { useStore } from "../../store";
import { moneyCurrency } from "../../helpers/index";
import {
  getActiveBillReport,
  getBankReport,
  getBillReport,
  getCurrencyReport,
  getDeliveryReport,
  getMoneyReport,
  getDebtReport,
  getCategoryReport,
} from "../../services/report";

import _ from "lodash";
import {
  BLUETOOTH_PRINTER_PORT,
  ETHERNET_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants";
import { useTranslation } from "react-i18next";
import printFlutter from "../../helpers/printFlutter";

import { useStoreStore } from "../../zustand/storeStore";
import { getAllShift } from "./../../services/shift";
import { useShiftStore } from "../../zustand/ShiftStore";

export default function PopUpPrintComponent({ open, onClose, children }) {
  const billRef = useRef(null);
  const { t } = useTranslation();
  // state
  const [selectPrinter, setSelectPrinter] = useState("select");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [bills, setBill] = useState();
  const [bank, setBank] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [shiftDate, setShiftDate] = useState(null);
  const [shiftId, setShiftId] = useState(null);
  const [currency, setcurrency] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [moneyReport, setMoneyReport] = useState([]);
  const [debtReport, setDebtReport] = useState(null);
  const [categoryReport, setCategoryReport] = useState([]);
  const [reportBill, setReportBill] = useState({
    totalAmount: 0,
    billCount: 0,
    cashAmount: 0,
    transferAmount: 0,
    discountBills: 0,
    servicechange: 0,
    discounts: 0,
    pendingBills: 0,
    pendingAmount: 0,
  });

  // provider
  const { printers, printerCounter, profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();

  // useEffect
  useEffect(() => {
    // console.log("printers: ", billRef.current);
    getDataBillReport(startDate);
    getMoneyReportData(startDate);
    getDebtReportData(startDate);
    getCategoryReportData(startDate);
  }, [startDate, shiftId]);

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShiftData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchShift();
  }, []);

  useEffect(() => {
    if (open && printers?.length > 0) {
      setSelectPrinter(JSON.stringify(printers[0]));
    }
  }, [open, printers]);

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shiftData ?? []).map((item) => {
      return {
        value: {
          shiftID: item._id,
          startTime: item.startTime,
          endTime: item.endTime,
          name: item.shiftName,
        },
        label: item.shiftName,
      };
    }),
  ];

  const handleSearchInput = (option) => {
    if (option?.value?.shiftID === "ALL") {
      setShiftId(null);
      setShiftDate(null);
      getDataBillReport(startDate);
      getMoneyReportData(startDate);
    } else {
      setShiftId(option?.value?.shiftID);
      setShiftDate(option?.value);
    }
  };

  // function
  const onPrintBill = async () => {
    try {
      let urlForPrinter = "";

      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      const dataImageForPrint = await html2canvas(billRef.current, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 1,
      });

      urlForPrinter = USB_PRINTER_PORT;

      const myPrinter = JSON.parse(selectPrinter);

      if (myPrinter?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      }
      if (myPrinter?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      }
      if (myPrinter?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      const bodyFormData = new FormData();
      bodyFormData.append("ip", myPrinter?.ip);
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", myPrinter?.width === "58mm" ? 58 : 80);

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" }
      // });

      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: myPrinter?.width === "58" ? 400 : 580,
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );

      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const findByData = () => {
    const endDate = startDate; // Same date range for a single day
    const startTime = "00:00:00";
    const endTime = "23:59:59";
    let findBy = "?";

    if (profile?.data?.role === "APPZAP_ADMIN") {
      findBy += `startDate=${startDate}&`;
      findBy += `endDate=${endDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;

      if (shiftId) {
        findBy += `shiftId=${shiftId}&`;
      }
    } else {
      findBy += `startDate=${startDate}&`;
      findBy += `endDate=${endDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;
      if (shiftCurrent?.[0]) {
        findBy += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    return findBy;
  };

  const getMoneyReportData = async (startDate) => {
    const data = await getMoneyReport(storeDetail?._id, findByData());
    setMoneyReport(data);
  };

  const getDebtReportData = async (startDate) => {
    try {
      let findBy = `?storeId=${storeDetail?._id}`;
      const endDate = startDate; // Same date range for a single day
      const startTime = "00:00:00";
      const endTime = "23:59:59";
      findBy = `${findBy}&startDate=${encodeURIComponent(
        startDate
      )}&startTime=${encodeURIComponent(
        startTime || "00:00:00"
      )}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(
        endTime || "23:59:59"
      )}`;
      const data = await getDebtReport(findBy);
      setDebtReport(data?.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDebtReport(0);
    }
  };

  const getDataBillReport = async (startDate) => {
    try {
      const data = await getBillReport(storeDetail._id, findByData());
      const activeBillData = await getActiveBillReport(
        storeDetail._id,
        findByData()
      );

      const bankReport = await getBankReport(storeDetail._id, findByData());
      const currencyReport = await getCurrencyReport(
        storeDetail._id,
        findByData()
      );
      // const findByData() = `?startDate=${startDate}&endDate=${endDate}`;
      const Delivery = await getDeliveryReport(storeDetail?._id, findByData());
      setDelivery(Delivery.response);

      setBank(bankReport);
      setcurrency(currencyReport);

      // Calculate fields
      const countBill = data.length || 0;

      const totalBill = _.sumBy(data, (e) => e.billAmount) || 0;
      const point = _.sumBy(data, (e) => e.point) || 0;

      const cashTotalBill =
        _.sumBy(
          data.filter(
            (e) =>
              e.paymentMethod === "CASH" || e.paymentMethod === "TRANSFER_CASH"
          ),
          (e) =>
            e.paymentMethod === "TRANSFER_CASH" ? e.payAmount : e.billAmount
        ) || 0;

      const transferTotalBill =
        _.sumBy(
          data.filter(
            (e) =>
              e.paymentMethod === "TRANSFER" ||
              e.paymentMethod === "TRANSFER_CASH"
          ),
          (e) =>
            e.paymentMethod === "TRANSFER_CASH"
              ? e.transferAmount
              : e.billAmount
        ) || 0;

      const discountBill = data.filter((e) => e.discount > 0);
      const discountTotalBill =
        _.sumBy(discountBill, (e) => {
          let discountAmount = 0;
          if (e.discountType === "PERCENT") {
            discountAmount = (e.billAmountBefore * e.discount) / 100;
          } else {
            discountAmount = e.discount || 0; // Assume non-PERCENT discounts are fixed values
          }
          return discountAmount;
        }) || 0;

      const activeBill = data.filter(
        (e) => !e.isCheckout || e.status !== "CHECKOUT"
      ).length;

      const totalActiveBill = _.sumBy(activeBillData, (e) => e.totalBill) || 0;

      // Final validation: Check if calculated total matches totalBill
      const calculatedTotal =
        cashTotalBill + transferTotalBill - discountTotalBill;
      // if (calculatedTotal !== totalBill) {
      //   console.error("Calculation Mismatch Detected!");
      //   console.error(`Expected Total (totalBill): ${totalBill}`);
      //   console.error(`Calculated Total: ${calculatedTotal}`);
      // } else {
      //   console.log("Calculation validated: Total matches!");
      // }

      // Update state or return result
      setReportBill({
        totalAmount: totalBill,
        billCount: countBill,
        cashAmount: cashTotalBill,
        transferAmount: transferTotalBill,
        discountBills: discountBill.length,
        servicechange: 0,
        discounts: discountTotalBill,
        pendingBills: activeBill,
        pendingAmount: totalActiveBill,
      });

      setBill(data); // Set bill data for rendering
    } catch (err) {
      console.error("Error in getDataBillReport:", err);
    }
  };

  const getCategoryReportData = async (startDate) => {
    try {
      const data = await getCategoryReport(storeDetail?._id, findByData());
      setCategoryReport(data);
    } catch (err) {}
  };

  const deliveryReports = delivery
    ? delivery?.revenueByPlatform?.map((e) => {
        return {
          name: e?._id,
          amount: e?.totalRevenue,
        };
      })
    : [];

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <BsPrinter /> {t("print")}
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="flex gap-2 items-center">
          <div>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Select
                    placeholder={t("chose_shift")}
                    className="min-w-[170px] w-full border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )
            : ""}
        </div>

        <div
          ref={billRef}
          style={{ maxWidth: 330, width: "100%", minWidth: 330 }}
        >
          <Container>
            <div style={{ fontWeight: "bold", fontSize: 24 }}>
              {t("sale_amount_list")}
              {shiftDate ? `(${shiftDate?.name})` : ""}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {t("start")}: {startDate}{" "}
              {shiftDate ? shiftDate?.startTime : "00:00:00"}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {t("to")}: {startDate}{" "}
              {shiftDate ? shiftDate?.endTime : "23:59:59"}
            </div>
            <hr style={{ borderBottom: "1px dotted #000" }} />
            {[
              {
                name: `${t("bill_amount")}:`,
                value: moneyReport?.successAmount?.numberOfBills || 0,
              },
              {
                name: `${t("total_amount")}:`,
                value:
                  (moneyReport?.successAmount?.payByCash || 0) +
                  (moneyReport?.successAmount?.transferPayment || 0) +
                  (moneyReport?.successAmount?.point || 0),
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("pay_cash")}:`,
                value: moneyReport?.successAmount?.payByCash || 0,
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("pay_transfer")}:`,
                value: moneyReport?.successAmount?.transferPayment || 0,
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("total_debt")}:`,
                value: debtReport?.totalRemainingAmount,
                type: storeDetail?.firstCurrency,
              },

              ...(Array.isArray(deliveryReports) && deliveryReports.length > 0
                ? deliveryReports.map((e, idx) => ({
                    name: (
                      <div
                        style={{ fontWeight: 700 }}
                      >{`delivery (${e?.name})`}</div>
                    ),
                    value: Math.floor(e?.amount || 0),
                    type: storeDetail?.firstCurrency,
                  }))
                : []),
              {
                name: `${t("point")}:`,
                value: moneyReport?.successAmount?.point || 0,
              },
              {
                name: `${t("discount_bill")}:`,
                value: reportBill?.discountBills,
              },
              {
                name: `${t("service_charge")}:`,
                value: reportBill.servicechange,
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("tax")}:`,
                value: reportBill.tax,
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("discount")}:`,
                value: reportBill?.discounts,
                type: storeDetail?.firstCurrency,
              },
              {
                name: `${t("active_bill")}:`,
                value: reportBill?.pendingBills,
              },

              // {
              //   name: "ເງິນຄ້າງ:",
              //   value: reportBill["ເງິນຄ້າງ"],
              //   type: storeDetail?.firstCurrency,
              // },
            ].map((e) => (
              <div
                key={e?.name}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ textAlign: "left", fontWeight: "bold" }}>
                  {e?.name}
                </span>
                <span style={{ textAlign: "right", fontWeight: "bold" }}>
                  {moneyCurrency(e?.value)} {e?.type}
                </span>
              </div>
            ))}
            {bank?.data?.length > 0 && (
              <>
                <hr style={{ borderBottom: "1px dotted #000" }} />
                <div>
                  <TableComponent>
                    <tr style={{ fontWeight: "bold" }}>
                      <td style={{ textAlign: "left" }}>{t("no")}</td>
                      <td style={{ textAlign: "center" }}>{t("bank_Name")}</td>
                      <td style={{ textAlign: "right" }}>{t("amount")}</td>
                    </tr>
                    {bank?.data?.map((e, index) => {
                      return (
                        <tr key={e?._id}>
                          <td style={{ textAlign: "left" }}>{index + 1}</td>
                          <td style={{ textAlign: "center" }}>
                            {e?.bankDetails?.bankName}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {moneyCurrency(e?.bankTotalAmount)}
                          </td>
                        </tr>
                      );
                    })}
                  </TableComponent>
                </div>
              </>
            )}
            {currency?.data?.length > 0 && (
              <>
                <hr style={{ borderBottom: "1px dotted #000" }} />
                <div>
                  <TableComponent>
                    <tr style={{ fontWeight: "bold" }}>
                      <td style={{ textAlign: "left" }}>{t("no")}</td>
                      <td style={{ textAlign: "center" }}>{t("ccrc")}</td>
                      <td style={{ textAlign: "right" }}>{t("amount")}</td>
                    </tr>
                    {currency?.data?.map((e, index) => (
                      <tr key={e?._id}>
                        <td style={{ textAlign: "left" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>
                          {e?.currency?.currencyName}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {moneyCurrency(Math.floor(e?.currencyTotal))}
                        </td>
                      </tr>
                    ))}
                  </TableComponent>
                </div>
              </>
            )}
            <hr style={{ borderBottom: "1px dotted #000" }} />
            <div>
              <TableComponent>
                <tr>
                  <td style={{ textAlign: "left" }}>#</td>
                  <th style={{ textAlign: "center" }}>{t("menu_type")}</th>
                  <th style={{ textAlign: "center" }}>{t("success_order")}</th>
                  <th style={{ textAlign: "center" }}>{t("cancel")}</th>
                  <th style={{ textAlign: "right" }}>
                    {t("sale_price_amount")}
                  </th>
                </tr>
                {categoryReport
                  ?.sort((x, y) => {
                    return y.served - x.served;
                  })
                  ?.map((e, i) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{i + 1}</td>
                      <td style={{ textAlign: "center" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.served}</td>
                      <td style={{ textAlign: "center" }}>{e?.cenceled}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(e?.totalSaleAmount)}
                        {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))}

                {/* Summary row */}
                <tr className="font-bold pt-2">
                  <td style={{ textAlign: "left" }}></td>
                  <td style={{ textAlign: "center" }}>{t("total")}</td>
                  <td style={{ textAlign: "center" }}>
                    {categoryReport?.reduce(
                      (sum, item) => sum + (item?.served || 0),
                      0
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {categoryReport?.reduce(
                      (sum, item) => sum + (item?.cenceled || 0),
                      0
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(
                      categoryReport?.reduce(
                        (sum, item) => sum + (item?.totalSaleAmount || 0),
                        0
                      )
                    )}
                    {storeDetail?.firstCurrency}
                  </td>
                </tr>
              </TableComponent>
            </div>
            <hr style={{ borderBottom: "1px dotted #000" }} />
            <div>
              <TableComponent>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ textAlign: "left" }}>#</td>
                  <td style={{ textAlign: "center" }}>{t("no")}</td>
                  <td style={{ textAlign: "center" }}>{t("order")}</td>
                  <td style={{ textAlign: "center" }}>{t("discount")}</td>
                  <td style={{ textAlign: "right" }}>{t("total_bill")}</td>
                </tr>

                {bills?.map((e, i) => (
                  <tr key={e?._id}>
                    <td style={{ textAlign: "left" }}>{i + 1}</td>
                    <td style={{ textAlign: "center" }}>
                      {e?.code || "%NULL%"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {e?.orderId?.length || 0}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {e?.discount !== 0
                        ? moneyCurrency(e?.billAmount - e?.billAmountBefore)
                        : 0}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.billAmount) || moneyCurrency(0)}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>
                    {t("total")}:
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {bills?.reduce(
                      (sum, bill) => sum + (bill?.orderId?.length || 0),
                      0
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {moneyCurrency(
                      bills?.reduce(
                        (sum, bill) =>
                          sum +
                          (bill?.discount !== 0
                            ? bill?.billAmount - bill?.billAmountBefore
                            : 0),
                        0
                      )
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(
                      bills?.reduce(
                        (sum, bill) => sum + (bill?.billAmount || 0),
                        0
                      )
                    )}
                    <span> {storeDetail?.firstCurrency}</span>
                  </td>
                </tr>
              </TableComponent>
            </div>
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Form.Group style={{ display: "flex", gap: 10 }}>
          <Form.Control
            as="select"
            name="width"
            value={selectPrinter}
            onChange={(e) => setSelectPrinter(e.target.value)}
          >
            <option value={"select"}>--{t("selectPrinter")}--</option>
            {printers?.map((e) => (
              <option key={e?._id} value={JSON.stringify(e)}>
                {e?.name}
              </option>
            ))}
          </Form.Control>
          <Button
            onClick={() => {
              onPrintBill();
              onClose();
            }}
          >
            Print
          </Button>
        </Form.Group>
      </Modal.Footer>
    </Modal>
  );
}

const TableComponent = styled("table")({
  width: "100%",
  color: "#000",
  td: {
    padding: 0,
    color: "#000",
  },
});
const Price = styled.div`
  display: flex;
`;
const Container = styled.div`
  color: #000;
  width: 100%;
  max-width: 330px;
  padding-bottom: 30px;
`;
