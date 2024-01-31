import { Button } from "react-bootstrap";

export const convertBillFarkStatus = (status) => {
  switch (status) {
    case "INSTOCK":
      return (
        <Button
          variant="dark"
          bg="dark"
          disabled
          style={{ backgroundColor: "green" }}
        >
          ຝາກ
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
          ມາເອົາແລ້ວ
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
          ກັບເຂົ້າສະຕ໊ອກຄືນ
        </Button>
      );

    default:
      return status;
  }
};
