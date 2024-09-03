import moment from "moment";
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
  getCategoryReport,
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

export default function PopUpPrintMenuCategoryHistoryComponent({
  open,
  onClose,
  children,
}) {
  const { t } = useTranslation();
  let billRef = useRef(null);
  // state
  const [selectPrinter, setSelectPrinter] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [categoryReport, setCategoryReport] = useState([]);

  // provider
  const { printerCounter, printers, storeDetail } = useStore();
  // useEffect
  useEffect(() => {
    getCategoryReportData(startDate);
  }, [startDate]);

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
          beep: 1,
          width: myPrinter?.width === "58mm" ? 350 : 550,
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
        title: `${t("print_sucess")}`,
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
  const getCategoryReportData = async (startDate) => {
    try {
      const endDate = startDate;
      const startTime = "00:00:00";
      const endTime = "23:59:59";
      // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      // const data = await getBillReport(storeDetail._id, findBy);

      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getCategoryReport(storeDetail?._id, findBy);

      setCategoryReport(data);
      // logic
      // setReportBill({
      //   ຈຳນວນອໍເດີທັງໝົດ: countBill,
      //   ຈຳນວນອໍເດີທີ່ສຳເລັດ: totalBill,
      //   ຈຳນວນອໍເດີຍົກເລີກ: cashTotalBill,
      //   ຈ່າຍເງິນໂອນ: transferTotalBill,
      // });
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
        <div>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div
          ref={billRef}
          style={{ maxWidth: 330, width: "100%", minWidth: 330 }}
        >
          <Container>
            <div style={{ fontWeight: "bold", fontSize: 24 }}>
              {t("sales_by_type")}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {t("start")}: {startDate} 00:00:00
            </div>
            <div style={{ fontWeight: "bold" }}>
              {t("to")}: {startDate} 23:59:59
            </div>
            <hr style={{ borderBottom: "1px dotted #000" }} />
            <TableComponent>
              <tr>
                <td style={{ textAlign: "left" }}>#</td>
                <th style={{ textAlign: "center" }}>{t("menu_type")}</th>
                <th style={{ textAlign: "center" }}>{t("success_order")}</th>
                <th style={{ textAlign: "center" }}>{t("cancel")}</th>
                <th style={{ textAlign: "right" }}>{t("sale_price_amount")}</th>
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
            </TableComponent>
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
