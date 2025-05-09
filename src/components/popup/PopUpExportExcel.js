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

import { useStoreStore } from "../../zustand/storeStore";
import {
  exportMemberOrdersToExcel,
  exportMembersToExcel,
  exportTopMembersToExcel,
} from "../../pages/member/excel/exportExcel";

export default function PopUpExportExcel({
  open,
  onClose,
  setPopup,
  dataMemberListTop,
  dataMemberOrder,
  dataMember,
}) {
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { t } = useTranslation();

  const exportAllMember = async () => {
    console.log("exportAllMember", storeDetail?.startDateMember);
    setPopup({ printReportSale: true });
    try {
      // const findBy = `&startDate=${storeDetail?.startDateMember}&endDate=${storeDetail?.endDateMember}&&startTime=${storeDetail?.startTimeMember}&endTime=${storeDetail?.endTimeMember}`;
      let findBy = "";
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
        setStoreDetail({ limitData: "" });
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };
  const exportOrders = async () => {
    setPopup({ printReportStaffSale: true });
    try {
      // let findBy = `&storeId=${storeDetail?._id}&startDate=${storeDetail?.startDay}&endDate=${storeDetail?.endDay}&startTime=${storeDetail?.startTime}&endTime=${storeDetail?.endTime}`;
      let findBy = "?";
      findBy += `storeId=${storeDetail?._id}&`;
      if (storeDetail?.selectedMemberID) {
        findBy += `memberid=${storeDetail?.selectedMemberID}&`;
      }

      if (
        storeDetail?.startDay &&
        storeDetail?.endDay &&
        storeDetail?.startTime &&
        storeDetail?.endTime
      ) {
        findBy += `startDate=${storeDetail?.startDay}&`;
        findBy += `endDate=${storeDetail?.endDay}&`;
        findBy += `startTime=${storeDetail?.startTime}&`;
        findBy += `endTime=${storeDetail?.endTime}`;
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
            // onClick={exportAllMember}
            onClick={() =>
              exportMembersToExcel(dataMember, "members", storeDetail, t)
            }
          >
            <span>{t("member_list")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            // onClick={exportTopTen}
            onClick={() =>
              exportTopMembersToExcel(dataMemberListTop, t, "top_members")
            }
          >
            <span>{t("lists_top")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            // onClick={exportOrders}
            onClick={() => {
              exportMemberOrdersToExcel(dataMemberOrder, t, "member_orders");
            }}
          >
            <span>{t("lists_export_order")}</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
