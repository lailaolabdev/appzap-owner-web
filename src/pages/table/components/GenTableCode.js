import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const GenTableCode = ({ show, onHide, data }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      arialabelledby="contained-modal-title-vcenter"
      data={data}
    >
      <Modal.Header closeButton>
        <Modal.Title>ຂໍ້ມູນເບີຕູບ </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="tableId">
          <Form.Label>
            ເບີຕູບທີ່ເຂົ້າລະຫັດ:
            <span style={{ color: "blue", fontSize: 18, fontWeight: "bold" }}>
              {"  "}
              {data}
            </span>
          </Form.Label>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
};

export default GenTableCode;
