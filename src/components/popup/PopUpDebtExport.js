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

export default function PopUpDebtExport({
  open,
  onClose,
  debtHistoryData,
  exportType,
  handleTabSelect
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

  // Filter data effect
  const filterData = () => {
    if (debtHistoryData) {
      const filtered = debtHistoryData
        .filter(e => {
          if (exportType === 'payment') {
            return e?.totalPayment > 0;
          }
          return e?.remainingAmount >= 0;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    filterData();
  }, [debtHistoryData, exportType]);

  const getModalTitle = () => {
    switch (exportType) {
      case 'payment':
        return t("paydebt_list_history");
      default:
        return t("debt_list_all");
    }
  };

  const getTotalAmount = () => {
    if (!filteredData?.length) return 0;

    switch (exportType) {
      case 'payment':
        return filteredData.reduce((sum, item) => sum + (item.totalPayment || 0), 0);
      default:
        return filteredData.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Your Application';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('ລາຍງານຫນີ້', {
      properties: { defaultRowHeight: 20 }
    });

    const defaultFont = { name: 'Noto Sans Lao', size: 11, family: 2 };
    const headerFont = { ...defaultFont, size: 20, bold: true };

    // Header setup
    const excelColor = COLOR_APP.replace('#', 'FF');
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = getModalTitle();
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
      t("#"),
      t("bill_no"),
      t("name"),
      t("tel"),
      t("money_remaining"),
      exportType === 'payment' ? t("debt_pay_remaining")
        : t("status"),
      t("payment_datetime_debt")
    ].filter(Boolean);

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

    // Add data rows with explicit zero handling
    filteredData.forEach((item, index) => {
      const remainingAmount = typeof item?.remainingAmount === 'number' ? item.remainingAmount : 0;
      const totalPayment = typeof item?.totalPayment === 'number' ? item.totalPayment : 0;

      const getStatusText = (status) => {
        switch (status) {
          case 'PAY_DEBT':
            return 'ຊຳລະແລ້ວ';
          case 'PARTIAL_PAYMENT':
            return 'ຍັງຄ້າງຈ່າຍ';
          case 'DEBT':
            return 'ຕິດໜີ້';
          default:
            return '';
        }
      };

      const rowData = [
        index + 1,
        item?.code || '',
        item?.customerName || '',
        item?.customerPhone || '',
        remainingAmount,
        exportType === 'payment' ? totalPayment
          : getStatusText(item?.status || ''),
        item?.outStockDate ? moment(item?.outStockDate).format("DD/MM/YYYY - HH:mm:SS") : ''
      ];

      const row = worksheet.addRow(rowData);
      row.font = defaultFont;
      row.height = 20;
      row.eachCell((cell, colNumber) => {
        if ([5, 6].includes(colNumber) && (cell.value === null || cell.value === undefined || cell.value === '')) {
          cell.value = 0;
        }

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
      });
    });

    // Add empty row for spacing
    worksheet.addRow([]);

    // Add total row
    const totalRow = worksheet.addRow([
      '',
      '',
      '',
      exportType === 'payment' ? t("ຍອດລວມການຊຳລະໜີ້ທັງຫມົດ") : t("ຍອດລວມການຕິດໜີ້ທັງຫມົດ"),
      getTotalAmount(),
      'ກີບ',
      ''
    ]);

    // Style total row
    totalRow.font = { ...defaultFont, bold: true };
    totalRow.height = 25;
    totalRow.getCell(4).alignment = { horizontal: 'right' };
    totalRow.getCell(5).numFmt = '#,##0.00';
    totalRow.getCell(5).alignment = { horizontal: 'right' };

    // Format columns
    [5, 6].forEach(col => {
      if (worksheet.getColumn(col)) {
        worksheet.getColumn(col).numFmt = '#,##0.00';
        worksheet.getColumn(col).eachCell({ includeEmpty: true }, cell => {
          if (cell.value === null || cell.value === undefined || cell.value === '') {
            cell.value = 0;
          }
        });
      }
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
    const fileName = `${getModalTitle()}_${fileDate}.xlsx`;

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
        {getModalTitle()}
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
              {exportType === 'payment' ? `${t("ຍອດລວມການຊຳລະໜີ້ທັງຫມົດ")} ${moneyCurrency(getTotalAmount())}`
                : `${t("ຍອດລວມການຕິດໜີ້ທັງຫມົດ")} ${moneyCurrency(getTotalAmount())}`} ກີບ"
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
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ paddingRight: "3rem" }}>#</th>
                <th style={{ paddingRight: "4rem" }}>{t("bill_no")}</th>
                <th style={{ paddingRight: "4rem" }}>{t("name")}</th>
                <th style={{ paddingRight: "7rem" }}>{t("tel")}</th>
                <th style={{ paddingRight: "2rem" }}>{t("money_remaining")}</th>
                {exportType === '' && (<th>{t("status")}</th>)}
                {exportType === 'payment' && (<th style={{ paddingRight: "2rem" }}>{t("debt_pay_remaining")}</th>)}
                <th>{t("payment_datetime_debt")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={exportType === 'increase' ? 8 : 7} style={{ textAlign: "center" }}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((e, i) => (
                  <tr key={i}>
                    <td>{(pagination - 1) * limitData + i + 1}</td>
                    <td>{e.code}</td>
                    <td>{e?.customerName}</td>
                    <td>{e?.customerPhone}</td>
                    <td>{moneyCurrency(e?.remainingAmount)}</td>
                    {exportType === '' && (<td style={{ color: `${e?.status === 'DEBT' ? "red" : e?.status === "PAY_DEBT" ? "green" : "orange"}` }}>{e?.status === "DEBT" ? t("debt") : e?.status === "PAY_DEBT" ? t("debt_pay") : t("partial_payment")}</td>)}
                    {exportType === 'payment' && (<td style={{ color: "MediumSeaGreen" }}>{moneyCurrency(e?.totalPayment)}</td>)}
                    {exportType === '' ? <td>
                      {e?.outStockDate ? moment(e?.outStockDate).format("DD/MM/YYYY - HH:mm:SS : a") : ""} </td>
                      :
                      <td>{moment(e?.updatedAt).format("DD/MM/YYYY - HH:mm:SS : a")}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={exportType === 'increase' ? 8 : 7} style={{ textAlign: "center" }}>
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