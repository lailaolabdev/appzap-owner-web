import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import useReactRouter from "use-react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
    Button,
    Modal,
    Form,
    Nav
} from "react-bootstrap";
import { END_POINT, BODY, COLOR_APP, URL_PHOTO_AW3 } from '../../constants'
import { CATEGORY } from '../../constants/api'
import { successAdd, errorAdd } from '../../helpers/sweetalert'
export default function Categorylist() {
    const { history, location, match } = useReactRouter()
    // create
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // modal delete
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const [dateDelete, setdateDelete] = useState('')
    const handleShow3 = (id, name) => {
        setdateDelete({ name, id })
        setShow3(true)
    };
    const _confirmeDelete = async () => {
        const resData = await axios({
            method: 'DELETE',
            url: CATEGORY + `/${dateDelete?.id}`,
        }).then(async function (response) {
            successAdd("ລົບຂໍ້ມູນສຳເລັດ")
            handleClose()
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }).catch(function (error) {
            errorAdd('ລົບຂໍ້ມູນບໍ່ສຳເລັດ !')
        })
    }
    // update
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const [dataUpdate, setdataUpdate] = useState('')
    const handleShow2 = async (item) => {
        await fetch(CATEGORY + `/${item}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setdataUpdate(json));
        setShow2(true)
    };
    // =======> 
    const _createCategory = async (values) => {
        const resData = await axios({
            method: 'POST',
            url: CATEGORY,
            data: {
                name: values?.categoryName,
                note: values?.note,
            },
        }).then(async function (response) {
            successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ")
            handleClose()
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }).catch(function (error) {
            errorAdd('ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !')
        })

    }
    const _updateCategory = async (values) => {
        const resData = await axios({
            method: 'PUT',
            url: CATEGORY + `/${dataUpdate?._id}`,
            data: {
                name: values?.categoryName,
                note: values?.note,
            },
        }).then(async function (response) {
            successAdd("ອັບເດດຂໍ້ມູນສຳເລັດ")
            handleClose()
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }).catch(function (error) {
            errorAdd('ອັບເດດຂໍ້ມູນບໍ່ສຳເລັດ !')
        })

    }
    const [isLoading, setIsLoading] = useState(false)
    const [Categorys, setCategorys] = useState()

    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        setIsLoading(true)
        await fetch(CATEGORY, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setCategorys(json));
        setIsLoading(false)
    }
    const _menuList = () => {
        history.push('/menu/limit/40/page/1')
    }
    const _category = () => {
        history.push('/category/limit/40/page/1')
    }
    return (
        <div style={BODY}>
            <div>
                <Nav variant="tabs" defaultActiveKey="category">
                    <Nav.Item>
                        <Nav.Link eventKey="category" onClick={() => _category()}>ປະເພດອາຫານ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1" onClick={() => _menuList()}>ເມນູອາຫານ</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
                <div className="col-sm-12 text-right">
                    <Button className="col-sm-2" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={handleShow}>ເພີ່ມປະເພດອາຫານ</Button>{' '}
                </div>
                <div style={{ height: 20 }}></div>
                <div>
                    <div className="col-sm-12">
                        <table class="table table-hover">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ຊື່ປະເພດອາຫານ</th>
                                    <th scope="col">ໝາຍເຫດ</th>
                                    <th scope="col">ຈັດການຂໍ້ມູນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Categorys?.map((data, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{data?.name}</td>
                                            <td>{data?.note}</td>
                                            <td><FontAwesomeIcon icon={faEdit} onClick={() => handleShow2(data?._id)} style={{ color: COLOR_APP }} /><FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: 20, color: "red" }} onClick={() => handleShow3(data?._id, data?.name)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Formik
                    initialValues={{
                        categoryName: '',
                        note: '',
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.categoryName) {
                            errors.categoryName = 'ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _createCategory(values)
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>ເພີ່ມປະເພດອາຫານ</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ປະເພດອາຫານ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="categoryName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.categoryName}
                                        placeholder="ຊື່ປະເພດອາຫານ..." />
                                </Form.Group>
                                <div style={{ color: "red" }}>
                                    {errors.categoryName && touched.categoryName && errors.categoryName}
                                </div>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ໝາຍເຫດ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="note"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.note}
                                        placeholder="ໝາຍເຫດ..." />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose}>
                                    ຍົກເລີກ
                                </Button>
                                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => handleSubmit()}>
                                    ບັນທືກ
                                </Button>
                            </Modal.Footer>
                        </form>
                    )}
                </Formik>
            </Modal>
            <Modal show={show2} onHide={handleClose2}>
                <Formik
                    initialValues={{
                        categoryName: dataUpdate?.name,
                        note: dataUpdate?.note,
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.categoryName) {
                            errors.categoryName = 'ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _updateCategory(values)
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>ເພີ່ມປະເພດອາຫານ</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ປະເພດອາຫານ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="categoryName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.categoryName}
                                        placeholder="ຊື່ປະເພດອາຫານ..." />
                                </Form.Group>
                                <div style={{ color: "red" }}>
                                    {errors.categoryName && touched.categoryName && errors.categoryName}
                                </div>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ໝາຍເຫດ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="note"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.note}
                                        placeholder="ໝາຍເຫດ..." />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose2}>
                                    ຍົກເລີກ
                                </Button>
                                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => handleSubmit()}>
                                    ບັນທືກ
                                </Button>
                            </Modal.Footer>
                        </form>
                    )}
                </Formik>
            </Modal>
            <Modal show={show3} onHide={handleClose3}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "center" }}>
                        <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ </div>
                        <div style={{ color: "red" }}>{dateDelete?.name}</div>
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
        </div >
    )
}
