import React, { useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { MdConfirmationNumber } from "react-icons/md";
import { IoMdSave } from "react-icons/io";

export default function PopUpSelfOrderingConfirm({
  open,
  title,
  orders,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <MdConfirmationNumber />
        {title}
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {orders?.map((order) => (
            <ListGroup.Item action>
              {order?.menuName} x{order?.quantity}
            </ListGroup.Item>
          ))}
        </ListGroup>
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
          <IoMdSave />
          ຢືນຢັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
