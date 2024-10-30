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
          style={{ backgroundColor: "red" }}
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
          style={{ backgroundColor: "green" }}
        >
          {t("debt_pay")}
        </Button>
      );
    default:
      return status;
  }
};
