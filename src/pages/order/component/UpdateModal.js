import React from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UpdateModal = (props) => {
  return (
    <div>
      <Modal show={props.show} onHide={props.hide} centered>
        <Modal.Header closeButton>
          <Modal.Title>ອັບເດັດສະຖານະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>ທ່ານຕ້ອງການອັບເດດ ເມນູນີ້?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.hide}>
            ກັບຄືນ
          </Button>
          <Button style={{backgroundColor: "#FB6E3B", border: "none"}} onClick={props.handleUpdate}>
            ຕົກລົງ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
UpdateModal.propTypes = {
  hide: PropTypes.func,
  show: PropTypes.bool,
  handleUpdate: PropTypes.func,
};

export default UpdateModal;
