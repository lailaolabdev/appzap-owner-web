import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Select from "react-select";
import { Form, Button } from "react-bootstrap";
import { ALL_STATUS } from "../../../constants";

const UpdateOrderModal = (props) => {
  const { handleUpdate } = props;
  const [selectedStatus, setSelectedStatus] = useState("WAITING");
  const _onSelectedStatus = async (selected) => {
    setSelectedStatus(selected.value);
  };
  const _handleUpdate = async () => {
    await handleUpdate(selectedStatus);
  };
  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      centered
      arialabelledby="contained-modal-title-vcenter"
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>ເເກ້ໄຂອໍເດີ້</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>ເລືອກສະຖານະ:</p>
            <div>
              <Select
                options={ALL_STATUS}
                onChange={_onSelectedStatus}
                autoFocus={true}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.hide}>ຍົກເລີກ</Button>
          <Button style={{backgroundColor: "#FB6E3B", border: "none"}} onClick={_handleUpdate}>ຕົກລົງ</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
UpdateOrderModal.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.string,
};

export default UpdateOrderModal;
