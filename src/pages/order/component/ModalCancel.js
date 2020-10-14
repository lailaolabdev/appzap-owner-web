import React from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const modalcancel =({show,hide})=>{

    return(
        <div>
             <Modal show={show} onHide={hide} centered>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>ທ່ານຕອ້ງການຍົກເລີກ ເມນູນີ້?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hide}>
              ກັບຄືນ
            </Button>
            <Button variant="danger" onClick={show}>
              ຍົກເລີກເມນູ
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    )
}

export default modalcancel