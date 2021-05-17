import React, { useEffect, useState } from 'react'
import {
    Button,
    Image,
    Modal,
    Form,
    Col
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import profileImage from "../../image/profile.png"
import { Formik } from 'formik';
import axios from 'axios';
import { STORE, TABLES, MENUS, PRESIGNED_URL, STORE_UPDATE, getLocalData } from '../../constants/api'
import { COLOR_APP, URL_PHOTO_AW3, COLOR_APP_CANCEL } from '../../constants'
import { successAdd, errorAdd } from '../../helpers/sweetalert'

export default function StoreDetail() {
    const [isLoading, setIsLoading] = useState(false)
    const [dataStore, setStore] = useState()
    const [numBerTable, setnumBerTable] = useState(0)
    const [numBerMenus, setnumBerMenus] = useState(0)
    const [getTokken, setgetTokken] = useState()
    useEffect(() => {
        const fetchData = async () => {
            const _localData = await getLocalData()
            if (_localData) {
                setgetTokken(_localData)
            }
        }
        fetchData();
        getData()
    }, [])
    const getData = async (tokken) => {
        setIsLoading(true)
        await fetch(STORE + `/?id=6092b8c247b38de5af7275b2`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setStore(json));
        await fetch(TABLES, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setnumBerTable(json?.length));
        await fetch(MENUS, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setnumBerMenus(json?.length));
        setIsLoading(false)
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // upload photo
    const [namePhoto, setNamePhoto] = useState('')
    const [file, setFile] = useState()
    const [imageLoading, setImageLoading] = useState()
    const handleUpload = async (event) => {
        setImageLoading("")
        try {
            setFile(event.target.files[0]);
            let formData = new FormData();
            let fileData = event.target.files[0]
            const responseUrl = await axios({
                method: 'post',
                url: PRESIGNED_URL,
                data: {
                    type: event.target.files[0].type
                }
            })
            setNamePhoto(responseUrl.data)
            let afterUpload = await axios({
                method: "put",
                url: responseUrl.data.url,
                data: fileData,
                headers: {
                    "Content-Type": " file/*; image/*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers":
                        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                },
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setImageLoading(percentCompleted)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    // lung jak upload leo pic ja ma so u nee
    const ImageThumb = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name} style={{
            borderRadius: "50%",
            height: 200,
            width: 200,
        }} />;
    };
    const _updateStore = async (values) => {
        const resData = await axios({
            method: 'PUT',
            url: STORE_UPDATE + `/?id=${dataStore?._id}`,
            headers: getTokken,
            data: {
                storeName: values?.storeName,
                adminStore: values?.adminStore,
                whatsapp: values?.whatsapp,
                detail: values?.detail,
                dateClose: values?.dateClose,
                timeClose: values?.timeClose,
                phone: values?.phone,
                image: namePhoto?.params?.Key,
            },
        }).then(async function (response) {
            if (response) {
                successAdd("ອັບເດດຂໍ້ມູນສຳເລັດ")
                handleClose()
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }).catch(function (error) {
            errorAdd('ອັບເດດຂໍ້ມູນບໍ່ສຳເລັດ !')
        })
    }
    return (
        <div>
            <div className="row" style={{ padding: 40 }}>
                <div className="col-sm-10" style={{ fontWeight: "bold", fontSize: 18 }}>ລາຍລະອຽດ</div>
                <div className="col-sm-2">
                    <Button variant="outline-warnings" className="col-sm-8" style={{ color: "#606060", border: `solid 1px ${COLOR_APP}` }} onClick={handleShow}><FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: 10, }}
                    />ແກ້ໄຂ</Button>{' '}
                </div>
            </div>
            <div className="row" style={{ padding: 40 }}>
                <div className="col-sm-5 text-center">
                    {dataStore?.image ? (
                        <center>
                            <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="AeonIcon" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                            }} />
                        </center>
                    ) : (<center>
                        <Image src={profileImage} alt="AeonIcon" width="150" height="150" style={{
                            height: 200,
                            width: 200,
                            borderRadius: '50%',
                        }} />
                    </center>)}
                    <div style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}> {dataStore?.name ? dataStore?.name : "-"}</div>
                    <div style={{ padding: 5 }}>ເປີດບໍລິການ</div>
                    <div style={{ padding: 5 }}>{dataStore?.dateClose + "  " + dataStore?.timeClose}</div>
                </div>
                <div className="col-sm-7">
                    <div style={{ padding: 8, backgroundColor: COLOR_APP, fontWeight: "bold", color: "#FFFFFF" }}>ຂໍ້ມູນເຈົ້າຂອງຮ້ານ</div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ຊື່ແລະນາມສະກຸນ</div>
                        <div className="col-5">{dataStore?.adminStore ? dataStore?.adminStore : "-"}</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ທີ່ຢູ່ຮ້ານ</div>
                        <div className="col-5">{dataStore?.detail ? dataStore?.detail : "-"}</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">whatsapp</div>
                        <div className="col-5">{dataStore?.whatsapp ? dataStore?.whatsapp : "-"}</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ເບີໂທ</div>
                        <div className="col-5">{dataStore?.phone ? dataStore?.phone : "-"}</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div style={{ padding: 8, backgroundColor: COLOR_APP, fontWeight: "bold", color: "#FFFFFF" }}>ຂໍ້ມູນທົ່ວໄປ</div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ຕູບທັ້ງໝົດ</div>
                        <div className="col-5"> {numBerTable ? numBerTable : "-"} ຕູບ</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ເມນູທັ້ງໝົດ</div>
                        <div className="col-5">{numBerMenus ? numBerMenus : "-"} ເມນູ</div>
                    </div>
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>ແກ້ໄຂຂໍ້ມູນຮ້ານ</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        storeName: '',
                        adminStore: '',
                        whatsapp: '',
                        phone: '',
                        detail: '',
                        dateClose: '',
                        timeClose: '',
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.storeName) {
                            errors.storeName = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.adminStore) {
                            errors.adminStore = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.whatsapp) {
                            errors.whatsapp = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.detail) {
                            errors.detail = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.phone) {
                            errors.phone = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.dateClose) {
                            errors.dateClose = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        if (!values.timeClose) {
                            errors.timeClose = 'ກະລຸນາປ້ອນ Userid... !';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        _updateStore(values)

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
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <div className="col-sm-12 center" style={{ textAlign: "center" }}>
                                    <input type="file" id="file-upload" onChange={handleUpload} hidden />
                                    <label for="file-upload">
                                        <div style={{
                                            backgroundColor: "#E4E4E4E4",
                                            height: 200,
                                            width: 200,
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            display: "flex",
                                        }}>
                                            {file ? <ImageThumb image={file} /> : <div style={{
                                                display: "flex", height: 200,
                                                width: 200, justifyContent: "center", alignItems: "center"
                                            }}>
                                                <p style={{ color: "#fff", fontSize: 80, fontWeight: "bold" }}>+</p></div>}
                                        </div>
                                    </label>
                                    {/* progass */}
                                    {imageLoading ? <div class="progress" style={{ height: 20 }}>
                                        <div class="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                                    </div> : <div style={{ height: 20 }} />}
                                </div>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ຮ້ານ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="storeName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.storeName}
                                        placeholder="ຊື່ຮ້ານ..."
                                        style={{ border: errors.storeName && touched.storeName && errors.storeName ? "solid 1px red" : "" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ເຈົ້າຂອງຮ້ານ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="adminStore"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.adminStore}
                                        placeholder="ຊື່ເຈົ້າຂອງຮ້ານ..."
                                        style={{ border: errors.adminStore && touched.adminStore && errors.adminStore ? "solid 1px red" : "" }}

                                    />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຂໍ້ມູນທີ່ຢູ່</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="detail"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.detail}
                                        style={{ border: errors.detail && touched.detail && errors.detail ? "solid 1px red" : "" }}
                                        placeholder="ຂໍ້ມູນທີ່ຢູ່..." />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ເບີ whatsapp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="whatsapp"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.whatsapp}
                                        style={{ border: errors.whatsapp && touched.whatsapp && errors.whatsapp ? "solid 1px red" : "" }}
                                        placeholder="whatsapp..." />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ເບີໂທ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}
                                        style={{ border: errors.phone && touched.phone && errors.phone ? "solid 1px red" : "" }}
                                        placeholder="ເບີໂທ..." />
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>ເປີດບໍລິການ</Form.Label>
                                        <Form.Control type="text"
                                            name="dateClose"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.dateClose}
                                            style={{ border: errors.dateClose && touched.dateClose && errors.dateClose ? "solid 1px red" : "" }}
                                            placeholder="ວັນຈັນ - ວັນສຸກ" />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridPassword">
                                        <Form.Label>ເວລາ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="timeClose"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.timeClose}
                                            style={{ border: errors.timeClose && touched.timeClose && errors.timeClose ? "solid 1px red" : "" }}
                                            placeholder="9:00 AM - 9:00PM" />
                                    </Form.Group>
                                </Form.Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }} onClick={handleClose}>
                                    ຍົກເລີກ
          </Button>
                                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff" }} onClick={() => handleSubmit()}>ບັນທືກ</Button>
                            </Modal.Footer>
                        </form>
                    )}
                </Formik>
            </Modal>
        </div>
    )
}
