import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import { getLocalData } from "../../constants/api";
import { getBilldebts, getdebtHistory } from "../../services/debt";
import moment from "moment";
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import { MdOutlineCloudDownload } from "react-icons/md";
import { useStoreStore } from "../../zustand/storeStore";
import PopUpDebtExportUserId from "./PopUpDebtExportUserId";

export default function PopUpDebtExport({
  open,
  onClose,
  callback,
  debtHistoryData,
  billDebtData
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // const [billDebtData, setbillDebtData] = useState([]);
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
  //     setbillDebtData(data);
  //     setTotalPagination(Math.ceil(data?.totalCount / limitData));
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
    setShowMainModal(false); // ซ่อน PopUpDebtExport
  };

  const handleUserModalClose = () => {
    setShowUserModal(false);
    setShowMainModal(true); // แสดง PopUpDebtExport อีกครั้ง
  };

  const handleMainModalClose = () => {
    setShowMainModal(false);
    onClose();
  };

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
                {t("customer_name")}: {billDebtData?.customerName}
              </span>
              <Button
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
                  <th style={{ paddingRight: "10rem" }}>{t("bill_no")}</th>
                  <th style={{ paddingRight: "5rem" }}>{t("money_remaining")}</th>
                  <th style={{ paddingRight: "5rem" }}>{t("debt_pay_remaining")}</th>
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
                ) : billDebtData && billDebtData.length > 0 ? (
                  billDebtData
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
        billDebtData={selectedDebt}
      />
    </>
  );
}