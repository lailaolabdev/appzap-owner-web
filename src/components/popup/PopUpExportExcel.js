import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import Axios from "axios";
import { saveAs } from "file-saver";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { errorAdd } from "../../helpers/sweetalert";
import { END_POINT_EXPORT } from "../../constants/api";
import { useStore } from "../../store";

export default function PopUpExportExcel({ open, onClose, setPopup }) {
  // provider
  const { storeDetail } = useStore();
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  // state

  // useEffect

  const exportTopTen = async () => {
    setPopup({ printReportSale: true });
    try {
      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
      const url =
        END_POINT_EXPORT + "/export/bill?storeId=" + storeDetail?._id + findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const exportBirthday = async () => {
    setPopup({ printReportStaffSale: true });
    try {
      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
      const url =
        END_POINT_EXPORT + "/export/bill?storeId=" + storeDetail?._id + findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <MdOutlineCloudDownload /> {t("chose_export_excel")}
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button style={{ height: 100, padding: 20 }} onClick={exportTopTen}>
            <span>Export Top 10</span>
          </Button>
          <Button style={{ height: 100, padding: 20 }} onClick={exportBirthday}>
            <span>Export birthday of customer</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
