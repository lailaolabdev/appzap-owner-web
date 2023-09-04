import React, {useState} from 'react'
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
export default function PopUpCaution({
    open,
    onClose,
    setShowAddMenus
}) {
    return (
        <div>
            <Modal show={open}>
                <Modal.Header>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>ຂໍ້ຄວນລະວັງ</div>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "center", minHeight: "20vh", display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10 }}>
                        <div style={{ fontSize: "20px", fontWeight: 600 }}>ຟັງຊັ້ນເພີ່ມເມນູນຳນວນຫຼາຍແມ່ນໃຊ້ສະເພາະກໍລະນີຍາກເພີ່ມເມນູເຂົ້າຮ້ານຕາມປະເພດເມນູທີລະບົບກຳນົດໄວ້ເປັນເມນູພື້ນຖານເທົ່ານັ້ນ.</div> 
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button  variant="secondary" onClick={onClose}>
                        ຍົກເລີກ
                    </Button>
                    <Button
                        style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
                        onClick={() => {
                            setShowAddMenus(true)
                            onClose()
                        }}
                    >
                        ຢືນຢັນ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
