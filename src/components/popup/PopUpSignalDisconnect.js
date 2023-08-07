import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { MdSignalWifiConnectedNoInternet1 } from "react-icons/md";

export default function PopUpSignalDisconnect({
  open,
  text,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} centered>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Body>
        <div
          style={{
            textAlign: "center",
            minHeight: "20vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <MdSignalWifiConnectedNoInternet1
            style={{ width: 150, height: 150 }}
          />
          <div style={{ fontSize: "20px", fontWeight: 600 }}>
            ເຄືອຂ່າຍຄັດຄ້ອງ
          </div>
          <div style={{ color: "red" }}>{text && text}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={() => {
            setButtonDisabled(true);
            onSubmit().then(() => setButtonDisabled(false));
          }}
        >
          ໂຫຼດອິກຄັ້ງ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
