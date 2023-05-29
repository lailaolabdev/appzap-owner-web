import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
const UserCheckoutModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      centered
      arialabelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>ການເຊັກບິນ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>ໂຕະ {props?.tableId} ຕ້ອງການເຊັກບີນ</p>
        <div style={{ float: "right" }}>
          <Button onClick={props.func}>ຕົກລົງ</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

UserCheckoutModal.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  func: PropTypes.func,
  tableId: PropTypes.string,
};
export default UserCheckoutModal;
