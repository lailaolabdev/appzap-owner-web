import React from "react";
import * as ExcelJS from "exceljs";
import Swal from "sweetalert2";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../../constants";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreStore } from "../../../zustand/storeStore";

const toDataURL = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onloadend = function () {
        resolve({ base64Url: reader.result });
      };
    };
    xhr.onerror = (err) => reject(err);
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
};

export default function StockExport({ stock, storeName }) {
  const { t } = useTranslation();

  const header = [
    t("#"),
    t("date"),
    t("prod_name"),
    t("type"),
    t("buy_price"),
    // t("jam"),
    t("amount"),
    t("out_amount"),
    t("in_amount"),
    t("wastes"),
    t("low_stock"),
    t("unit"),
    t("total_amount"),
  ];

  const exportExcelFile = async () => {
    if (stock.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("Please select data to export."),
        timer: 3000,
        position: "top-end",
        toast: true,
        showConfirmButton: false,
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Expenses");

    // Set header row
    sheet.getRow(2).values = header;

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
        color: { argb: "FFFFิFFFF" },
      };

      cell.alignment = {
        horizontal: i === 1 ? "center" : "left",
        vertical: "middle",
        wrapText: true,
      };
    }

    sheet.columns = [
      { key: "index", width: 10 },
      { key: "createdAt", width: 18 },
      { key: "name", width: 18 },
      { key: "stockCategoryId", width: 18 },
      { key: "buyPrice", width: 18 },
      // { key: "obstacle", width: 18 },
      { key: "quantity", width: 18 },
      { key: "sale", width: 18 },
      { key: "import", width: 18 },
      { key: "wastes", width: 18 },
      { key: "statusLevel", width: 18 },
      { key: "unit", width: 18 },
      { key: "totalAmount", width: 18 },
    ];

    for (const [index, stocks] of stock.entries()) {
      console.log("stocks", stocks);
      const formattedDate = moment(stocks?.createdAt).format("DD/MM/YYYY");

      const row = sheet.addRow({
        index: index + 1,
        createdAt: formattedDate,
        name: stocks?.name,
        stockCategoryId: stocks?.stockCategoryId?.name,
        buyPrice: stocks?.buyPrice,
        // obstacle: stocks?.expendImages?.length ? "Image" : "No",
        quantity: stocks?.quantity,
        sale: stocks?.sale,
        import: stocks?.import,
        wastes: stocks?.wastes,
        statusLevel: stocks?.statusLevel,
        unit: stocks?.unit,
        totalAmount: stocks?.stockLevel,
      });

      row.eachCell((cell, colNumber) => {
        cell.font = {
          name: "Noto Sans Lao",
          size: 14,
        };

        cell.alignment = {
          horizontal: colNumber === 1 ? "center" : "left",
          vertical: "middle",
        };
      });

      // if (stocks?.expendImages?.length) {
      //   const photoURL = URL_PHOTO_AW3 + stocks.expendImages[0];
      //   console.log("photoURL", photoURL);

      //   try {
      //     const result = await toDataURL(photoURL);
      //     console.log("Base64 Data:", result.base64Url);

      //     if (!result?.base64Url.startsWith("data:image")) {
      //       throw new Error("Invalid Base64 image format");
      //     }

      //     const imageId = workbook.addImage({
      //       base64: result.base64Url,
      //       extension: "jpeg",
      //     });

      //     sheet.addImage(imageId, {
      //       tl: { col: 5, row: index + 3 },
      //       ext: { width: 50, height: 50 },
      //     });
      //   } catch (error) {
      //     console.error("Error adding image to Excel:", error);
      //   }
      // }
    }

    for (let i = 1; i <= stock.length + 2; i++) {
      sheet.getRow(i).height = 45;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${storeName} - ExportExel.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exportExcelFile()}
          class="bg-color-app hover:bg-color-app/70 text-white font-md py-2 px-3 rounded-md "
          onMouseEnter={(e) => (e.target.style.backgroundColor = "green")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLOR_APP)}
          title={t("Export")}
        >
          <FontAwesomeIcon icon={faFileExport} style={{ marginRight: "8px" }} />
          {t("Export")}
        </button>
      </div>
    </>
  );
}
