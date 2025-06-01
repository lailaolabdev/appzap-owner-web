import moment from "moment";
import styled from "styled-components";
import Select from "react-select";
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
  getBillReport,
  getMenuReport,
  getUserReport,
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

export default function PopUpPrintMenuAndCategoryHistoryComponent({
  open,
  onClose,
  children,
}) {
  const { t } = useTranslation();
  let billRef = useRef(null);
  // state
  const [selectPrinter, setSelectPrinter] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [menuReport, setMenuReport] = useState([]);
  const [categoryMenu, setCategoryMenu] = useState([]);

  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState(null);
  const [shiftDate, setShiftDate] = useState(null);

  // provider
  const { printerCounter, printers, profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent, OpenShiftForCounter } = useShiftStore();

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShiftData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
          startTime: item.startTime,
          endTime: item.endTime,
          shiftID: item._id,
          name: item.shiftName,
        },
        label: item.shiftName,
      };
    }),
  ];

  const handleSearchInput = (option) => {
    if (option?.value?.shiftID === "ALL") {
      setShiftId(null);
      getMenuReportData(startDate);
      setShiftDate(null);
    } else {
      setShiftId(option?.value?.shiftID);
      setShiftDate(option?.value);
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
      if (shiftCurrent[0]) {
        findBy += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    return findBy;
  };

  useEffect(() => {
    fetchShift();
  }, []);
  // useEffect
  useEffect(() => {
    let _objectA = {};
    for (let menu of menuReport) {
      if (Array.isArray(_objectA?.[menu?.categories?.name])) {
        _objectA?.[menu?.categories?.name].push(menu);
      } else {
        _objectA[menu?.categories?.name] = [];
        _objectA?.[menu?.categories?.name].push(menu);
      }
    }

    let dataC = [];
    for (const [key, value] of Object.entries(_objectA)) {
      dataC.push({
        name: key,
        value: value,
      });
    }
    setCategoryMenu(dataC);
  }, [menuReport]);
  useEffect(() => {
    getMenuReportData(startDate);
  }, [startDate, shiftId]);

  useEffect(() => {
    if (open && printers?.length > 0) {
      setSelectPrinter(JSON.stringify(printers[0]));
    }
  }, [open, printers]);

  // function
  const onPrintBill = async () => {
    try {
      let urlForPrinter = "";

      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      let dataImageForPrint = await html2canvas(billRef.current, {
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
      var bodyFormData = new FormData();
      bodyFormData.append("ip", myPrinter?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", myPrinter?.width === "58mm" ? 58 : 80);

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: myPrinter?.width === "58mm" ? 400 : 580,
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
  const getMenuReportData = async (startDate) => {
    try {
      const data = await getMenuReport(storeDetail?._id, findByData());

      setMenuReport(data);
    } catch (err) {}
  };

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
        <div
          ref={billRef}
          style={{ maxWidth: 330, width: "100%", minWidth: 330 }}
        >
          <Container>
            <div style={{ fontWeight: "bold", fontSize: 24 }}>
              {t("report_sales_by_type")}
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
            {categoryMenu?.map((item) => (
              <div>
                <div style={{ fontWeight: 700 }}>{item?.name}</div>
                <TableComponent>
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ textAlign: "left" }}>#</td>
                    <td style={{ textAlign: "center" }}>{t("menu")}</td>
                    <td style={{ textAlign: "center" }}>
                      {t("success_order")}
                    </td>
                    <td style={{ textAlign: "center" }}>{t("cancel")}</td>
                    <td style={{ textAlign: "right" }}>
                      {t("sale_price_amount")}
                    </td>
                  </tr>
                  {item?.value?.map((e, i) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{i + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        {e?.name || "%NULL%"}
                      </td>
                      <td style={{ textAlign: "center" }}>{e?.served || 0}</td>

                      <td style={{ textAlign: "center" }}>
                        {e?.canceled || 0}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {e?.totalPointAmount > 0
                          ? moneyCurrency(
                              e?.totalSaleAmount - e?.totalPointAmount
                            )
                          : moneyCurrency(e?.totalSaleAmount)}
                      </td>
                    </tr>
                  ))}
                </TableComponent>
              </div>
            ))}
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Form.Group style={{ display: "flex", gap: 10 }}>
          <Form.Control
            as="select"
            name="width"
            onChange={(e) => setSelectPrinter(e.target.value)}
          >
            {printers?.map((e) => (
              <option value={JSON.stringify(e)}>{e?.name}</option>
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
