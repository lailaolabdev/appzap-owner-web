import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import axios from "axios";
import { saveAs } from "file-saver";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { errorAdd } from "../../helpers/sweetalert";
import { END_POINT_EXPORT } from "../../constants/api";

import { useStoreStore } from "../../zustand/storeStore";
import { useStore } from "../../store";

export default function PopUpReportExportExcel({
  open,
  onClose,
  setPopup,
  shiftId,
  shiftData,
}) {
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { profile } = useStore();
  const { t } = useTranslation();

  const findByData = () => {
    let findBy = "?";
    if (profile?.data?.role === "APPZAP_ADMIN") {
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
        if (shiftId) {
          findBy += `shiftId=${shiftId}&`;
        }
      } else {
        findBy += `startDate=${storeDetail?.startDateReportExport}&`;
        findBy += `endDate=${storeDetail?.endDateReportExport}&`;
        findBy += `startTime=${storeDetail?.startTimeReportExport}&`;
        findBy += `endTime=${storeDetail?.endTimeReportExport}`;
        if (shiftId) {
          findBy += `shiftId=${shiftId}&`;
        }
      }
    } else {
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
        if (shiftData) {
          findBy += `shiftId=${shiftData?._id}&`;
        }
      } else {
        findBy += `&startDate=${storeDetail?.startDateReportExport}&`;
        findBy += `endDate=${storeDetail?.endDateReportExport}&`;
        findBy += `startTime=${storeDetail?.startTimeReportExport}&`;
        findBy += `endTime=${storeDetail?.endTimeReportExport}&`;
        if (shiftData) {
          findBy += `shiftId=${shiftData?._id}&`;
        }
      }
    }
    return findBy;
  };
  const downloadExcel = async () => {
    setPopup({ ReportExport: false });
    try {
      let findBy = "";
      if (profile?.data?.role === "APPZAP_ADMIN") {
        findBy += `&dateFrom=${storeDetail?.startDateReportExport}&`;
        findBy += `dateTo=${storeDetail?.endDateReportExport}&`;
        findBy += `timeFrom=${storeDetail?.startTimeReportExport}&`;
        findBy += `timeTo=${storeDetail?.endTimeReportExport}&`;
        if (shiftId) {
          findBy += `shiftId=${shiftId}&`;
        }
      } else {
        findBy += `&dateFrom=${storeDetail?.startDateReportExport}&`;
        findBy += `dateTo=${storeDetail?.endDateReportExport}&`;
        findBy += `timeFrom=${storeDetail?.startTimeReportExport}&`;
        findBy += `timeTo=${storeDetail?.endTimeReportExport}&`;
        if (shiftData) {
          findBy += `shiftId=${shiftData?._id}&`;
        }
      }
      const url = `${END_POINT_EXPORT}/export/bill?storeId=${storeDetail?._id}${findBy}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        // biome-ignore lint/style/useTemplate: <explanation>
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
      const url = `${END_POINT_EXPORT}/export/report-promotion/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("promotion")}.xlsx` || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const bankTotalAmount = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-bank${findByData()}&storeId=${
        storeDetail?._id
      }`;
      console.log("url: ", url);
      const _res = await axios.get(url);
      console.log("_res: ", url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("bank_total")}.xlsx` || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const currencyExport = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-currency${findByData()}&storeId=${
        storeDetail?._id
      }`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("all_curency")}` + ".xlsx" || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };

  const Billdetail = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-bill/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.post(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
      const url = `${END_POINT_EXPORT}/export/report-user/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("staff_info")}.xlsx` || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const DialySales = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-daily/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("dialy_sales")}.xlsx` || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const MenuType = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-category/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("menu_type")}.xlsx` || "export.xlsx"
        );
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const MenuInfo = async () => {
    setPopup({ ReportExport: false });
    try {
      const url = `${END_POINT_EXPORT}/export/report-menu-detail/${
        storeDetail?._id
      }${findByData()}`;
      const _res = await axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
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
          `${storeDetail?.name} ${t("menu_info")}.xlsx` || "export.xlsx"
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
          <Button
            style={{ height: 100, padding: 20, width: 200 }}
            onClick={currencyExport}
          >
            <span>{t("all_curency")}</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
