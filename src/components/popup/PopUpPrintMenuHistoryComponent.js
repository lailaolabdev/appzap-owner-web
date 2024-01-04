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
  getMenuReport,
  getUserReport,
} from "../../services/report";
import _ from "lodash";

export default function PopUpPrintMenuHistoryComponent({
  open,
  onClose,
  children,
}) {
  let billRef = useRef(null);
  // state
  const [selectPrinter, setSelectPrinter] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [menuReport, setMenuReport] = useState([]);

  // provider
  const { printers, storeDetail } = useStore();
  // useEffect
  useEffect(() => {
    getMenuReportData(startDate);
  }, [startDate]);

  // function
  const onPrintBill = async () => {
    try {
      let urlForPrinter = "";

      let dataImageForPrint = await html2canvas(billRef.current, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 1,
      });

      urlForPrinter = "http://localhost:9150/usb/image";

      const myPrinter = JSON.parse(selectPrinter);

      if (myPrinter?.type === "ETHERNET") {
        urlForPrinter = "http://localhost:9150/ethernet/image";
      }
      if (myPrinter?.type === "BLUETOOTH") {
        urlForPrinter = "http://localhost:9150/bluetooth/image";
      }
      if (myPrinter?.type === "USB") {
        urlForPrinter = "http://localhost:9150/usb/image";
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", myPrinter?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);

      await axios({
        method: "post",
        url: urlForPrinter,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      await Swal.fire({
        icon: "success",
        title: "ປິນສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "ປິນບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const getMenuReportData = async (startDate) => {
    try {
      const endDate = startDate;
      const startTime = "00:00:00";
      const endTime = "23:59:59";
      // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      // const data = await getBillReport(storeDetail._id, findBy);

      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getMenuReport(storeDetail?._id, findBy);

      setMenuReport(data);
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
        <BsPrinter /> ປິນ
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
              ລາຍງານຍອດຂາຍຕາເມນູ
            </div>
            <div style={{ fontWeight: "bold" }}>
              ເລີ່ມ: {startDate} 00:00:00
            </div>
            <div style={{ fontWeight: "bold" }}>ຫາ: {startDate} 23:59:59</div>
            <hr style={{ borderBottom: "1px dotted #000" }} />
            <TableComponent>
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ textAlign: "left" }}>#</td>
                <td style={{ textAlign: "center" }}>ເມນູ</td>
                <td style={{ textAlign: "center" }}>ອໍເດີສຳເລັດ</td>
                <td style={{ textAlign: "center" }}>ຍົກເລີກ</td>
                <td style={{ textAlign: "right" }}>ຍອດຂາຍ</td>
              </tr>
              {menuReport?.map((e, i) => (
                <tr>
                  <td style={{ textAlign: "left" }}>{i + 1}</td>
                  <td style={{ textAlign: "center" }}>{e?.name || "%NULL%"}</td>
                  <td style={{ textAlign: "center" }}>{e?.served || 0}</td>

                  <td style={{ textAlign: "center" }}>{e?.canceled || 0}</td>
                  <td style={{ textAlign: "right" }}>
                    {moneyCurrency(e?.totalSaleAmount)}
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
