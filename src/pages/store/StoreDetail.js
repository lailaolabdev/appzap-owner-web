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
import { END_POINT } from '../../constants'
import { COLOR_APP, URL_PHOTO_AW3, COLOR_APP_CANCEL } from '../../constants'
import moment from "moment";
import {
    successAdd,
    errorAdd,
    warningAlert
} from "../../helpers/sweetalert"
import useReactRouter from "use-react-router"
import "./index.css";

export default function StoreDetail() {
    const { history, location, match } = useReactRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [dataStore, setStore] = useState()
    const [dataSwitch, setDataSwitch] = useState()
    const [numBerTable, setnumBerTable] = useState(0)
    const [numBerMenus, setnumBerMenus] = useState(0)
    const [getTokken, setgetTokken] = useState()
    useEffect(() => {
        const fetchData = async () => {
            const _localData = await getLocalData()
            if (_localData) {
                setgetTokken(_localData)
                getData(_localData?.DATA?.storeId)
            }
        }
        fetchData();
    }, [])
    const getData = async (storeId) => {
        setIsLoading(true)
        await fetch(STORE + `/?id=${match?.params?.id}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => {
                setStore(json)
                setDataSwitch(json?.isOpen)
            });

        await fetch(TABLES + `/?storeId=${storeId}&&`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setnumBerTable(json?.length));

        await fetch(MENUS + `/?storeId=${storeId}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setnumBerMenus(json?.length));

        setIsLoading(false)
    }
    console.log("dataStore===>", dataStore)
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
                    name: event.target.files[0].type
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
            url: STORE_UPDATE,
            headers: getTokken?.TOKEN,
            data: {
                id: dataStore?._id,
                data: {
                    storeName: values?.storeName,
                    adminName: values?.adminName,
                    whatsapp: values?.whatsapp,
                    detail: values?.detail,
                    note: values?.note,
                    // dateClose: values?.dateClose,
                    // closeTime: values?.closeTime,
                    phone: values?.phone,
                    image: namePhoto?.params?.Key,
                }
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
    const _updateIsOpenStore = async (data) => {
        const res = await axios({
            method: 'PUT',
            url: END_POINT + `/store_update?id=` + match?.params?.id,
            headers: getTokken?.TOKEN,
            data: {
                "isOpen": data?.isOpen === true ? false : true
            },
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
                            <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="" width="150" height="150" style={{
                                height: 200,
                                width: 200,
                                borderRadius: '50%',
                            }} />
                        </center>
                    ) : (<center>
                        <Image src={profileImage} alt="" width="150" height="150" style={{
                            height: 200,
                            width: 200,
                            borderRadius: '50%',
                        }} />
                    </center>)}
                    <div style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}> {dataStore?.name ? dataStore?.name : "-"}</div>
                    <div style={{ padding: 5 }}>ເປີດບໍລິການ</div>
                    <div style={{ padding: 5 }}>{dataStore?.note}</div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked={dataSwitch} onClick={() => _updateIsOpenStore(dataStore)} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="col-sm-7">
                    <div style={{ padding: 8, backgroundColor: COLOR_APP, fontWeight: "bold", color: "#FFFFFF" }}>ຂໍ້ມູນເຈົ້າຂອງຮ້ານ</div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ຊື່ແລະນາມສະກຸນ</div>
                        <div className="col-5">{dataStore?.adminName ? dataStore?.adminName : "-"}</div>
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
                        <div className="col-5">ໂຕະທັງໝົດ</div>
                        <div className="col-5"> {numBerTable} ໂຕະ</div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div className="row">
                        <div className="col-5">ເມນູທັງໝົດ</div>
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
                        storeName: dataStore?.name,
                        adminName: dataStore?.adminName,
                        whatsapp: dataStore?.whatsapp,
                        phone: dataStore?.phone,
                        detail: dataStore?.detail,
                        note: dataStore?.note,
                        // dateClose: dataStore?.dateClose,
                        // closeTime: dataStore?.closeTime,
                    }}
                    validate={values => {
                        const errors = {};
                        if (!values.storeName) {
                            errors.storeName = 'ກະລຸນາປ້ອນ !';
                        }
                        if (!values.adminName) {
                            errors.adminName = 'ກະລຸນາປ້ອນ !';
                        }
                        if (!values.whatsapp) {
                            errors.whatsapp = 'ກະລຸນາປ້ອນ !';
                        }
                        if (!values.detail) {
                            errors.detail = 'ກະລຸນາປ້ອນ !';
                        }
                        if (!values.phone) {
                            errors.phone = 'ກະລຸນາປ້ອນ !';
                        }
                        // if (!values.dateClose) {
                        //     errors.dateClose = 'ກະລຸນາປ້ອນ !';
                        // }
                        // if (!values.closeTime) {
                        //     errors.closeTime = 'ກະລຸນາປ້ອນ !';
                        // }
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
                                            {file ? <ImageThumb image={file} /> :
                                                <center>
                                                    <Image src={URL_PHOTO_AW3 + dataStore?.image} alt="" width="150" height="150" style={{
                                                        height: 200,
                                                        width: 200,
                                                        borderRadius: '10%',
                                                    }} />
                                                </center>
                                            }
                                        </div>
                                    </label>
                                    {/* progass */}
                                    {imageLoading ? <div className="progress" style={{ height: 20 }}>
                                        <div className="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
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
                                        name="adminName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.adminName}
                                        placeholder="ຊື່ເຈົ້າຂອງຮ້ານ..."
                                        style={{ border: errors.adminName && touched.adminName && errors.adminName ? "solid 1px red" : "" }}
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
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ລາຍລະອຽດ</Form.Label>
                                </Form.Group>
                                <textarea
                                    id="note"
                                    name="note"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.note}
                                    placeholder="ຕົວຢາງເປີດບໍລິການ ວັນຈັນ - ວັນທິດ ເວລາ 9:00 - 9:30..."
                                    rows="4" cols="50">
                                </textarea>
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
