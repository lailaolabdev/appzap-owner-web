import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const convertBillDebtStatus = (status, t) => {
  switch (status) {
    case "DEBT":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "red", color: "white"}}
        >
          {t("debt")}
        </Button>
      );
    case "PAY_DEBT":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "green", color: "white" }}
        >
          {t("debt_pay")}
        </Button>
      );
    case "PARTIAL_PAYMENT":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "DarkOrange", color: "white" }}
        >
          {t("partial_payment")}
        </Button>
      );
    default:
      return status;
  }
};
