import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_APP, padding } from "../../constants";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import { getLocalData } from "../../constants/api";
import { getBilldebts } from "../../services/debt";
import { getdebtHistory } from "../../services/debt";
import { useStore } from "../../store";
import moment from "moment";
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import { IoBeerOutline } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { convertBillDebtStatus } from "../../helpers/convertBillDebtStatus";
import { MdOutlineCloudDownload } from "react-icons/md";

export default function PopUpDebtExport({
  open,
  onClose,
  callback,
  billDebtData,
}) {
  const { t } = useTranslation();

  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [debtHistoryData, setDebtHistoryData] = useState([]);

  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);

  useEffect(() => {
    if (open) {

    }
  }, [open]);

  const getDataHistory = async () => {
    setIsLoading(true);
    try {
      const { TOKEN } = await getLocalData();
      let findby = `?skip=${(pagination - 1) * limitData}&limit=${limitData}&storeId=${storeDetail?._id}`;

      const data = await getdebtHistory(findby, TOKEN);
      setDebtHistoryData(data);
      setTotalPagination(Math.ceil(data?.totalCount / limitData));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataHistory();
  }, [pagination]);

  const limitData = 50;
  // Store
  const { storeDetail } = useStore();

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
              {t("total_debt_export")}
            </th>
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
              ) : debtHistoryData && debtHistoryData.length > 0 ? (
                debtHistoryData
                  .filter((e) => e?.totalPayment > 0)
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((e, i) => (
                    <tr key={i}>
                      <td>{(pagination - 1) * limitData + i + 1}</td>
                      <td>{e.code}</td>
                      <td>{moneyCurrency(e?.remainingAmount)}</td>
                      <td style={{ color: "MediumSeaGreen" }}>{moneyCurrency(e?.totalPayment)}</td>
                      <td>{e?.updatedAt ? moment(e?.updatedAt).format("DD/MM/YYYY - HH:mm:SS : a") : ""}</td>
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
        <div style={{ display: "flex", justifyContent: "center", width: "100%", bottom: 20 }}>
        </div>
      </Card>
    </Modal>
  );
}