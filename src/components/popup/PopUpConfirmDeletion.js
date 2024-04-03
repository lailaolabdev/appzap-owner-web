import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";

// Assuming COLOR_APP is defined elsewhere
import { COLOR_APP } from "../../constants";

const boxIcon = {
  position: "absolute",
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  width: "100%",
};

const iconStyle = {
  fontSize: "6em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#FB6E3B",
  marginTop: "-.7em",
  width: 120,
  height: 120,
  borderRadius: "30em",
  boxShadow:
    "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
  color: "#ffff",
  border: "10px solid #ffff",
};

const modalBodyStyle = {
  textAlign: "center",
  minHeight: "23vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 5,
  paddingTop: 15,
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "center",
  border: "none",
};

export default function PopUpConfirmDeletion({
  open,
  text,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleConfirmClick = () => {
    setButtonDisabled(true);
    onSubmit().then(() => setButtonDisabled(false));
  };

  return (
    <Modal show={open} centered>
      <Modal.Body>
        <div style={boxIcon}>
          <div style={iconStyle}>
            <BsQuestionLg />
          </div>
        </div>
        <div style={modalBodyStyle}>
          <h3 style={{ fontSize: 30, fontWeight: 600 }}>
            <b>ແຈ້ງເຕືອນ!</b>
          </h3>
          <div>
            ທ່ານຕ້ອງການລົບລາຍການ <span style={{ color: "red" }}>{text}</span>{" "}
            ອອກແທ້ ຫຼື ບໍ?
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
        <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={handleConfirmClick}
        >
          ຢືນຢັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
