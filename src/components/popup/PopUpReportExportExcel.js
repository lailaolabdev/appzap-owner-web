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
