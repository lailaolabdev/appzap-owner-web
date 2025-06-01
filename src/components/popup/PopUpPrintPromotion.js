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
  getPromotionReport,
  getPromotionReportDisCountAndFree,
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

export default function PopUpPrintPromotion({
  open,
  onClose,
  selectedTableIds,
  children,
}) {
  const billRef = useRef(null);
  const { t } = useTranslation();

  // State
  const [selectPrinter, setSelectPrinter] = useState("select");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [shiftData, setShiftData] = useState([]);
  const [shiftDate, setShiftDate] = useState(null);
  const [shiftId, setShiftId] = useState(null);
  const [promotionDiscountAndFreeReport, setPromotionDiscountAndFreeReport] =
    useState();
  const [loading, setLoading] = useState(false);
  const [dataDiscountItems, setDataDiscountItems] = useState([]);
  const [dataFreeItems, setDataFreeItems] = useState([]);
  const [promotionReport, setPromotionReport] = useState();

  // Default time values (full day)
  const startTime = "00:00:00";
  const endTime = "23:59:59";

  // Provider
  const { printers, printerCounter, profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent, OpenShiftForCounter } = useShiftStore();

  // Fetch shift data
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

  useEffect(() => {
    getPromotionDiscountAndFreeReportData();
    getPromotionReportData();
  }, [selectedDate, shiftId]);

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
    } else {
      setShiftId(option?.value?.shiftID);
      setShiftDate(option?.value);
    }
  };

  // Print functionality
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
    let findBy = "?";

    if (profile?.data?.role === "APPZAP_ADMIN") {
      findBy += `startDate=${selectedDate}&`;
      findBy += `endDate=${selectedDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;

      if (shiftId) {
        findBy += `shiftId=${shiftId}&`;
      }
    } else {
      findBy += `startDate=${selectedDate}&`;
      findBy += `endDate=${selectedDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;
      if (shiftCurrent?.[0]) {
        findBy += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    return findBy;
  };

  const getPromotionDiscountAndFreeReportData = async () => {
    setLoading(true);
    try {
      const data = await getPromotionReportDisCountAndFree(
        storeDetail?._id,
        findByData(),
        selectedTableIds
      );
      setPromotionDiscountAndFreeReport(data);
      setDataDiscountItems(data?.discountedMenus || []);
      setDataFreeItems(data?.freeMenus || []);
    } catch (error) {
      console.error("Error fetching promotion data:", error);
      setDataDiscountItems([]);
      setDataFreeItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getPromotionReportData = async () => {
    setLoading(true);
    const data = await getPromotionReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setPromotionReport(data);
    setLoading(false);
  };

  const TotalPriceFreeItems = () => {
    return dataFreeItems?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price;
    }, 0);
  };

  const TotalPriceDicount = () => {
    return dataDiscountItems?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.priceDiscount;
    }, 0);
  };

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("promotion")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Single date selection */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <div className="flex items-center gap-2">
            <div>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <label className="mb-1 block">{t("shift")}</label>
                  <Select
                    placeholder={t("chose_shift")}
                    className="min-w-[170px] w-full border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )
            : storeDetail?.isShift &&
              OpenShiftForCounter && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Select
                    placeholder={`${t("plachoder_shift")}...`}
                    className="min-w-[170px] w-full border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center my-4">
            <p>{t("loading")}...</p>
          </div>
        ) : (
          <div ref={billRef}>
            <div className="mb-4">
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                {t("ບິນສວນຫຼຸດ")}
                {shiftDate ? ` (${shiftDate?.name})` : ""}
              </div>
              <hr style={{ borderBottom: "1px dotted #000" }} />
            </div>

            <>
              <div className="grid grid-cols-[1fr_auto] gap-2 py-2 border-b font-medium mb-2">
                <div>{t("discount_bill")}</div>
                <div>{promotionReport?.[0]?.count || 0}</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 py-2 border-b font-medium">
                <div>{t("all_discount")}</div>
                <div>
                  {moneyCurrency(promotionReport?.[0]?.totalSaleAmount || 0)}{" "}
                  {storeDetail?.firstCurrency}
                </div>
              </div>
            </>

            <div className="mt-10">
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                {t("ລາຍການເມນູສ່ວນຫຼຸດ")}
                {shiftDate ? ` (${shiftDate?.name})` : ""}
              </div>
              <hr style={{ borderBottom: "1px dotted #000" }} />
            </div>

            <table style={{ width: "100%" }}>
              <thead>
                <tr className="border-b">
                  <th className="text-left">{t("no")}</th>
                  <th className="text-left">{t("name")}</th>
                  <th className="text-right">{t("ລາຄາປົກກະຕິ")}</th>
                  <th className="text-right">{t("ລາຄາສ່ວນຫຼຸດ")}</th>
                  <th className="text-right">{t("ຈຳນວນທີ່ຫຼຸດ")}</th>
                </tr>
              </thead>
              <tbody>
                {dataDiscountItems?.length > 0 ? (
                  dataDiscountItems?.map((m, index) => (
                    <tr key={m?._id} className="border-b">
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{m?.name}</td>
                      <td className="text-right">{moneyCurrency(m?.price)}</td>
                      <td className="text-right">
                        {moneyCurrency(
                          Math.max(m?.price - m?.priceDiscount),
                          0
                        )}
                      </td>
                      <td className="text-right">
                        {moneyCurrency(m?.priceDiscount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex justify-center">
                        <p className="text-[16px] font-bold text-gray-900">
                          ບໍ່ມີລາຍການ
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-2">
              <p className="text-orange-500 text-[18px] pt-3 font-bold">
                ລວມຈຳນວນທີ່ຫຼຸດທັງໝົດ : {moneyCurrency(TotalPriceDicount())}{" "}
                {storeDetail?.firstCurrency}
              </p>
            </div>

            <div className="mt-4">
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                {t("ລາຍການເມນູແຖມ")}
              </div>
              <hr style={{ borderBottom: "1px dotted #000" }} />
            </div>

            <table style={{ width: "100%" }}>
              <thead>
                <tr className="border-b">
                  <th className="text-left">{t("no")}</th>
                  <th className="text-left">{t("name")}</th>
                  <th className="text-right">{t("price")}</th>
                </tr>
              </thead>
              <tbody>
                {dataFreeItems.length > 0 ? (
                  dataFreeItems?.map((m, index) => (
                    <tr key={m?._id} className="border-b">
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{m?.name}</td>
                      <td className="text-right">{moneyCurrency(m?.price)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex justify-center">
                        <p className="text-[16px] font-bold text-gray-900">
                          ບໍ່ມີລາຍການ
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-end mt-2">
              <p className="text-orange-500 text-[18px] pt-3 font-bold">
                ລວມຈຳນວນລາຄາແຖມທັງໝົດ : {moneyCurrency(TotalPriceFreeItems())}{" "}
                {storeDetail?.firstCurrency}
              </p>
            </div>
          </div>
        )}
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
