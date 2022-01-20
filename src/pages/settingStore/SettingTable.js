import React, { useState, useEffect } from 'react'
import useReactRouter from "use-react-router";
import { COLOR_APP } from '../../constants'
import { useStore } from "../../store";
import axios from 'axios';
import { END_POINT } from '../../constants'
import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
    successAdd,
    errorAdd,
    warningAlert
} from "../../helpers/sweetalert"
import { getHeaders } from '../../services/auth';

export default function SettingTable() {
    const { history, location, match } = useReactRouter();
    const {
        tableListCheck,
        setTableListCheck,
        getTableDataStoreList,
    } = useStore();
    useEffect(() => {
        getTableDataStoreList();
    }, [])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [tableNumber, setTableNumber] = useState()
    const _createTable = async () => {
        let header = await getHeaders();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': header.authorization
        }
        try {
            if (!tableNumber) {
                warningAlert("ກະລຸນາປ້ອນເລກໂຕະ")
                return
            }
            const createTable = await axios({
                method: 'post',
                url: END_POINT + `/v3/table/create`,
                data: {
                    "name": tableNumber,
                    "storeId": match?.params?.id
                },
                headers: headers
            })
            handleClose();
            if (createTable?.data?.message === "INVALID_NAME") {
                warningAlert("ໂຕະນີ້ໄດ້ມີແລ້ວ")
            } else {
                setTableListCheck([...tableListCheck, createTable?.data])
                successAdd("ການເພີ່ມໂຕະສຳເລັດ")
            }
        } catch (err) {
            errorAdd("ການເພີ່ມໂຕະບໍ່ສຳເລັດ")
        }
    }
    const _changeStatusTable = async (data) => {
        let header = await getHeaders();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': header.authorization
        }
        if (data?.status === true) {
            let res = await axios({
                method: 'PUT',
                url: END_POINT + `/v3/code/update/`,
                data: {
                    id: data._id,
                    data: {
                        "status": "false"
                    }
                },
                  headers: headers
            })
            setTableListCheck(res?.data)
        } else {
            let res = await axios({
                method: 'PUT',
                url: END_POINT + `/v3/code/update/`,
                data: {
                    id: data._id,
                    data: {
                        "status": "true"
                    }
                },
                headers: headers
            })
            setTableListCheck(res?.data)
        }

    }
    // ======> delete ====> delete
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const [dateDelete, setdateDelete] = useState('')
    const handleShow3 = (item) => {
        setdateDelete(item)
        setShow3(true)
    };
    const _confirmeDelete = async () => {
        let header = await getHeaders();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': header.authorization
        }
        if (dateDelete?.isOpened === true) {
            handleClose3()
            warningAlert("ລົບຂໍ້ມູນບໍ່ສຳເລັດເພາະກຳລັງໃຊ້ງານ");
            return;
        }
        const resData = await axios({
            method: 'DELETE',
            url: END_POINT + `/v3/code/delete/` + dateDelete?._id,
            headers: headers
        })
        if (resData?.data) {
            handleClose3()
            setTableListCheck(resData?.data)
            successAdd("ລົບຂໍ້ມູນສຳເລັດ")
        }
    }
    console.log("tableListCheck==>", tableListCheck);
    return (
        <div style={{ padding: 15 }} className="col-sm-12">
            <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
                <div className="col-sm-12 text-right">
                    <button className="col-sm-2" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0, padding: 10 }} onClick={handleShow}>ເພີ່ມໂຕະ</button>{' '}
                </div>
                <div style={{ height: 20 }}></div>
                <div>
                    <div className="col-sm-12">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ເລກໂຕະ</th>
                                    <th scope="col">ລະຫັດໂຕະ</th>
                                    <th scope="col">ການເປີດ/ປິດ</th>
                                    <th scope="col">ມີແຂກເຂົ້າແລ້ວ</th>
                                    <th scope="col">ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableListCheck?.map((table, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{table?.tableName}</td>
                                            <td>{table?.code}</td>
                                            <td><label className="switch">
                                                <input type="checkbox" defaultChecked={table?.status === true ? true : false} onClick={(e) => _changeStatusTable(table)} />
                                                <span className="slider round"></span>
                                            </label></td>
                                            <td style={{ color: table?.isOpened === true ? "green" : "red" }}>{table?.isOpened === true ? "ມີແລ້ວ" : "ຍັງບໍ່ມີແລ້ວ"}</td>
                                            <td><FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: 20, color: "red" }} onClick={() => handleShow3(table)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ເພີ່ມໂຕະ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>ເລກໂຕະ</Form.Label>
                        <div style={{ height: 10 }}></div>
                        <Form.Control type="email" placeholder="ກະລຸນາປ້ອນເລກໂຕະ" onChange={(e) => setTableNumber(e?.target?.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ຍົກເລີກ
                    </Button>
                    <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => _createTable()}>
                        ບັກທືກ
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* ===== delete ===== */}
            <Modal show={show3} onHide={handleClose3}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "center" }}>
                        <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ? </div>
                        <div style={{ color: "red" }}>{dateDelete?.code}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose3}>
                        ຍົກເລີກ
                    </Button>
                    <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => _confirmeDelete()}>
                        ຢືນຢັນການລົບ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
