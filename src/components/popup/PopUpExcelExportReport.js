import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import { BsPrinter } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { MdOutlineCloudDownload } from "react-icons/md";
import { END_POINT_EXPORT } from "./../../constants/api";
import Axios from "axios";
import { saveAs } from "file-saver";
import { errorAdd } from "../../helpers/sweetalert";

import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpExcelExportReport({ open, onClose, setPopup }) {
  const { t } = useTranslation();
  // state
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

  const exportPromotion = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url =
        END_POINT_EXPORT +
        "/export/report-promotion/" +
        storeDetail?._id +
        findBy;
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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
  const exportBill = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `${storeDetail?._id}?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url = END_POINT_EXPORT + "/export/report-bill/" + findBy;
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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
  const exportEmployee = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `${storeDetail?._id}?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url = END_POINT_EXPORT + "/export/report-user/" + findBy;
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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
  const exportDaily = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `${storeDetail?._id}?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url = END_POINT_EXPORT + "/export/report-daily/" + findBy;
      console.log("URLDaily: ", url);
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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
  const exportMenuType = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `${storeDetail?._id}?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url = END_POINT_EXPORT + "/export/report-category/" + findBy;
      console.log("URL: ", url);
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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
  const exportMenu = async () => {
    setPopup({ exportReport: false });
    try {
      const findBy = `${storeDetail?._id}?startDate=${storeDetail?.start_date}&endDate=${storeDetail?.end_date}&endTime=${storeDetail?.end_time}&startTime=${storeDetail?.start_time}`;
      const url = END_POINT_EXPORT + "/export/report-menu-detail/" + findBy;
      const _res = await Axios.post(url, storeDetail?.selectedTableIds);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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

  // useEffect

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
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportSale: true })}
          >
            <span>{t("sales_info")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportPromotion()}
          >
            <span>{t("promotion")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportBill()}
          >
            <span>{t("bill_detial")}</span>
          </Button>

          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportEmployee()}
          >
            <span>{t("staff_info")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportDaily()}
          >
            <span>{t("dialy_sales")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportMenuType()}
          >
            <span>{t("menu_type")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportMenu()}
          >
            <span>{t("menu_info")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => exportMenu()}
          >
            <span>{t("all_curency")}</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
