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
  getBillReport,
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

export default function PopUpPrintStaffHistoryComponent({
  open,
  onClose,
  children,
}) {
  const { t } = useTranslation();
  let billRef = useRef(null);
  // state
  const [selectPrinter, setSelectPrinter] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [userReport, setUserReport] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState(null);
  const [shiftDate, setShiftDate] = useState(null);
  // provider
  const { printerCounter, printers, profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();

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
  // useEffect
  useEffect(() => {
    getUserReportData(startDate);
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
        findBy += `&shiftId=${shiftId}`;
      }
    } else {
      findBy += `startDate=${startDate}&`;
      findBy += `endDate=${endDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;
      if (shiftCurrent[0]) {
        findBy += `&shiftId=${shiftCurrent[0]?._id}`;
      }
    }

    return findBy;
  };
  const getUserReportData = async (startDate) => {
    try {
      const data = await getUserReport(storeDetail?._id, findByData());
      setUserReport(data);
    } catch (err) {}
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
      getUserReportData(startDate);
      setShiftDate(null);
    } else {
      setShiftId(option?.value?.shiftID);
      setShiftDate(option?.value);
    }
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
                <div className="flex gap-1 items-center">
                  <Select
                    placeholder={t("chose_shift")}
                    className="w-36 border-orange-500"
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
              {t("staff_sales_report")}
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
            {userReport?.length > 0 &&
              userReport?.map((e) => (
                <div>
                  <hr style={{ borderBottom: "1px dotted #000" }} />
                  {[
                    {
                      name: `${t("staff_name")}:`,
                      value: e?.["userId"]?.["userId"],
                      type: "default",
                    },
                    // {
                    //   name: "ຈຳນວນອໍເດີທັງໝົດ:",
                    //   value: e["ຈຳນວນອໍເດີທັງໝົດ"],
                    // },
                    {
                      name: `${t("order_success_amount")}`,
                      value: e?.["served"],
                    },
                    // {
                    //   name: "ຈຳນວນອໍເດີຍົກເລີກ:",
                    //   value: e["ຈຳນວນອໍເດີຍົກເລີກ"],
                    //   type: storeDetail?.firstCurrency,
                    // },
                    {
                      name: `${t("total_success_order")}`,
                      value: e?.["totalSaleAmount"],
                      type: storeDetail?.firstCurrency,
                    },
                  ].map((e) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ textAlign: "left", fontWeight: "bold" }}>
                        {e?.name}
                      </span>
                      <span style={{ textAlign: "right", fontWeight: "bold" }}>
                        {e?.type == "default"
                          ? e?.value
                          : `${moneyCurrency(e?.value)} ${e?.type || ""}`}
                      </span>
                    </div>
                  ))}
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
