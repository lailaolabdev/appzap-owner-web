import React from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const modalUpdate =({shows,hide})=>{

    return(
        <div>
             <Modal show={shows} onHide={hide} centered>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>ທ່ານຕອ້ງການອັບເດດສະຖານະ ເມນູນີ້?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hide}>
              ຍົກເລີກ
            </Button>
            <Button variant="primary" onClick={shows}>
              ຢືນຢັນ
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    )
}

export default modalUpdate