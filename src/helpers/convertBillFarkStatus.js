import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";


export const convertBillFarkStatus = (status, t) => {
  switch (status) {
    case "INSTOCK":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "green" }}
        >
          {t('deposit')}
        </Button>
      );
    case "OUT_STOCK":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "red" }}
        >
          {t('taken')}
        </Button>
      );
    case "MOVE_STOCK":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "yellow" }}
        >
          {t('back_to_stock')}
        </Button>
      );

    default:
      return status;
  }
};
