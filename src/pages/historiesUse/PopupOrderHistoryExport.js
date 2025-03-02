import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import moment from "moment";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import { MdOutlineCloudDownload } from "react-icons/md";
import { useStoreStore } from "../../zustand/storeStore";
import { COLOR_APP } from "../../constants";

export default function PopupOrderHistoryExport({
  open,
  onClose,
  debtHistoryData,
  exportType,
  data,
  filtterModele
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [showMainModal, setShowMainModal] = useState(open);
  const [filteredData, setFilteredData] = useState([]);

  const limitData = 50;
  const { storeDetail } = useStoreStore();

  // Modal visibility effect
  useEffect(() => {
    setShowMainModal(open);
  }, [open]);



  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Your Application';
    workbook.created = new Date();
  
    const worksheet = workbook.addWorksheet('ລາຍງານອາຫານ', {
      properties: { defaultRowHeight: 20 }
    });
  
    const defaultFont = { name: 'Noto Sans Lao', size: 11, family: 2 };
    const headerFont = { ...defaultFont, size: 20, bold: true };
  
    // Header setup
    const excelColor = COLOR_APP.replace('#', 'FF');
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `ປະຫວັດອາຫານ ${filtterModele === "order_history" ? "" : "ທີ"} ${filtterModele === "order_history" ? "" : filtterModele} ທັງຫມົດ`;
    titleCell.font = headerFont;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.height = 30;
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: excelColor }
    };
  
    // Column headers
    const headers = [
      t("no"),
      t("manager_name"),
      t("detail"),
      t("cause"),
      t("date_time")
    ];
  
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { ...defaultFont, bold: true };
    headerRow.height = 25;
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  
    // Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  
    // Add data rows from the main table data
    data.forEach((item, index) => {
      const rowData = [
        (pagination - 1) * limitData + index + 1,
        item?.user || '',
        item?.eventDetail || '',
        item?.reason ? item.reason : '--',
        item?.createdAt ? moment(item.createdAt).format("DD/MM/YYYY - HH:mm:SS : a") : ''
      ];
  
      const row = worksheet.addRow(rowData);
      row.font = defaultFont;
      row.height = 20;
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
        
        // Align date/time to the right
        if (colNumber === 5) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
        }
      });
    });
  
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, length);
      });
      column.width = Math.min(Math.max(maxLength + 2, 15), 30);
    });
  
    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const fileDate = moment().format('YYYYMMDD_HHmmss');
    const fileName = `ປະຫວັດອາຫານ_${filtterModele}_${fileDate}.xlsx`;
  
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      fileName
    );
  };



  return (
    <Modal show={showMainModal} onHide={onClose} size="xl">
      <Modal.Header closeButton style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span>  ປະຫວັດອາຫານ {`${filtterModele === "order_history" ? "" : "ທີ"} ${filtterModele === "order_history" ? "" : filtterModele} `}  ທັງຫມົດ"</span>
      </Modal.Header>
      <Card border="none" style={{ margin: 0 }}>
        <Card.Header
          style={{
            background: "none",
            fontSize: 16,
            fontWeight: "bold",
            padding: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span>
            </span>
            <Button
              onClick={exportToExcel}
              style={{
                marginLeft: 'auto',
                color: "white",
                width: "10%",
                fontWeight: "bold",
                display: 'flex',
                alignItems: 'center',
                backgroundColor: COLOR_APP
              }}
            >
              <MdOutlineCloudDownload style={{ marginRight: '10px' }} /> Export
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <table style={{ width: "100%", textAlign: "center", marginLeft: "auto" }}>
            <thead>
              <tr>
                <th style={{ paddingRight: "1rem", width: "5%" }}>{t("no")}</th>
                <th style={{ paddingRight: "2rem", width: "10%" }}>{t("manager_name")}</th>
                <th style={{ paddingRight: "3rem" }}>{t("detail")}</th>
                <th style={{ paddingRight: "1rem", width: "10%" }}>{t("cause")}</th>
                <th style={{ width: "25%", paddingRight: "0" }}>{t("date_time")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((e, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: "left" }}>{(pagination - 1) * limitData + i + 1}</td>
                    <td style={{ textAlign: "left" }}>{e?.user}</td>
                    <td style={{ textAlign: "left" }}>{e?.eventDetail}</td>
                    <td style={{ textAlign: "left" }}>{e?.reason ? e?.reason : "--"}</td>
                    <td style={{ textAlign: "right" }}>
                      {moment(e?.createdAt).format("DD/MM/YYYY - HH:mm:SS : a")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    <img src={ImageEmpty} alt="" style={{ width: 300, height: 200 }} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </Card.Body>
      </Card>
    </Modal>
  );
}