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

export default function PopUpExportExcel({ open, onClose, setPopup }) {
  // provider
  const { storeDetail, setStoreDetail } = useStore();
  const { t } = useTranslation();

  const exportAllMember = async () => {
    setPopup({ printReportSale: true });
    try {
      // const findBy = `&startDate=${storeDetail?.startDateMember}&endDate=${storeDetail?.endDateMember}&&startTime=${storeDetail?.startTimeMember}&endTime=${storeDetail?.endTimeMember}`;
      let findBy;
      if (
        storeDetail?.startDateMember &&
        storeDetail?.endDateMember &&
        storeDetail?.startTimeMember &&
        storeDetail?.endTimeMember
      ) {
        findBy = `&startDate=${storeDetail?.startDateMember}&endDate=${storeDetail?.endDateMember}&&startTime=${storeDetail?.startTimeMember}&endTime=${storeDetail?.endTimeMember}`;
      }
      const url =
        END_POINT_EXPORT +
        "/export/member?storeId=" +
        storeDetail?._id +
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
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };

  const exportTopTen = async () => {
    setPopup({ printReportSale: true });
    let listTop = storeDetail.limitData ? storeDetail.limitData : 10;
    try {
      const findBy = `&skip=0&limit=${listTop}`;
      const url =
        END_POINT_EXPORT +
        "/export/member-top-award?storeId=" +
        storeDetail?._id +
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
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");
        setStoreDetail({ ...storeDetail, limitData: "" });
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const exportOrders = async () => {
    setPopup({ printReportStaffSale: true });
    try {
      // let findBy = `&storeId=${storeDetail?._id}&startDate=${storeDetail?.startDayFilter}&endDate=${storeDetail?.endDayFilter}&startTime=${storeDetail?.startTimeFilter}&endTime=${storeDetail?.endTimeFilter}`;
      let findBy = "?";
      findBy += `storeId=${storeDetail?._id}&`;
      if (storeDetail?.selectedMemberID) {
        findBy += `memberid=${storeDetail?.selectedMemberID}&`;
      }

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

      const url = END_POINT_EXPORT + "/export/member-order-customer" + findBy;
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
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");

        // setStoreDetail({
        //   ...storeDetail,
        //   startDayFilter: "",
        //   endDayFilter: "",
        //   startTimeFilter: "",
        //   endTimeFilter: "",
        //   selectedMemberID: "",
        // });
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
            style={{ height: 100, padding: 20 }}
            onClick={exportAllMember}
          >
            <span>{t("member_list")}</span>
          </Button>
          <Button style={{ height: 100, padding: 20 }} onClick={exportTopTen}>
            <span>{t("lists_top")}</span>
          </Button>
          <Button style={{ height: 100, padding: 20 }} onClick={exportOrders}>
            <span>{t("lists_export_order")}</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
