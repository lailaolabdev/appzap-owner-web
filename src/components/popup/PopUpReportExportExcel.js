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
import { getLocalData } from "../../constants/api";

export default function PopUpReportExportExcel({ open, onClose, setPopup }) {
  // provider
  const { storeDetail, setStoreDetail } = useStore();
  const { t } = useTranslation();

  const downloadExcel = async () => {
    setPopup({ ReportExport: false });
    try {
      // findBy += `startDate=${storeDetail?.startDayFilter}&`;
      // findBy += `endDate=${storeDetail?.endDayFilter}&`;
      // findBy += `startTime=${storeDetail?.startTimeFilter}&`;
      // findBy += `endTime=${storeDetail?.endTimeFilter}`;
      const findBy = `&dateFrom=${storeDetail?.startDayFilter}&dateTo=${storeDetail?.endDayFilter}&timeTo=${storeDetail?.endTimeFilter}&timeFrom=${storeDetail?.startTimeFilter}`;
      // setLoadingExportCsv(true);
      const url =
        END_POINT_EXPORT + "/export/bill?storeId=" + storeDetail?._id + findBy;
      const _res = await Axios.get(url);

      console.log("_res: " + _res?.data?.exportUrl);

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

      // setLoadingExportCsv(false);
    } catch (err) {
      // setLoadingExportCsv(false);
      errorAdd(`${t("export_fail")}`);
    }
  };

  const Promotions = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT +
        `/export/report-promotion/${storeDetail?._id}` +
        findBy;
      const _res = await Axios.post(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("promotion")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const bankTotalAmount = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT +
        `/export/report-bank${findBy}&storeId=${storeDetail?._id}`;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("bank_total")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const Billdetail = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT + `/export/report-bill/${storeDetail?._id}` + findBy;
      const _res = await Axios.post(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("bill_detial")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const StaffInfo = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT + `/export/report-user/${storeDetail?._id}` + findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("staff_info")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const DialySales = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT + `/export/report-daily/${storeDetail?._id}` + findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("dialy_sales")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const MenuType = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT +
        `/export/report-category/${storeDetail?._id}` +
        findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("menu_type")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const MenuInfo = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "?";
      if (
        storeDetail?.startDayFilter &&
        storeDetail?.endDayFilter &&
        storeDetail?.startTimeFilter &&
        storeDetail?.endTimeFilter
      ) {
        findBy += `startDate=${storeDetail?.startDayFilter}&`;
        findBy += `endDate=${storeDetail?.endDayFilter}&`;
        findBy += `startTime=${storeDetail?.startTimeFilter}&`;
        findBy += `endTime=${storeDetail?.endTimeFilter}`;
      }

      const url =
        END_POINT_EXPORT +
        `/export/report-menu-detail/${storeDetail?._id}` +
        findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        // console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(
          fileBlob,
          `${storeDetail?.name} ${t("menu_info")}` + ".xlsx" || "export.xlsx"
        );
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
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            // onClick={Promotions}
            disabled
          >
            <span>{t("sales_info")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={downloadExcel}
          >
            <span>{t("excel")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={Promotions}
          >
            <span>{t("promotion")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={bankTotalAmount}
          >
            <span>{t("bank_total")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={Billdetail}
          >
            <span>{t("bill_detial")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={StaffInfo}
          >
            <span>{t("staff_info")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={DialySales}
          >
            <span>{t("dialy_sales")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={MenuType}
          >
            <span>{t("menu_type")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={MenuInfo}
          >
            <span>{t("menu_info")}</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
