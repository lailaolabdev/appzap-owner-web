import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
export default function PopUpAddMenus({
    open,
    text,
    onClose,
    onSubmit,
}) {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    return (
        <div>
            <Modal show={open} size="xl">
                <Modal.Header>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>ເພີ່ມເມນູຈຳນວນຫຼາຍ</div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md="12">
                            <div style={{marginBottom: 10}}>
                            <label>ເລືອກປະເພດ</label>
                            <select className="form-control" >
                                <option value="All">ທັງໝົດ</option>
                            </select>
                            </div>
                        </Col>
                        <Col md="12">
                            <table className="table table-hover" style={{ minWidth: 700 }}>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">ຮູບພາບ</th>
                                        <th scope="col">ຊື່ອາຫານ</th>
                                        <th scope="col">ລາຄາ</th>
                                    </tr>
                                </thead>

                            </table>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
                        ຍົກເລີກ
                    </Button>
                    <Button
                        disabled={buttonDisabled}
                        style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
                        onClick={() => {
                            setButtonDisabled(true);
                            onSubmit().then(() => setButtonDisabled(false));
                        }}
                    >
                        ຢືນຢັນສ້າງເມນູ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
