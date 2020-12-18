import React from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CancelModal = (props) => {
  return (
    <div>
      <Modal show={props.show} onHide={props.hide} centered>
        <Modal.Header closeButton>
          <Modal.Title>ຍົກເລີກເມນູ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ທ່ານຕອ້ງການຍົກເລີກ ເມນູນີ້?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.hide}>
            ກັບຄືນ
          </Button>
          <Button style={{backgroundColor: "#FB6E3B", border: "none"}} onClick={props.handleCancel}>
            ຕົກລົງ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
CancelModal.propTypes = {
  hide: PropTypes.func,
  show: PropTypes.bool,
  handleCancel: PropTypes.func,
};

export default CancelModal;
