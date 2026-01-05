import React from "react";
import styled from "styled-components";
import moment from "moment";
import { moneyCurrency } from "../../helpers";
import { useTranslation } from "react-i18next";

export default function BillDebt80({
  storeDetail,
  billDebtData,
  customerData,
  paymentData,
  language,
}) {
  const { t } = useTranslation();

  if (!billDebtData) {
    return <div>No debt data available</div>;
  }

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  return (
    <Container>
      <div
        style={{
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          display: billDebtData?.code ? "flex" : "none",
        }}
      >
        <div className="text-center mb-4">
          <div className="font-bold text-lg justify-center item-center w-full">
            {storeDetail?.name || "Store Name"}
          </div>
          {storeDetail?.phone && (
            <div className="text-sm mt-1 justify-center item-center w-full">
              {t("phone")}: {storeDetail.phone}
            </div>
          )}
        </div>
        <div className="w-full pr-3">
          <hr style={{ borderBottom: "1px dotted #000", width: "100%" }} />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            marginBottom: 15,
          }}
        >
          {t("bill_debt") || "Bill Debt"}
        </div>
        <div className="w-full pr-3">
          <hr style={{ borderBottom: "1px dotted #000", width: "100%" }} />
        </div>
        <div className="mb-4 w-full pr-2">
          <InfoRow>
            <span>{t("bill_no") || "Bill No"}:</span>
            <span>{billDebtData?.code}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("start_date_debt") || "Start Date Debt"}:</span>
            <span>{formatDate(billDebtData?.startDate || new Date())}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("end_date_debt") || "End Date Debt"}:</span>
            <span>{formatDate(billDebtData?.endDate || new Date())}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("customer") || "Customer"}:</span>
            <span>{billDebtData?.customerName || ""}</span>
          </InfoRow>
          <InfoRow>
            <span>{t("customer_phone") || "Phone"}:</span>
            <span>{billDebtData?.customerPhone || ""}</span>
          </InfoRow>

          {billDebtData?.tableNo && (
            <InfoRow>
              <span>{t("table") || "Table"}:</span>
              <span>{billDebtData.tableNo}</span>
            </InfoRow>
          )}
        </div>
        <div className="w-full pr-2">
          <Table>
            <tr>
              <th style={{ textAlign: "left" }}>{t("menu")}</th>
              <th style={{ textAlign: "center" }}>{t("price")}</th>
              <th style={{ textAlign: "right" }}>{t("quantity")}</th>
            </tr>
            {billDebtData?.billId?.orderId?.map((e) => (
              <tr>
                <td style={{ textAlign: "start" }}>
                  {language === "la"
                    ? e?.name || e?.nameMenu
                    : language === "en"
                    ? e?.name_en || e?.name || e?.nameMenu
                    : language === "kr"
                    ? e?.name_kr || e?.name || e?.nameMenu
                    : language === "cn"
                    ? e?.name_cn || e?.name || e?.nameMenu
                    : e?.name || e?.nameMenu}
                </td>
                <td style={{ textAlign: "center" }}>
                  {e?.quantity || e?.amount}
                </td>
                <td style={{ textAlign: "right" }}>{e?.price || 0}</td>
              </tr>
            ))}
          </Table>
        </div>
        {/* <hr style={{ borderBottom: "1px dotted #000", width: "100%" }} /> */}
        <div className="w-full pr-3 mt-4">
          <hr style={{ borderBottom: "1px dotted #000", width: "100%" }} />
        </div>
      </div>
      {/* <hr className="w-full border-b border-dotted border-black pr-2 py-4"/> */}
      <div className="mb-4 w-full pr-2">
        <InfoRow>
          <span>{t("bill_debt_amount") || "Original Amount"}:</span>
          <span>
            {moneyCurrency(billDebtData?.amount || 0)}{" "}
            {storeDetail?.firstCurrency}
          </span>
        </InfoRow>

        <InfoRow>
          <span>{t("bill_debt_payment") || "Paid Amount"}:</span>
          <span>
            {moneyCurrency(billDebtData?.payAmount || 0)}{" "}
            {storeDetail?.firstCurrency}
          </span>
        </InfoRow>

        <InfoRow className="font-bold">
          <span>{t("bill_debt_remaining") || "Remaining Amount"}:</span>
          <span>
            {moneyCurrency(
              billDebtData?.remainingAmount ||
                billDebtData?.originalAmount - billDebtData?.paidAmount ||
                0
            )}{" "}
            {storeDetail?.firstCurrency}
          </span>
        </InfoRow>
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
  width: 100%;
  max-width: 330px;
  font-size: 12px;
  color: #000;
  font-family: "Courier New", monospace;
  align-items: center;
`;

const InfoRow = styled.div`
  display: flex;
  width: 100%;
  padding: 4px;
  justify-content: space-between;
  margin-bottom: 4px;
  &.font-bold {
    font-weight: bold;
  }
`;

const Table = styled("table")({
  width: "100%",
  th: {
    border: "1px solid #fff",
    padding: "2px 4px",
    // backgroundColor: "#000",
    color: "#000",
    fontWeight: "bold",
  },
  td: {
    padding: "2px 2px",
    content: "center",
    textAlign: "center",
  },
});

const OrderItem = styled.div`
  margin-bottom: 8px;
  padding: 4px 0;
  border-bottom: 1px dotted #ccc;

  &:last-child {
    border-bottom: none;
  }
`;
