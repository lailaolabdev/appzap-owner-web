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
import { moneyCurrency } from "../../helpers";
import { COLOR_APP } from "../../constants";

export default function PopUpReportExportExcel({
  open,
  onClose,
  setPopup,
  shiftId,
  shiftData,
  reportData,
  salesInfoData,
  userData,
  menuData,
  categoryData,
  moneyData,
  promotionData,
  promotionDiscountAndFreeReportData,
  currencyData,
  bankData,
  deliveryData,
  debtData,
  billData,
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
    if (!storeDetail?._id) {
      console.error("Store ID is missing");
      return "";
    }

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
      if (!storeDetail?._id) {
        errorAdd("ไม่พบข้อมูลร้าน");
        return;
      }
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
      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.promotion[0];

        const header = [
          t("no"),
          t("discount_bill"),
          t("all_discount"),
          t("total_amount_menu_discount"),
          t("total_money") + `(${t("menu_discount")})`,
          t("total_money") + t("menu_free"),
          t("total_money") + `(${t("menu_free")})`,
          t("date"),
        ];
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
        sheet.columns = [
          { key: "no", width: 10 },
          { key: "discount_bill", width: 18 },
          { key: "all_discount", width: 18 },
          { key: "total_amount_menu_discount", width: 18 },
          { key: "total_money_discount", width: 18 },
          { key: "total_amount_menu_free", width: 18 },
          { key: "total_money_free", width: 18 },
          { key: "date", width: 18 },
        ];
        const formattedDate = moment(dataExcel?.createdAt).format("DD/MM/YYYY");

        const row = sheet.addRow({
          no: dataExcel?.length + 1,
          discount_bill: dataExcel?.count || 0,
          all_discount: dataExcel.totalPromotionCount || 0,
          total_amount_menu_discount: dataExcel?.totalDiscountedItemCount || 0,
          total_money_discount: dataExcel?.totalDiscountValue || 0,
          total_amount_menu_free: dataExcel?.totalFreeItemCount || 0,
          total_money_free: dataExcel?.totalFreeMenuPrice || 0,
          date: formattedDate,
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

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.bank || [];

        const header = [t("no"), t("bank_Name"), t("amount")];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Bank Summary");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "no", width: 10 },
          { key: "bank_Name", width: 30 },
          { key: "amount", width: 25 },
        ];

        dataExcel.forEach((bank, index) => {
          const row = sheet.addRow({
            no: index + 1,
            bank_Name: bank?.bankDetails?.bankName || t("unknown"),
            amount: bank?.bankTotalAmount || 0,
          });

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
        });

        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - BankSummary.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
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

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.bill || {};

        const header = [
          t("no"),
          t("bill_type"), // ປະເພດບີນ
          t("bill_count"), // ຈຳນວນບີນ
          t("total_bill_amount") + `(${t("currency")})`, // ຍອດບີນລວມ
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Bills");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "no", width: 10 },
          { key: "bill_type", width: 30 },
          { key: "bill_amount", width: 15 },
          { key: "total_price", width: 25 },
        ];

        const deliveryRevenue =
          dataExcel?.delivery?.[0]?.revenueByPlatform?.find(
            (p) => p._id === "Panda"
          ) || {};

        const rows = [
          {
            no: 1,
            bill_type: t("total_bill"),
            bill_count: dataExcel?.successAmount?.numberOfBills || 0,
            total_bill_amount: dataExcel?.successAmount?.totalBalance || 0,
          },
          {
            no: 2,
            bill_type: t("total_cash"),
            bill_count: dataExcel?.successAmount?.cashCount || 0,
            total_bill_amount: dataExcel?.successAmount?.payByCash || 0,
          },
          {
            no: 3,
            bill_type: t("total_tsf"),
            bill_count: dataExcel?.successAmount?.transferCount || 0,
            total_bill_amount: dataExcel?.successAmount?.transferPayment || 0,
          },
          {
            no: 4,
            bill_type: t("money_from_appzap"),
            bill_count: 0,
            total_bill_amount: 0,
          },
          {
            no: 5,
            bill_type: t("total_debt"),
            bill_count: 0,
            total_bill_amount: 0,
          },
          {
            no: 6,
            bill_type: t("delivery_panda"),
            bill_count: deliveryRevenue?.totalOrders || 0,
            total_bill_amount: deliveryRevenue?.totalRevenue || 0,
          },
          {
            no: 7,
            bill_type: t("point"),
            bill_count: 0,
            total_bill_amount: 0,
          },
          {
            no: 8,
            bill_type: t("service_charge"),
            bill_count: 0,
            total_bill_amount: 0,
          },
          { no: 9, bill_type: t("tax"), bill_count: 0, total_bill_amount: 0 },
          {
            no: 10,
            bill_type: t("total_tax_service_charge"),
            bill_count: 0,
            total_bill_amount: 0,
          },
        ];

        rows.forEach((row) => {
          sheet.addRow(row).eachCell((cell, colNumber) => {
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
        });

        for (let i = 1; i <= rows.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - BillsExport.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
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
            `${storeDetail?.name} ${t("bill_detial")}` + ".xlsx" ||
              "export.xlsx"
          );
        }
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

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.user || [];

        const header = [
          t("no"),
          t("user"),
          t("order"),
          t("order_cancel"),
          t("order_paid"),
          t("total_amount"),
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Staff Sales");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "no", width: 10 },
          { key: "user", width: 30 },
          { key: "order", width: 15 },
          { key: "order_cancel", width: 15 },
          { key: "order_paid", width: 15 },
          { key: "total_amount", width: 25 },
        ];

        dataExcel.forEach((staff, index) => {
          const row = sheet.addRow({
            no: index + 1,
            username: staff?.userId?.userId || t("unknown"),
            order: (staff?.served || 0) + (staff?.canceled || 0),
            cancel_order: staff?.canceled || 0,
            order_paid: 0, // Order paid not provided in API
            total_amount: staff?.totalSaleAmount || 0,
          });

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
        });

        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - StaffSales.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
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
      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.daily || [];

        const header = [
          t("date"),
          t("order"),
          t("numberOfBill"),
          t("delivery"),
          t("point"),
          t("discount"),
          t("debt"),
          t("total_amount"),
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Daily Sales");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "date", width: 15 },
          { key: "order", width: 10 },
          { key: "numberOfBill", width: 15 },
          { key: "delivery", width: 15 },
          { key: "point", width: 15 },
          { key: "discount", width: 15 },
          { key: "debt", width: 15 },
          { key: "total_amount", width: 20 },
        ];

        dataExcel.forEach((day, index) => {
          const row = sheet.addRow({
            date: day?.date || "-",
            order: day?.order || 0,
            numberOfBill: day?.bill || 0,
            delivery: 0,
            point: day?.billBefore || 0,
            discount: day?.discount || 0,
            debt: day?.remainingAmount || 0,
            total_amount: day?.billAmount || 0,
          });

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
        });

        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - DailySales.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
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

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.category || [];

        const header = [
          t("category"),
          t("order_success"),
          t("cancel"),
          t("order_paid"),
          t("sale_price_amount"),
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Category Sales");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "category", width: 30 },
          { key: "order_success", width: 15 },
          { key: "cancel", width: 15 },
          { key: "order_paid", width: 15 },
          { key: "sale_price_amount", width: 20 },
        ];

        dataExcel.forEach((category) => {
          const row = sheet.addRow({
            category: category?.name || t("unknown"),
            order_success: category?.served || 0,
            cancel: category?.cenceled || 0,
            order_paid: category?.paid || 0, // No paid data available in API
            sale_price_amount: category?.totalSaleAmount || 0,
          });

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
        });

        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - CategorySales.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      }

      if (_res?.data?.exportUrl) {
        const response = await axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

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

      if (storeDetail?.isStatusCafe) {
        const dataExcel = _res?.data?.menu || [];

        const header = [
          t("menu"),
          t("order_success"),
          t("cancel"),
          t("order_paid"),
          t("sale_price_amount"),
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Menu Sales");

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
            color: { argb: "FF000000" },
          };

          cell.alignment = {
            horizontal: i === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        }

        sheet.columns = [
          { key: "menu", width: 40 },
          { key: "order_success", width: 15 },
          { key: "cancel", width: 15 },
          { key: "order_paid", width: 15 },
          { key: "sale_price_amount", width: 20 },
        ];

        dataExcel.forEach((menu) => {
          const row = sheet.addRow({
            menu: menu?.name || t("unknown"),
            order_success: menu?.served || 0,
            cancel: menu?.cenceled || 0,
            order_paid: menu?.paid || 0, // No paid data available in API
            sale_price_amount: menu?.totalSaleAmount || 0,
          });

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
        });

        for (let i = 1; i <= dataExcel.length + 2; i++) {
          sheet.getRow(i).height = 45;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${storeDetail?.name} - MenuSales.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
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
      }
    } catch (err) {
      errorAdd(`${t("export_fail")}`);
    }
  };

  const ex = async () => {
    setPopup({ ReportExport: false });
    try {
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();

      // Add worksheets for each report type
      const reportSellSheet = workbook.addWorksheet(t("report_sell"));
      const salesInfoSheet = workbook.addWorksheet(t("sales_info"));
      const userSheet = workbook.addWorksheet(t("staf_info"));
      const menuSheet = workbook.addWorksheet(t("menu_info"));
      const categorySheet = workbook.addWorksheet(t("menu_type"));
      const billDetailSheet = workbook.addWorksheet(t("bill_detial"));
      const saleInfoEveryDaySheet = workbook.addWorksheet(
        `${t("sales_info")} ${t("every_day")}`
      );
      const promotionSheet = workbook.addWorksheet(t("promotion"));
      const currencySheet = workbook.addWorksheet(t("all_curency"));
      const bankSheet = workbook.addWorksheet(t("bank_total"));
      const deliverySheet = workbook.addWorksheet("Delivery Report");

      // Helper function to create headers with styling
      // const createHeaders = (sheet, headers) => {
      //   // Add a title row before headers
      //   const titleRow = sheet.addRow([sheet.name]);
      //   titleRow.font = { bold: true, size: 16 };
      //   titleRow.height = 30;

      //   // Add empty row for spacing
      //   sheet.addRow([]);

      //   const headerRow = sheet.addRow(headers);
      //   headerRow.eachCell((cell) => {
      //     cell.fill = {
      //       type: "pattern",
      //       pattern: "solid",
      //       fgColor: { argb: "FFCC8400" }, // Orange color
      //     };
      //     cell.font = {
      //       bold: true,
      //       color: { argb: "FFFFFF" }, // White text
      //     };
      //     cell.alignment = {
      //       horizontal: "center",
      //       vertical: "middle",
      //     };
      //     cell.border = {
      //       top: { style: "thin" },
      //       left: { style: "thin" },
      //       bottom: { style: "thin" },
      //       right: { style: "thin" },
      //     };
      //   });

      //   // Return the row index where data should start
      //   return headerRow.number + 1;
      // };

      // Helper function to create headers with styling
      const createHeaders = (sheet, headers) => {
        // Add a title row before headers
        const titleRow = sheet.addRow([sheet.name]);
        titleRow.font = { bold: true, size: 16, name: "Noto Sans Lao" };
        titleRow.height = 30;

        // Add empty row for spacing
        sheet.addRow([]);

        const headerRow = sheet.addRow(headers);
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFCC8400" }, // Orange color
          };
          cell.font = {
            bold: true,
            color: { argb: "FFFFFF" }, // White text
            name: "Noto Sans Lao",
            size: 14,
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Return the row index where data should start
        return headerRow.number + 1;
      };
      // reportSell
      const reportSellHeaders = [
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
        t("before_paid"),
        t("last_paid"),
        t("order_amount"),
        t("order"),
        t("order_status"),
        t("type_name"),
        t("date"),
        t("staff"),
      ];
      const reportSellStartRow = createHeaders(
        reportSellSheet,
        reportSellHeaders
      );

      // if (billData) {
      //   billData.forEach((item, index) => {
      //     const formattedDate = moment(item?.createdAt).format("DD/MM/YYYY");
      //     const orderDetails = item?.orderId
      //       .map((order) => {
      //         const categoryName = findCategoryName(
      //           order?.categoryId,
      //           menuCategories
      //         );
      //         return `(${categoryName})`;
      //       })
      //       .join(", ");
      //     const row = reportSellSheet.addRow([
      //       index + 1,
      //       item?.paymentMethod || "",
      //       item?.selectedBank || "",
      //       item?.status || "",
      //       moneyCurrency(item?.payAmount || 0),
      //       moneyCurrency(item?.transferAmount || 0),
      //       moneyCurrency(item?.deliveryAmount || 0),
      //       moneyCurrency(item?.point || 0),
      //       moneyCurrency(item?.discount || 0),
      //       item?.discountType || "",
      //       moneyCurrency(item?.change || 0),
      //       moneyCurrency(item?.beforePaid || 0),
      //       moneyCurrency(item?.billAmount || 0),
      //       item?.orderId.length || "",
      //       item?.orderId.map((order) => order?.name).join(", "),
      //       item?.orderId.map((order) => order?.status).join(", "),
      //       orderDetails,
      //       formattedDate,
      //       item?.fullnameStaffCheckOut || "",
      //     ]);

      //     // Style the data row
      //     row.eachCell((cell) => {
      //       cell.border = {
      //         top: { style: "thin" },
      //         left: { style: "thin" },
      //         bottom: { style: "thin" },
      //         right: { style: "thin" },
      //       };
      //       cell.font = {
      //         name: "Noto Sans Lao",
      //         size: 14,
      //       };
      //     });
      //   });
      // } else {
      //   // Add empty row with message if no data
      //   const noDataRow = reportSellSheet.addRow([t("no_data")]);
      //   noDataRow.eachCell((cell) => {
      //     cell.font = {
      //       name: "Noto Sans Lao",
      //       size: 12,
      //     };
      //   });
      // }

      // Sales Information Sheet

      if (billData) {
        let totalCash = 0;
        let totalTransfer = 0;
        let totalDelivery = 0;
        let totalPoint = 0;
        let totalDiscount = 0;
        let totalChange = 0;
        let totalBeforePaid = 0;
        let totalBillAmount = 0;
        let totalOrderCount = 0;

        billData.forEach((item, index) => {
          // Calculate totals
          totalCash += item?.payAmount || 0;
          totalTransfer += item?.transferAmount || 0;
          totalDelivery += item?.deliveryAmount || 0;
          totalPoint += item?.point || 0;
          totalDiscount += item?.discount || 0;
          totalChange += item?.change || 0;
          totalBeforePaid += item?.beforePaid || 0;
          totalBillAmount += item?.billAmount || 0;
          totalOrderCount += item?.orderId.length || 0;

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
          const row = reportSellSheet.addRow([
            index + 1,
            item?.paymentMethod || "",
            item?.selectedBank || "",
            item?.status || "",
            moneyCurrency(item?.payAmount || 0),
            moneyCurrency(item?.transferAmount || 0),
            moneyCurrency(item?.deliveryAmount || 0),
            moneyCurrency(item?.point || 0),
            moneyCurrency(item?.discount || 0),
            item?.discountType || "",
            moneyCurrency(item?.change || 0),
            moneyCurrency(item?.beforePaid || 0),
            moneyCurrency(item?.billAmount || 0),
            item?.orderId.length || "",
            // Format order names with line breaks
            item?.orderId
              .map((order, idx) => `${idx + 1}. ${order?.name || ""}`)
              .join("\n"),
            // Format order statuses with line breaks
            item?.orderId
              .map((order, idx) => `${idx + 1}. ${order?.status || ""}`)
              .join("\n"),
            // Format order categories with line breaks
            item?.orderId
              .map((order, idx) => {
                const categoryName = findCategoryName(
                  order?.categoryId,
                  menuCategories
                );
                return `${idx + 1}. ${categoryName || ""}`;
              })
              .join("\n"),
            formattedDate,
            item?.fullnameStaffCheckOut || "",
          ]);

          // Style the data row
          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };

            // Enable text wrapping for order details columns
            if (colNumber === 15 || colNumber === 16 || colNumber === 17) {
              cell.alignment = {
                vertical: "top",
                wrapText: true,
              };
              // Increase row height to accommodate multiple lines
              row.height = Math.max(
                row.height || 30,
                20 * (item?.orderId.length || 1)
              );
            }
          });
        });

        // Add empty row for spacing
        reportSellSheet.addRow([]);

        // Add total row
        const totalRow = reportSellSheet.addRow([
          "",
          t("total"),
          "",
          "",
          moneyCurrency(totalCash),
          moneyCurrency(totalTransfer),
          moneyCurrency(totalDelivery),
          moneyCurrency(totalPoint),
          moneyCurrency(totalDiscount),
          "",
          moneyCurrency(totalChange),
          moneyCurrency(totalBeforePaid),
          moneyCurrency(totalBillAmount),
          totalOrderCount,
          "",
          "",
          "",
          "",
          "",
        ]);

        // Style the total row
        totalRow.eachCell((cell, colNumber) => {
          if (colNumber === 2) {
            // Style the "Total" text
            cell.font = {
              bold: true,
              name: "Noto Sans Lao",
              size: 14,
            };
          } else if (
            colNumber === 5 ||
            colNumber === 6 ||
            colNumber === 7 ||
            colNumber === 8 ||
            colNumber === 9 ||
            colNumber === 11 ||
            colNumber === 12 ||
            colNumber === 13 ||
            colNumber === 14
          ) {
            // Style the total amount cells
            cell.font = {
              bold: true,
              name: "Noto Sans Lao",
              size: 14,
            };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFEEEEEE" }, // Light gray background
            };
          }

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = reportSellSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      const salesInfoHeaders = [
        t("total_sale"),
        t("business_amount"),
        t("per_bsn"),
      ];
      const salesInfoStartRow = createHeaders(salesInfoSheet, salesInfoHeaders);

      if (salesInfoData) {
        const row = salesInfoSheet.addRow([
          moneyCurrency(salesInfoData?.totalSales || 0),
          salesInfoData?.noOfSalesTransactions || 0,
          moneyCurrency(salesInfoData?.averageSales_Transaction || 0),
        ]);

        // Style the data row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.font = {
            name: "Noto Sans Lao",
            size: 14,
          };
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = salesInfoSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Staff Report Sheet
      const userHeaders = [
        t("no"),
        t("user"),
        t("order"),
        t("order_cancel"),
        t("order_paid"),
        t("total_amount"),
      ];
      const userStartRow = createHeaders(userSheet, userHeaders);

      if (userData && userData?.length > 0) {
        userData.forEach((user, index) => {
          const row = userSheet.addRow([
            index + 1,
            user?.userId?.userId || t("unknown"),
            (user?.served || 0) + (user?.canceled || 0),
            user?.canceled || 0,
            user?.paid || 0,
            user?.totalSaleExchangeAmount > 0
              ? moneyCurrency(
                  user?.totalSaleAmount - user?.totalSaleExchangeAmount
                )
              : moneyCurrency(user?.totalSaleAmount || 0),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = userSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }
      // Staff Report Sheet
      const saleInfoHeaders = [
        t("no"),
        t("date"),
        t("order"),
        t("bill_amount"),
        t("Delivery"),
        t("point"),
        t("discount"),
        t("debt"),
        t("total"),
      ];
      const saleInfoStartRow = createHeaders(
        saleInfoEveryDaySheet,
        saleInfoHeaders
      );

      if (reportData && reportData?.length > 0) {
        reportData.forEach((data, index) => {
          const row = saleInfoEveryDaySheet.addRow([
            index + 1,
            data?.date || t("unknown"),
            data?.order || 0,
            data?.bill || 0,
            moneyCurrency(data?.deliveryAmount || 0),
            moneyCurrency(data?.point || 0),
            moneyCurrency(data?.discount || 0),
            moneyCurrency(debtData?.totalRemainingAmount || 0),
            moneyCurrency(data?.billAmount || 0),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = saleInfoEveryDaySheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Menu Report Sheet
      const menuHeaders = [
        t("menu"),
        t("order_success"),
        t("cancel"),
        t("order_paid"),
        t("sale_price_amount"),
      ];
      const menuStartRow = createHeaders(menuSheet, menuHeaders);

      if (menuData && menuData.length > 0) {
        // Sort menu data by served count in descending order
        const sortedMenuData = [...menuData].sort(
          (a, b) => (b.served || 0) - (a.served || 0)
        );

        sortedMenuData.forEach((menu) => {
          const row = menuSheet.addRow([
            menu?.name || t("unknown"),
            menu?.served || 0,
            menu?.canceled || 0,
            menu?.paid || 0,
            menu?.totalPointAmount > 0
              ? moneyCurrency(menu?.totalSaleAmount - menu?.totalPointAmount)
              : moneyCurrency(menu?.totalSaleAmount || 0),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = menuSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Category Report Sheet
      const categoryHeaders = [
        t("category"),
        t("order_success"),
        t("cancel"),
        t("order_paid"),
        t("sale_price_amount"),
      ];
      const categoryStartRow = createHeaders(categorySheet, categoryHeaders);

      if (categoryData && categoryData?.length > 0) {
        categoryData.forEach((category) => {
          const row = categorySheet.addRow([
            category?.name || t("unknown"),
            category?.served || 0,
            category?.canceled || 0,
            category?.paid || 0,
            category?.totalPointAmount > 0
              ? moneyCurrency(
                  category?.totalSaleAmount - category?.totalPointAmount
                )
              : moneyCurrency(category?.totalSaleAmount || 0),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 14,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = categorySheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Money Report Sheet
      if (moneyData) {
        // Bill Detail Report Sheet
        const billDetailHeaders = [
          t("bill_type"),
          t("bill_amount"),
          t("total_price"),
          t("ccrc"),
        ];

        const billDetailStartRow = createHeaders(
          billDetailSheet,
          billDetailHeaders
        );

        // Add bill detail data
        const billDetailRows = [
          // Total row
          {
            method: t("total"),
            qty: moneyData?.successAmount?.numberOfBills || 0,
            amount:
              (moneyData?.successAmount?.payByCash || 0) +
              (moneyData?.successAmount?.transferPayment || 0),
            currency: storeDetail?.firstCurrency,
          },
          // Cash row
          {
            method: t("total_cash"),
            qty: moneyData?.successAmount?.cashCount || 0,
            amount: moneyData?.successAmount?.payByCash || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Transfer row
          {
            method: t("total_tsf"),
            qty: moneyData?.successAmount?.transferCount || 0,
            amount: moneyData?.successAmount?.transferPayment || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Money from AppZap
          {
            method: t("money_from_appzap"),
            qty: moneyData?.successAmount?.moneyFromOrderingCount || 0,
            amount: moneyData?.successAmount?.moneyFromOrdering || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Debt row
          {
            method: t("total_debt"),
            qty: debtData?.count || 0,
            amount: debtData?.totalRemainingAmount || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Point row
          {
            method: t("point"),
            qty: moneyData?.successAmount?.transferCashPointCount || 0,
            amount: moneyData?.successAmount?.point || 0,
            currency: t("point"),
          },
          // Service charge row
          {
            method: t("service_charge"),
            qty: moneyData?.serviceChargeCount || 0,
            amount: Math.floor(moneyData?.serviceAmount) || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Tax row
          {
            method: t("tax"),
            qty: moneyData?.taxCount || 0,
            amount: Math.floor(moneyData?.taxAmount) || 0,
            currency: storeDetail?.firstCurrency,
          },
          // Total tax and service charge
          {
            method: t("total_tax_service_charge"),
            qty:
              (moneyData?.serviceChargeCount || 0) + (moneyData?.taxCount || 0),
            amount:
              (Math.floor(moneyData?.serviceAmount) || 0) +
              (Math.floor(moneyData?.taxAmount) || 0),
            currency: storeDetail?.firstCurrency,
          },
        ];

        // Add delivery rows if available
        if (
          deliveryData &&
          Array.isArray(deliveryData) &&
          deliveryData.length > 0
        ) {
          deliveryData.forEach((platform) => {
            if (platform) {
              billDetailRows.push({
                method: `delivery (${platform?.name || "Unknown"})`,
                qty: platform?.qty || 0,
                amount: Math.floor(platform?.amount || 0),
                currency: storeDetail?.firstCurrency,
              });
            }
          });
        }

        // Add all rows to the sheet
        billDetailRows.forEach((row) => {
          const excelRow = billDetailSheet.addRow([
            row.method,
            row.qty,
            moneyCurrency(row.amount),
            row.currency,
          ]);

          // Style the row
          excelRow.eachCell((cell, colNumber) => {
            // Make method column bold
            if (colNumber === 1) {
              cell.font = {
                bold: true,
                name: "Noto Sans Lao",
                size: 12,
              };
            } else {
              cell.font = {
                name: "Noto Sans Lao",
                size: 12,
              };
            }

            // Right-align amount and qty columns
            if (colNumber === 2 || colNumber === 3) {
              cell.alignment = { horizontal: "right" };
            }

            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = billDetailSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Currency Report Sheet
      const currencyHeaders = [t("no"), t("code"), t("ccrc"), t("amount")];
      const currencyStartRow = createHeaders(currencySheet, currencyHeaders);

      if (currencyData?.data && currencyData.data.length > 0) {
        currencyData.data.forEach((currency, index) => {
          const row = currencySheet.addRow([
            index + 1,
            currency?.currency?.currencyCode || "",
            currency?.currency?.currencyName || "",
            moneyCurrency(Math.floor(currency?.currencyTotal || 0)),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 12,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = currencySheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Bank Report Sheet
      const bankHeaders = [t("no"), t("bank_Name"), t("amount")];
      const bankStartRow = createHeaders(bankSheet, bankHeaders);

      if (bankData?.data && bankData.data.length > 0) {
        bankData.data.forEach((bank, index) => {
          const row = bankSheet.addRow([
            index + 1,
            bank?.bankDetails?.bankName || "",
            moneyCurrency(bank?.bankTotalAmount || 0),
          ]);

          // Style the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 12,
            };
          });
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = bankSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Promotion
      const promotionHeaders = [
        t("no"),
        t("discount_bill"),
        t("all_discount"),
        t("total_amount_menu_discount"),
        t("total_money") + `(${t("menu_discount")})`,
        t("total_amount_menu_discount"),
        t("total_money") + `(${t("menu_free")})`,
        t("date"),
      ];

      const promotionStartRow = createHeaders(promotionSheet, promotionHeaders);

      // Add promotion data if available
      if (promotionData) {
        const promotionRowData = [
          1, // no
          promotionData?.[0]?.count || 0,
          moneyCurrency(promotionData?.[0]?.totalSaleAmount || 0),
          promotionDiscountAndFreeReportData?.totalDiscountedItemCount || 0,
          moneyCurrency(
            promotionDiscountAndFreeReportData?.totalDiscountValue || 0
          ),
          promotionDiscountAndFreeReportData?.totalFreeItemCount || 0,
          moneyCurrency(
            promotionDiscountAndFreeReportData?.totalFreeMenuPrice || 0
          ),
          promotionData?.[0]?.createdAt
            ? moment(promotionData.createdAt).format("DD/MM/YYYY")
            : "-",
        ];

        const row = promotionSheet.addRow(promotionRowData);

        // Style the data row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });

        // Add spacing
        promotionSheet.addRow([]);
        promotionSheet.addRow([]);

        // Add discounted menu details section
        if (
          promotionDiscountAndFreeReportData?.discountedMenus &&
          promotionDiscountAndFreeReportData.discountedMenus.length > 0
        ) {
          // Add section title
          const discountTitle = promotionSheet.addRow([t("discount_items")]);
          discountTitle.font = { bold: true, size: 14, name: "Noto Sans Lao" };

          // Add headers for discounted menus
          const discountMenuHeaders = [
            t("no"),
            t("menu"),
            t("price_basic"),
            t("discount_price"),
            t("discount_amounts"),
          ];

          const discountHeaderRow = promotionSheet.addRow(discountMenuHeaders);
          discountHeaderRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFCC8400" }, // Orange color
            };
            cell.font = {
              bold: true,
              color: { argb: "FFFFFF" }, // White text
              name: "Noto Sans Lao",
              size: 12,
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });

          // Add discounted menu data
          promotionDiscountAndFreeReportData.discountedMenus.forEach(
            (menu, index) => {
              const normalPrice = menu.price || 0;
              const discountPrice = menu.priceDiscount || 0;
              const amountDiscount = normalPrice - discountPrice;

              const menuRow = promotionSheet.addRow([
                index + 1,
                menu.name || t("unknown"),
                moneyCurrency(normalPrice),
                moneyCurrency(discountPrice),
                moneyCurrency(amountDiscount),
              ]);

              menuRow.eachCell((cell) => {
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
                cell.font = {
                  name: "Noto Sans Lao",
                  size: 12,
                };
              });
            }
          );
        }

        // Add spacing
        promotionSheet.addRow([]);
        promotionSheet.addRow([]);

        // Add free menu details section
        if (
          promotionDiscountAndFreeReportData?.freeMenus &&
          promotionDiscountAndFreeReportData.freeMenus.length > 0
        ) {
          // Add section title
          const freeTitle = promotionSheet.addRow([t("free_items")]);
          freeTitle.font = { bold: true, size: 14, name: "Noto Sans Lao" };

          // Add headers for free menus
          const freeMenuHeaders = [t("no"), t("menu"), t("price")];

          const freeHeaderRow = promotionSheet.addRow(freeMenuHeaders);
          freeHeaderRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFCC8400" }, // Orange color
            };
            cell.font = {
              bold: true,
              color: { argb: "FFFFFF" }, // White text
              name: "Noto Sans Lao",
              size: 12,
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });

          // Add free menu data
          promotionDiscountAndFreeReportData.freeMenus.forEach(
            (menu, index) => {
              const menuRow = promotionSheet.addRow([
                index + 1,
                menu.name || t("unknown"),
                moneyCurrency(menu.price || 0),
              ]);

              menuRow.eachCell((cell) => {
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
                cell.font = {
                  name: "Noto Sans Lao",
                  size: 12,
                };
              });
            }
          );
        }
      } else {
        // Add empty row with message if no data
        const noDataRow = promotionSheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Delivery Report Sheet
      const deliveryHeaders = [t("name"), t("qty"), t("amount")];
      const deliveryStartRow = createHeaders(deliverySheet, deliveryHeaders);

      if (
        deliveryData &&
        Array.isArray(deliveryData) &&
        deliveryData.length > 0
      ) {
        deliveryData?.forEach((platform) => {
          if (platform) {
            const row = deliverySheet.addRow([
              platform?.name || "",
              platform?.qty || 0,
              platform?.amount || 0,
            ]);

            // Style the data row
            row.eachCell((cell) => {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
              cell.font = {
                name: "Noto Sans Lao",
                size: 12,
              };
            });
          }
        });
      } else {
        // Add empty row with message if no data
        const noDataRow = deliverySheet.addRow([t("no_data")]);
        noDataRow.eachCell((cell) => {
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      }

      // Auto-size columns for better readability
      workbook.eachSheet((sheet) => {
        if (sheet && sheet.columns) {
          sheet.columns.forEach((column) => {
            if (column) {
              let maxLength = 0;
              column.eachCell({ includeEmpty: true }, (cell) => {
                if (cell && cell.value !== undefined) {
                  const columnLength = cell.value
                    ? cell.value.toString().length
                    : 10;
                  if (columnLength > maxLength) {
                    maxLength = columnLength;
                  }
                }
              });
              column.width = maxLength < 10 ? 10 : maxLength + 2;
            }
          });
        }
      });

      // Generate and download the Excel file
      try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use file-saver to save the file
        saveAs(
          blob,
          `${storeDetail?.name || "Store"}_Complete_Report_${moment().format(
            "YYYY-MM-DD"
          )}.xlsx`
        );

        console.log("Export completed successfully");
      } catch (error) {
        console.error("Error generating Excel file:", error);
        errorAdd(`${t("error_generating_excel")}: ${error.message}`);
      }
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      errorAdd(`${t("export_fail")}: ${err.message}`);
    }
  };

  const allExport = async () => {
    setPopup({ ReportExport: false });
    try {
      if (!storeDetail?._id) {
        errorAdd("ไม่พบข้อมูลร้าน");
        return;
      }

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

      const billUrl = `${END_POINT_EXPORT}/export/bill?storeId=${storeDetail?._id}${findBy}`;
      const billRes = await axios.get(billUrl);

      const promotionUrl = `${END_POINT_EXPORT}/export/report-promotion/${
        storeDetail?._id
      }${findByData()}`;
      const promotionRes = await axios.get(promotionUrl);

      const billDetailUrl = `${END_POINT_EXPORT}/export/report-bill/${
        storeDetail?._id
      }${findByData()}`;
      const billDetailRes = await axios.post(billDetailUrl);

      const bankUrl = `${END_POINT_EXPORT}/export/report-bank${findByData()}&storeId=${
        storeDetail?._id
      }`;
      const bankRes = await axios.get(bankUrl);

      const staffInfoUrl = `${END_POINT_EXPORT}/export/report-user/${
        storeDetail?._id
      }${findByData()}`;
      const staffInfoRes = await axios.get(staffInfoUrl);

      const dailySalesUrl = `${END_POINT_EXPORT}/export/report-daily/${
        storeDetail?._id
      }${findByData()}`;
      const dailySalesRes = await axios.get(dailySalesUrl);

      const menuTypeUrl = `${END_POINT_EXPORT}/export/report-category/${
        storeDetail?._id
      }${findByData()}`;
      const menuTypeRes = await axios.get(menuTypeUrl);

      const menuInfoUrl = `${END_POINT_EXPORT}/export/report-menu-detail/${
        storeDetail?._id
      }${findByData()}`;
      const menuInfoRes = await axios.get(menuInfoUrl);

      const currencyUrl = `${END_POINT_EXPORT}/export/report-currency${findByData()}&storeId=${
        storeDetail?._id
      }`;
      const currencyRes = await axios.get(currencyUrl);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("รายงานรวม");

      // Exclel
      const billHeaders = [
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

      // Promotion
      const promotionHeaders = [
        t("no"),
        t("discount_bill"),
        t("all_discount"),
        t("total_amount_menu_discount"),
        t("total_money") + `(${t("menu_discount")})`,
        t("total_money") + t("menu_free"),
        t("total_money") + `(${t("menu_free")})`,
        t("date"),
      ];
      //Billdetail
      const billDetailHeaders = [
        t("no"),
        t("bill_type"),
        t("bill_count"),
        t("total_bill_amount") + `(${t("currency")})`,
      ];

      // bank
      const bankHeaders = [t("no"), t("bank_Name"), t("amount")];

      // (StaffInfo)
      const staffInfoHeaders = [
        t("no"),
        t("user"),
        t("order"),
        t("order_cancel"),
        t("order_paid"),
        t("total_amount"),
      ];

      //  (DialySales)
      const dailySalesHeaders = [
        t("date"),
        t("order"),
        t("numberOfBill"),
        t("delivery"),
        t("point"),
        t("discount"),
        t("debt"),
        t("total_amount"),
      ];

      // menutype
      const menuTypeHeaders = [
        t("category"),
        t("order_success"),
        t("cancel"),
        t("order_paid"),
        t("sale_price_amount"),
      ];

      // menudetail
      const menuInfoHeaders = [
        t("menu"),
        t("order_success"),
        t("cancel"),
        t("order_paid"),
        t("sale_price_amount"),
      ];

      // currency
      const currencyHeaders = [t("no"), t("currency_type"), t("amount")];

      sheet.getRow(1).values = ["Excel:"];
      sheet.getRow(2).values = billHeaders;

      // จัดรูปแบบหัวกระดาษบิล
      billHeaders.forEach((header, index) => {
        const cell = sheet.getRow(2).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
          bgColor: COLOR_APP,
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เตรียมข้อมูลบิล
      const billData = billRes?.data?.bills || [];
      const promotionData = promotionRes?.data?.promotion[0];
      const billDetailData = billDetailRes?.data?.bill || {};
      const staffInfoData = staffInfoRes?.data?.user || [];
      const dailySalesData = dailySalesRes?.data?.daily || [];
      const menuTypeData = menuTypeRes?.data?.category || [];
      const menuInfoData = menuInfoRes?.data?.menu || [];

      // คำนวณผลรวม
      const totalSummary = {
        payAmount: 0,
        transferAmount: 0,
        deliveryAmount: 0,
        point: 0,
        discount: 0,
        change: 0,
        billAmount: 0,
        billAmountBefore: 0,
        orderCount: 0,
      };

      // เพิ่มข้อมูลบิล
      billData.forEach((billItem, index) => {
        const formattedDate = moment(billItem?.createdAt).format("DD/MM/YYYY");
        const orderDetails = billItem?.orderId
          .map((order) => {
            const categoryName = findCategoryName(
              order?.categoryId,
              menuCategories
            );
            return `(${categoryName})`;
          })
          .join(", ");

        // อัพเดทผลรวม
        totalSummary.payAmount += billItem?.payAmount || 0;
        totalSummary.transferAmount += billItem?.transferAmount || 0;
        totalSummary.deliveryAmount += billItem?.deliveryAmount || 0;
        totalSummary.point += billItem?.point || 0;
        totalSummary.discount += billItem?.discount || 0;
        totalSummary.change += billItem?.change || 0;
        totalSummary.billAmount += billItem?.billAmount || 0;
        totalSummary.billAmountBefore += billItem?.billAmountBefore || 0;
        totalSummary.orderCount += billItem?.orderId.length || 0;

        const billRowData = [
          index + 1,
          billItem?.paymentMethod,
          billItem.selectedBank,
          billItem?.status,
          billItem?.payAmount || 0,
          billItem?.transferAmount || 0,
          billItem?.deliveryAmount || 0,
          billItem?.point || 0,
          billItem?.discount || 0,
          billItem?.discountType,
          billItem?.change || 0,
          billItem?.billAmount || 0,
          billItem?.billAmountBefore || 0,
          billItem?.orderId.length,
          billItem?.orderId.map((order) => order?.name).join(", "),
          billItem?.orderId.map((order) => order?.status).join(", "),
          orderDetails,
          formattedDate,
          billItem?.fullnameStaffCheckOut,
        ];

        const row = sheet.addRow(billRowData);
        // เพิ่มเส้นขอบที่เข้มขึ้นสำหรับแต่ละเซลล์
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };
        });
      });

      // กรณีไม่มีข้อมูลบิล
      if (billData.length === 0) {
        const emptyBillRowData = new Array(billHeaders.length).fill("");
        emptyBillRowData[0] = "ບິນ";
        sheet.addRow(emptyBillRowData);
      }

      // เพิ่มแถวสรุปผลรวม
      const summaryRowData = [
        t("total"),
        "-",
        "-",
        "-",
        totalSummary.payAmount,
        totalSummary.transferAmount,
        totalSummary.deliveryAmount,
        totalSummary.point,
        totalSummary.discount,
        "-",
        totalSummary.change,
        totalSummary.billAmount,
        totalSummary.billAmountBefore,
        totalSummary.orderCount,
        "-",
        "-",
        "-",
        "-",
        "-",
      ];

      // จัดรูปแบบแถวสรุป
      const summaryRow = sheet.addRow(summaryRowData);
      summaryRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: COLOR_APP,
        };
      });

      sheet.addRow([]);
      sheet.addRow([]);

      sheet.getRow(sheet.rowCount + 1).values = ["Promotion:"];
      sheet.getRow(sheet.rowCount + 1).values = promotionHeaders;

      promotionHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" },
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลโปรโมชัน
      const promotionRowData = [
        1, // no
        promotionData?.count || 0,
        promotionData.totalPromotionCount || 0,
        promotionData?.totalDiscountedItemCount || 0,
        promotionData?.totalDiscountValue || 0,
        promotionData?.totalFreeItemCount || 0,
        promotionData?.totalFreeMenuPrice || 0,
        moment(promotionData?.createdAt).format("DD/MM/YYYY"),
      ];

      const promotionRow = sheet.addRow(promotionRowData);
      promotionRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      sheet.addRow([]);
      sheet.addRow([]);

      // (Billdetail)
      sheet.getRow(sheet.rowCount + 1).values = ["ລາຍລະອຽດບິນ:"];
      sheet.getRow(sheet.rowCount + 1).values = billDetailHeaders;

      // จัดรูปแบบหัวกระดาษรายละเอียดบิล
      billDetailHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เตรียมข้อมูลสำหรับรายละเอียดบิล
      const deliveryRevenue =
        billDetailData?.delivery?.[0]?.revenueByPlatform?.find(
          (p) => p._id === "Panda"
        ) || {};

      // ข้อมูลรายละเอียดบิล
      const billDetailRows = [
        {
          no: 1,
          bill_type: t("total_bill"),
          bill_count: billDetailData?.successAmount?.numberOfBills || 0,
          total_bill_amount: billDetailData?.successAmount?.totalBalance || 0,
        },
        {
          no: 2,
          bill_type: t("total_cash"),
          bill_count: billDetailData?.successAmount?.cashCount || 0,
          total_bill_amount: billDetailData?.successAmount?.payByCash || 0,
        },
        {
          no: 3,
          bill_type: t("total_tsf"),
          bill_count: billDetailData?.successAmount?.transferCount || 0,
          total_bill_amount:
            billDetailData?.successAmount?.transferPayment || 0,
        },
        {
          no: 4,
          bill_type: t("money_from_appzap"),
          bill_count: 0,
          total_bill_amount: 0,
        },
        {
          no: 5,
          bill_type: t("total_debt"),
          bill_count: 0,
          total_bill_amount: 0,
        },
        {
          no: 6,
          bill_type: t("delivery_panda"),
          bill_count: deliveryRevenue?.totalOrders || 0,
          total_bill_amount: deliveryRevenue?.totalRevenue || 0,
        },
        {
          no: 7,
          bill_type: t("point"),
          bill_count: 0,
          total_bill_amount: 0,
        },
        {
          no: 8,
          bill_type: t("service_charge"),
          bill_count: 0,
          total_bill_amount: 0,
        },
        {
          no: 9,
          bill_type: t("tax"),
          bill_count: 0,
          total_bill_amount: 0,
        },
        {
          no: 10,
          bill_type: t("total_tax_service_charge"),
          bill_count: 0,
          total_bill_amount: 0,
        },
      ];

      // เพิ่มข้อมูลรายละเอียดบิล
      billDetailRows.forEach((row) => {
        const rowData = [
          row.no,
          row.bill_type,
          row.bill_count,
          row.total_bill_amount,
        ];

        const detailRow = sheet.addRow(rowData);
        detailRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };

          cell.font = {
            name: "Noto Sans Lao",
            size: 13,
          };

          cell.alignment = {
            horizontal: cell.col === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        });
      });

      sheet.addRow([]);
      sheet.addRow([]);

      // เพิ่มข้อมูลธนาคาร
      sheet.getRow(sheet.rowCount + 1).values = ["ສະຫຼຸບທະນາຄານ:"];
      sheet.getRow(sheet.rowCount + 1).values = bankHeaders;

      // จัดรูปแบบหัวข้อธนาคาร
      bankHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลธนาคาร
      const bankData = bankRes?.data?.bank || [];
      bankData.forEach((bank, index) => {
        const bankRowData = [
          index + 1,
          bank?.bankDetails?.bankName || t("unknown"),
          bank?.bankTotalAmount || 0,
        ];

        const row = sheet.addRow(bankRowData);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };
          cell.font = {
            name: "Noto Sans Lao",
            size: 12,
          };
        });
      });

      // กรณีไม่มีข้อมูลธนาคาร
      if (bankData.length === 0) {
        const emptyBankRowData = new Array(bankHeaders.length).fill("");
        emptyBankRowData[0] = t("no_data");
        sheet.addRow(emptyBankRowData);
      }

      sheet.addRow([]);
      sheet.addRow([]);

      // สร้างส่วนหัวข้อมูลพนักงาน (StaffInfo)
      sheet.getRow(sheet.rowCount + 1).values = ["ຂໍ້ມູນພະນັກງານ:"];
      sheet.getRow(sheet.rowCount + 1).values = staffInfoHeaders;

      // จัดรูปแบบหัวกระดาษข้อมูลพนักงาน
      staffInfoHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลพนักงาน
      staffInfoData.forEach((staff, index) => {
        const staffRowData = [
          index + 1,
          staff?.userId?.userId || t("unknown"),
          (staff?.served || 0) + (staff?.canceled || 0),
          staff?.canceled || 0,
          0, // ไม่มีข้อมูล order_paid ใน API
          staff?.totalSaleAmount || 0,
        ];

        const staffRow = sheet.addRow(staffRowData);
        staffRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };

          cell.font = {
            name: "Noto Sans Lao",
            size: 13,
          };

          cell.alignment = {
            horizontal: cell.col === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        });
      });

      // เว้นสองบรรทัด
      sheet.addRow([]);
      sheet.addRow([]);

      // สร้างส่วนหัวยอดขายรายวัน (DialySales)
      sheet.getRow(sheet.rowCount + 1).values = ["ລາຍງານຍອດຂາຍລາຍວັນ:"];
      sheet.getRow(sheet.rowCount + 1).values = dailySalesHeaders;

      // จัดรูปแบบหัวกระดาษยอดขายรายวัน
      dailySalesHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลยอดขายรายวัน
      dailySalesData.forEach((day, index) => {
        const dailySalesRowData = [
          day?.date || "-",
          day?.order || 0,
          day?.bill || 0,
          0, // ไม่มีข้อมูล delivery ใน API
          day?.billBefore || 0,
          day?.discount || 0,
          day?.remainingAmount || 0,
          day?.billAmount || 0,
        ];

        const dailySalesRow = sheet.addRow(dailySalesRowData);
        dailySalesRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };

          cell.font = {
            name: "Noto Sans Lao",
            size: 13,
          };

          cell.alignment = {
            horizontal: cell.col === 1 ? "center" : "left",
            vertical: "middle",
            wrapText: true,
          };
        });
      });

      // เว้นสองบรรทัด
      sheet.addRow([]);
      sheet.addRow([]);

      // สร้างส่วนหัวประเภทเมนู
      sheet.getRow(sheet.rowCount + 1).values = ["ປະເພດເມນູ:"];
      sheet.getRow(sheet.rowCount + 1).values = menuTypeHeaders;

      // จัดรูปแบบหัวกระดาษประเภทเมนู
      menuTypeHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลประเภทเมนู
      menuTypeData.forEach((category, index) => {
        const menuTypeRowData = [
          category?.name || t("unknown"),
          category?.served || 0,
          category?.cenceled || 0,
          category?.paid || 0,
          category?.totalSaleAmount || 0,
        ];

        const menuTypeRow = sheet.addRow(menuTypeRowData);
        menuTypeRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        });
      });

      sheet.addRow([]);
      sheet.addRow([]);

      // สร้างส่วนหัวรายละเอียดเมนู
      sheet.getRow(sheet.rowCount + 1).values = ["ຂໍ້ມູນເມນູ:"];
      sheet.getRow(sheet.rowCount + 1).values = menuInfoHeaders;

      // จัดรูปแบบหัวกระดาษรายละเอียดเมนู
      menuInfoHeaders.forEach((header, index) => {
        const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFA07A" }, // Light Salmon color
        };
        cell.font = {
          name: "Noto Sans Lao",
          size: 13,
          bold: true,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        // เพิ่มเส้นขอบที่เข้มขึ้น
        cell.border = {
          top: { style: "thin", color: COLOR_APP },
          left: { style: "thin", color: COLOR_APP },
          bottom: { style: "thin", color: COLOR_APP },
          right: { style: "thin", color: COLOR_APP },
        };
      });

      // เพิ่มข้อมูลรายละเอียดเมนู
      menuInfoData.forEach((menu, index) => {
        const menuInfoRowData = [
          menu?.name || t("unknown"),
          menu?.served || 0,
          menu?.cenceled || 0,
          menu?.paid || 0,
          menu?.totalSaleAmount || 0,
        ];

        const menuInfoRow = sheet.addRow(menuInfoRowData);
        menuInfoRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        });
      });

      sheet.addRow([]);
      sheet.addRow([]);

      // เพิ่มข้อมูลสกุลเงิน (ถ้ามี)
      if (
        currencyRes?.data?.currency &&
        currencyRes?.data?.currency.length > 0
      ) {
        sheet.getRow(sheet.rowCount + 1).values = [t("all_curency") + ":"];
        sheet.getRow(sheet.rowCount + 1).values = currencyHeaders;

        // จัดรูปแบบหัวข้อสกุลเงิน
        currencyHeaders.forEach((header, index) => {
          const cell = sheet.getRow(sheet.rowCount).getCell(index + 1);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA07A" },
          };
          cell.font = {
            name: "Noto Sans Lao",
            size: 13,
            bold: true,
            color: { argb: "FF000000" },
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin", color: COLOR_APP },
            left: { style: "thin", color: COLOR_APP },
            bottom: { style: "thin", color: COLOR_APP },
            right: { style: "thin", color: COLOR_APP },
          };
        });

        // เพิ่มข้อมูลสกุลเงิน
        const currencyData = currencyRes?.data?.currency || [];
        currencyData.forEach((currency, index) => {
          const currencyRowData = [
            index + 1,
            currency?.currencyName || t("unknown"),
            currency?.totalAmount || 0,
          ];

          const row = sheet.addRow(currencyRowData);
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin", color: COLOR_APP },
              left: { style: "thin", color: COLOR_APP },
              bottom: { style: "thin", color: COLOR_APP },
              right: { style: "thin", color: COLOR_APP },
            };
            cell.font = {
              name: "Noto Sans Lao",
              size: 12,
            };
          });
        });
      }

      // ตั้งความกว้างคอลัมน์
      const maxColumns = Math.max(
        billHeaders.length,
        promotionHeaders.length,
        billDetailHeaders.length,
        bankHeaders.length,
        staffInfoHeaders.length,
        dailySalesHeaders.length,
        menuTypeHeaders.length,
        menuInfoHeaders.length,
        currencyHeaders.length
      );
      sheet.columns = Array(maxColumns)
        .fill()
        .map(() => ({ width: 18 }));

      // สร้างไฟล์ Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // ดาวน์โหลดไฟล์
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${storeDetail?.name} - All Export.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(":", err);
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
          {storeDetail?.isStatusCafe ? (
            <Button
              style={{ height: 100, padding: 20, width: 200 }}
              onClick={ex}
            >
              <span>{t("All Export")}</span>
            </Button>
          ) : (
            <Button
              style={{ height: 100, padding: 20, width: 200 }}
              // onClick={Promotions}
              disabled
            >
              <span>{t("sales_info")}</span>
            </Button>
          )}

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
