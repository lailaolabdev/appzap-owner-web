import React from "react";
import { Modal, Button, Card, Spinner } from "react-bootstrap";
import { MdOutlineCloudDownload } from "react-icons/md";
import ImageEmpty from "../../image/empty.png";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useTranslation } from "react-i18next";
import { moneyCurrency } from "../../helpers";

const PopUpDebtExportUserId = ({
    open,
    onClose,
    callback,
    billDebtData,
}) => {
    const debtDataArray = billDebtData ? [billDebtData] : [];
    const { t } = useTranslation();

    // Helper function to format date without moment
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' - ' + d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const exportToExcel = async () => {
        // create new workbook  worksheet 
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('ລາຍງານການຕິດຫນີ້');

        // add header
        worksheet.mergeCells('A1:G1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'ລາຍງານຂໍ້ມູນການຕິດຫນີ້';
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center' };

        // add data customer
        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `${t("name")}: ${billDebtData?.customerName || ''} | ${t("tel")}: ${billDebtData?.customerPhone || ''}`;

        // add table header
        worksheet.addRow([`${t("#")}`, `${t("bill_no")}`, `${t("name")}`, `${t("tel")}`, `${t("money_remaining")}`, `${t("debt_pay_remaining")}`, `${t("payment_datetime_debt")}`]);

        // add table style
        const headerRow = worksheet.getRow(3);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };

        // Ensure we're working with an array
        const dataToExport = Array.isArray(billDebtData) ? billDebtData : [billDebtData];

        // add data
        dataToExport.forEach((item, index) => {
            worksheet.addRow([
                index + 1,
                item.code,
                item.customerName,
                item.customerPhone,
                item.remainingAmount,
                item.totalPayment,
                item.outStockDate ? formatDate(item.outStockDate) : ''
            ]);
        });

        // layout money 
        worksheet.getColumn(3).numFmt = '#,##0.00';
        worksheet.getColumn(4).numFmt = '#,##0.00';

        // size auto column
        worksheet.columns.forEach(column => {
            column.width = 20;
        });

        // create file
        const buffer = await workbook.xlsx.writeBuffer();
        const fileDate = new Date().toISOString().slice(0,19).replace(/[-:]/g, '').replace('T', '_');
        saveAs(
            new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            `ລາຍການຕິດຫນີ້${fileDate}.xlsx`
        );
    };

    return (
        <Modal show={open} onHide={onClose} size="xl">
            <Modal.Header
                closeButton
                style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
                {t("debt_Export")}
            </Modal.Header>
            <Card border="none" style={{ margin: 0 }}>
                <Card.Header
                    style={{
                        background: "none",
                        fontSize: 16,
                        fontWeight: "bold",
                        alignItems: "center",
                        padding: 10,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <span>
                            {t("customer_name")}: {billDebtData?.customerName}
                        </span>
                        <Button
                            onClick={exportToExcel}
                            style={{
                                marginLeft: 'auto',
                                color: "white",
                                width: "10%",
                                fontWeight: "bold",
                            }}
                        >
                            <MdOutlineCloudDownload /> Export
                        </Button>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <span>
                            {t("phoneNumber")}: {billDebtData?.customerPhone}
                        </span>
                    </div>
                </Card.Header>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: 20,
                        height: "2rem"
                    }}
                >
                    <tr>
                        <th>
                            Total Debt Export
                        </th>
                    </tr>
                </div>

                <Card.Body>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ paddingRight: "3rem" }}>#</th>
                                <th style={{ paddingRight: "4rem" }}>{t("bill_no")}</th>
                                <th style={{ paddingRight: "4rem" }}>{t("name")}</th>
                                <th style={{ paddingRight: "7rem" }}>{t("tel")}</th>
                                <th style={{ paddingRight: "2rem" }}>{t("money_remaining")}</th>
                                <th style={{ paddingRight: "2rem" }}>{t("debt_pay_remaining")}</th>
                                <th>{t("payment_datetime_debt")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!billDebtData ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center" }}>
                                        <img src={ImageEmpty} alt="" style={{ width: 300, height: 200 }} />
                                    </td>
                                </tr>
                            ) : (
                                debtDataArray.map((item, index) => (
                                    <tr
                                        key={index}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{item?.code}</td>
                                        <td>{(item?.customerName)}</td>
                                        <td>{(item?.customerPhone)}</td>
                                        <td>{moneyCurrency(item?.remainingAmount)}</td>
                                        <td style={{ color: "MediumSeaGreen" }}>{moneyCurrency(item?.totalPayment)}</td>
                                        <td>
                                            {item?.outStockDate
                                                ? formatDate(item?.outStockDate)
                                                : ""}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card.Body>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    bottom: 20
                }} />
            </Card>
        </Modal>
    );
};

export default PopUpDebtExportUserId;