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
      <Modal.Header>
        <Modal.Title>Hello World</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props?.tableId}</p>
        <Button onClick={props.func}>ຕົກລົງ</Button>
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
