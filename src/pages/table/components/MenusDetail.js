import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


const MenusDetail = () => {
    return (
        < Modal
            // show={deleteStatus}
            // onHide={handleClose}
            centered
            arialabelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>ຢືນຢັນການລຶບ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ທຸກຂໍ້ມູນທີ່ກ່ຽວຂ້ອງກັບ{' '}
                <span style={{ color: 'red' }}>
                    {/* {data.serviceCategory.name ? data.serviceCategory.name : ''} */}
                </span>{' '}
						ຈະຖືກລຶບທັງຫມົດ
					</Modal.Body>
            <Modal.Footer>
                <Button
                // variant={BUTTON_OUTLINE_DARK}
                // style={{ width: MODAL_BUTTON_SIZE }}
                // onClick={handleClose}
                >
                    ຍົກເລີກ
						</Button>
                <Button
                // variant={BUTTON_DANGER}
                // style={{ width: MODAL_BUTTON_SIZE }}
                // onClick={handleFinish}
                >
                    ຕົກລົງ
						</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default MenusDetail;

