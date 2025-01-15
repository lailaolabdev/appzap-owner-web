import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import { getLocalData } from "../../constants/api";
import { getBilldebts, getdebtHistory } from "../../services/debt";
import moment from "moment";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import { MdOutlineCloudDownload } from "react-icons/md";
import { useStoreStore } from "../../zustand/storeStore";
import PopUpDebtExportUserId from "./PopUpDebtExportUserId";

export default function PopUpDebtExport({
  open,
  onClose,
  callback,
  billDebtData,
  debtHistoryData
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // const [debtHistoryData, setdebtHistoryData] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMainModal, setShowMainModal] = useState(open);

  const limitData = 50;
  const { storeDetail } = useStoreStore();

  useEffect(() => {
    setShowMainModal(open);
  }, [open]);

  // const getDataHistory = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { TOKEN } = await getLocalData();
  //     let findby = `?skip=${(pagination - 1) * limitData}&limit=${limitData}&storeId=${storeDetail?._id}`;
  //     const data = await getdebtHistory(findby, TOKEN);
  //     setdebtHistoryData(data);
  //     setTotalPagination(Math.ceil(data?.totalCount / limitData));
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const exportToExcel = async () => {
    // create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('รายงานหนี้');

    // add header
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'ລາຍງານຂໍ້ມູນການຕິດຫນີ້';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    
    // add table header
    worksheet.addRow([`${t("#")}`, `${t("bill_no")}`, `${t("name")}`,`${t("tel")}`,`${t("money_remaining")}`, `${t("debt_pay_remaining")}`, `${t("payment_datetime_debt")}`]);
    
    // layout style
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // add data
    const filteredData = debtHistoryData
      .filter(e => e?.remainingAmount > 0)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    filteredData.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.code,
        item.customerName,
        item.customerPhone,
        item.remainingAmount,
        item.totalPayment,
        item.outStockDate ? moment(item.outStockDate).format("DD/MM/YYYY - HH:mm:SS") : ''
      ]);
    });

    // layout money money
    worksheet.getColumn(3).numFmt = '#,##0.00';
    worksheet.getColumn(4).numFmt = '#,##0.00';

    // size column
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // create file
    const buffer = await workbook.xlsx.writeBuffer();
    const fileDate = moment().format('YYYYMMDD_HHmmss');
    saveAs(
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `ລາຍງານຫນີ້${fileDate}.xlsx`
    );
  };


  useEffect(() => {
    if (open) {
      //getDataHistory();
    }
  }, [open, pagination]);

  const handleRowClick = (debtData) => {
    setSelectedDebt({
      ...debtData,
    });
    setShowUserModal(true);
    setShowMainModal(false); 
  };

  const handleUserModalClose = () => {
    setShowUserModal(false);
    setShowMainModal(true); 
  };

  const handleMainModalClose = () => {
    setShowMainModal(false);
    onClose();
  };

  console.log("debtHistoryData: ",debtHistoryData)

  return (
    <>
      <Modal show={showMainModal} onHide={handleMainModalClose} size="xl">
        <Modal.Header closeButton style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                {t("customer_name")}: {debtHistoryData?.customerName}
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
                {t("phoneNumber")}: {debtHistoryData?.customerPhone}
              </span>
            </div>
          </Card.Header>
          <div style={{ display: "flex", justifyContent: "center", fontSize: 20, height: "2rem" }}>
            <tr>
              <th>{t("total_debt_export")}</th>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      <Spinner animation="border" variant="warning" />
                    </td>
                  </tr>
                ) : debtHistoryData && debtHistoryData.length > 0 ? (
                  debtHistoryData
                    .filter((e) => e?.remainingAmount > 0)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((e, i) => (
                      <tr
                        key={i}
                        onClick={() => handleRowClick(e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{(pagination - 1) * limitData + i + 1}</td>
                        <td>{e.code}</td>
                        <td>{(e?.customerName)}</td>
                        <td>{(e?.customerPhone)}</td>
                        <td>{moneyCurrency(e?.remainingAmount)}</td>                      
                        <td style={{ color: "MediumSeaGreen" }}>{moneyCurrency(e?.totalPayment)}</td>
                        <td>
                          {e?.outStockDate
                            ? moment(e?.outStockDate).format("DD/MM/YYYY - HH:mm:SS : a")
                            : ""}
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

      <PopUpDebtExportUserId
        open={showUserModal}
        onClose={handleUserModalClose}
        debtHistoryData={selectedDebt}
      />
    </>
  );
}