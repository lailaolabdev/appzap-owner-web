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
        <Modal.Body>ທ່ານຕອ້ງການຍົກເລີກ ເມນູນີ້?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.hide}>
            ກັບຄືນ
          </Button>
          <Button variant="danger" onClick={props.handleUpdate}>
            ຍົກເລີກ
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
