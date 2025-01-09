import * as ExcelJS from "exceljs";
import Swal from "sweetalert2";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { EMPTY_LOGO, URL_PHOTO_AW3 } from "../constants";

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

const ExportExpenses = ({ data }) => {
  const { t } = useTranslation();

  const header = [
    t("#"),
    t("date"),
    t("detial"),
    t("paid_type"),
    t("paid_mode"),
    // t("jam"),
    t("payer"),
    t("LAK"),
    t("THB"),
    t("CNY"),
    t("USD"),
  ];

  const exportExcelFile = async () => {
    if (data.length === 0) {
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
        fgColor: { argb: "FFFFA500" },
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
      { key: "detail", width: 18 },
      { key: "type", width: 18 },
      { key: "payment", width: 18 },
      // { key: "obstacle", width: 18 },
      { key: "paidBy", width: 18 },
      { key: "priceLAK", width: 18 },
      { key: "priceTHB", width: 18 },
      { key: "priceCNY", width: 18 },
      { key: "priceUSD", width: 18 },
    ];

    for (const [index, expenses] of data.entries()) {
      const formattedDate = moment(expenses?.createdAt).format("DD/MM/YYYY");

      const row = sheet.addRow({
        index: index + 1,
        createdAt: formattedDate,
        detail: expenses?.detail,
        type: expenses?.type,
        payment: expenses?.payment,
        // obstacle: expenses?.expendImages?.length ? "Image" : "No",
        paidBy: expenses?.paidBy,
        priceLAK: expenses?.priceLAK,
        priceTHB: expenses?.priceTHB,
        priceCNY: expenses?.priceCNY,
        priceUSD: expenses?.priceUSD,
      });

      row.eachCell((cell, colNumber) => {
        cell.font = {
          name: "Noto Sans Lao",
          size: 10,
        };

        cell.alignment = {
          horizontal: colNumber === 1 ? "center" : "left",
          vertical: "middle",
        };
      });

      if (expenses?.expendImages?.length) {
        const photoURL = URL_PHOTO_AW3 + expenses.expendImages[0];
        console.log("photoURL", photoURL);

        try {
          const result = await toDataURL(photoURL);
          console.log("Base64 Data:", result.base64Url);

          if (!result?.base64Url.startsWith("data:image")) {
            throw new Error("Invalid Base64 image format");
          }

          const imageId = workbook.addImage({
            base64: result.base64Url,
            extension: "jpeg",
          });

          sheet.addImage(imageId, {
            tl: { col: 5, row: index + 3 },
            ext: { width: 50, height: 50 },
          });
        } catch (error) {
          console.error("Error adding image to Excel:", error);
        }
      }
    }

    for (let i = 1; i <= data.length + 2; i++) {
      sheet.getRow(i).height = 45;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ExpensesReport.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exportExcelFile()}
          style={{
            backgroundColor: "#f97316",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            width: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "green")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f97316")}
          title={t("Export")}
        >
          <FontAwesomeIcon icon={faFileExport} style={{ marginRight: "8px" }} />
          {t("Export")}
        </button>
      </div>
    </>
  );
};

export default ExportExpenses;
