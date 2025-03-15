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
import * as ExcelJS from "exceljs";
import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";
import { useStore } from "../../store";
import Swal from "sweetalert2";
import { COLOR_APP } from "../../constants";

export default function PopUpReportExportExcel({
  open,
  onClose,
  setPopup,
  shiftId,
  shiftData,
}) {
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { menuCategories, getMenuCategories, setMenuCategories } =
    useMenuStore();

  useEffect(() => {
    const fetchData = async () => {
      if (storeDetail?._id) {
        const storeId = storeDetail?._id;
        if (!menuCategories.length) {
          const fetchedCategories = await getMenuCategories(storeId);
          setMenuCategories(fetchedCategories); // Save to zustand store
        }
      }
    };
    fetchData();
  }, [open]);

  const findCategoryName = (categoryId, menuCategories) => {
    const category = menuCategories.find((cat) => cat._id === categoryId);
    return category ? category.name : "";
  };

  const { profile } = useStore();
  const { t } = useTranslation();
  const [category, setCategory] = useState("");

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
        if (shiftData) {
          findBy += `&shiftId=${shiftData?._id}`;
        }
      } else {
        findBy += `startDate=${storeDetail?.startDateReportExport}&`;
        findBy += `endDate=${storeDetail?.endDateReportExport}&`;
        findBy += `startTime=${storeDetail?.startTimeReportExport}&`;
        findBy += `endTime=${storeDetail?.endTimeReportExport}`;
        if (shiftData) {
          findBy += `&shiftId=${shiftData?._id}`;
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
          findBy += `&shiftId=${shiftData?._id}`;
        }
      } else {
        findBy += `&startDate=${storeDetail?.startDateReportExport}&`;
        findBy += `endDate=${storeDetail?.endDateReportExport}&`;
        findBy += `startTime=${storeDetail?.startTimeReportExport}&`;
        findBy += `endTime=${storeDetail?.endTimeReportExport}&`;
        if (shiftData) {
          findBy += `&shiftId=${shiftData?._id}`;
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
        findBy += `timeTo=${storeDetail?.endTimeReportExport}`;
        if (shiftId) {
          findBy += `&shiftId=${shiftId}`;
        }
      } else {
        findBy += `&dateFrom=${storeDetail?.startDateReportExport}&`;
        findBy += `dateTo=${storeDetail?.endDateReportExport}&`;
        findBy += `timeFrom=${storeDetail?.startTimeReportExport}&`;
        findBy += `timeTo=${storeDetail?.endTimeReportExport}`;
        if (shiftData) {
          findBy += `&shiftId=${shiftData?._id}`;
        }
      }
      const url = `${END_POINT_EXPORT}/export/bill?storeId=${storeDetail?._id}${findBy}`;
      const _res = await axios.get(url);

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.bills;
        console.log("dataExcel", dataExcel);
        const header = [
          t("no"),
          t("payment_type"),
          t("bank_transfer_history"),
          t("status"),
          t("cash"),
          t("e_money"),
          t("delivery"),
          t("point"),
          t("discount"),
          t("discount_type"),
          t("change"),
          t("last_paid"),
          t("before_paid"),
          t("oreder_no"),
          t("order"),
          t("order_status"),
          t("type_name"),
          t("date"),
          t("staff"),
        ];

        const totals = {
          cash: 0,
          e_money: 0,
          delivery: 0,
          point: 0,
          discount: 0,
          change: 0,
          last_paid: 0,
          before_paid: 0,
          order_no: 0,
        };

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Expenses");

        // Set header row
        sheet.getRow(2).values = header;

        // Format header row
        for (let i = 1; i <= header.length; i++) {
          const cell = sheet.getRow(2).getCell(i);

          cell.border = {
            top: { style: "thin", color: { argb: "FFCC8400" } },
            left: { style: "thin", color: { argb: "FFCC8400" } },
            bottom: { style: "thin", color: { argb: "FFCC8400" } },
            right: { style: "thin", color: { argb: "FFCC8400" } },
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: COLOR_APP,
          };

          cell.font = {
            name: "Noto Sans Lao",
            size: 14,
            bold: true,
            color: { argb: "FF000000" }, // ປ່ຽນເປັນສີດຳ
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        // Set column widths
        sheet.columns = [
          { key: "no", width: 10 },
          { key: "payment_type", width: 18 },
          { key: "bank_transfer_history", width: 18 },
          { key: "status", width: 18 },
          { key: "cash", width: 18 },
          { key: "e_money", width: 18 },
          { key: "delivery", width: 18 },
          { key: "point", width: 18 },
          { key: "discount", width: 18 },
          { key: "discount_type", width: 18 },
          { key: "change", width: 18 },
          { key: "last_paid", width: 18 },
          { key: "before_paid", width: 18 },
          { key: "order_no", width: 18 },
          { key: "order", width: 18 },
          { key: "order_status", width: 18 },
          { key: "type_name", width: 18 },
          { key: "date", width: 18 },
          { key: "staff", width: 18 },
        ];

        // Add data rows
        for (const [index, item] of dataExcel.entries()) {
          const formattedDate = moment(item?.createdAt).format("DD/MM/YYYY");
          const orderDetails = item?.orderId
            .map((order) => {
              const categoryName = findCategoryName(
                order?.categoryId,
                menuCategories
              );
              return `(${categoryName})`;
            })
            .join(", ");

          const row = sheet.addRow({
            no: index + 1,
            payment_type: item?.paymentMethod,
            bank_transfer_history: item.selectedBank,
            status: item?.status,
            cash: item?.payAmount || 0,
            e_money: item?.transferAmount || 0,
            delivery: item?.deliveryAmount || 0,
            point: item?.point || 0,
            discount: item?.discount || 0,
            discount_type: item?.discountType,
            change: item?.change || 0,
            last_paid: item?.billAmount || 0,
            before_paid: item?.billAmountBefore || 0,
            order_no: item?.orderId.length,
            order: item?.orderId.map((order) => order?.name).join(", "),
            order_status: item?.orderId
              .map((order) => order?.status)
              .join(", "),
            type_name: orderDetails,
            date: formattedDate,
            staff: item?.fullnameStaffCheckOut,
          });

          // Format data rows
          row.eachCell((cell, colNumber) => {
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };

            cell.alignment = {
              horizontal: colNumber === 1 ? "center" : "left",
              vertical: "middle",
              wrapText: true,
            };
          });
        }

        dataExcel.forEach((item) => {
          totals.cash += item?.payAmount || 0;
          totals.e_money += item.transferAmount || 0;
          totals.delivery += item.deliveryAmount || 0;
          totals.point += item.point || 0;
          totals.discount += item.discount || 0;
          totals.change += item.change || 0;
          totals.last_paid += item.billAmount || 0;
          totals.before_paid += item.billAmountBefore || 0;

          totals.order_no += item?.orderId?.length || 0;
        });

        const totalRow = sheet.addRow({
          no: t("total"),
          payment_type: "",
          bank_transfer_history: "",
          status: "",
          cash: totals.cash,
          e_money: totals.e_money,
          delivery: totals.delivery,
          point: totals.point,
          discount: totals.discount,
          discount_type: "",
          change: totals.change,
          last_paid: totals.last_paid,
          before_paid: totals.before_paid,

          date: "",
          type_pay: "",
          order_no: totals.order_no,
        });

        totalRow.eachCell((cell, colNumber) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 14,
            bold: true,
            color: { argb: "FF000000" }, // ສີດຳ
          };

          cell.alignment = {
            horizontal: colNumber === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        });

        // Set width for total row
        sheet.columns.forEach((column) => {
          column.width = 18;
        });

        // Set row heights
        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Download the file
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - ExportExel.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        if (_res?.data?.exportUrl) {
          const response = await axios.get(_res?.data?.exportUrl, {
            responseType: "blob",
          });

          const fileBlob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(fileBlob, `${storeDetail?.name}.xlsx` || "export.xlsx");
        }
      }
    } catch (err) {
      console.error("Export failed:", err);
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
