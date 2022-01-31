import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import useReactRouter from "use-react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Modal,
  Form,
  Nav,
  Image
} from "react-bootstrap";
import { BODY, COLOR_APP, URL_PHOTO_AW3 } from '../../constants'
import { MENUS, PRESIGNED_URL, getLocalData, END_POINT_SEVER } from '../../constants/api'
import { moneyCurrency, STATUS_MENU } from '../../helpers'
import { successAdd, errorAdd } from '../../helpers/sweetalert'
import profileImage from "../../image/profile.png"
import { getHeaders } from '../../services/auth';

export default function MenuList() {
  const { history, match } = useReactRouter()

  const [genderData, setGenderData] = useState("FEMALE");
  const [isOpened, setIsOpened] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getIdMenu, setGetIdMenu] = useState()
  const [qtyMenu, setQtyMenu] = useState(0)
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = (id) => {
    setGetIdMenu(id)
    setShow4(true);
  }

  const [getTokken, setgetTokken] = useState()

  // =====> getCategory
  const [Categorys, setCategorys] = useState()
  const [Menus, setMenus] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData()
      if (_localData) {
        setgetTokken(_localData)
        getcategory(_localData?.DATA?.storeId)
        getMenu(_localData?.DATA?.storeId)
      }
    }
    fetchData();
  }, [])
  const getcategory = async (id) => {
    await fetch(END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setCategorys(json));
  }
  const getMenu = async (id) => {
    await fetch(MENUS + `/?isOpened=true&storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setMenus(json));
  }
  const _menuList = () => {
    history.push(`/settingStore/menu/limit/40/page/1/${match?.params?.id}`)
  }
  const _category = () => {
    history.push(`/settingStore/menu/category/limit/40/page/1/${match?.params?.id}`)
  }
  // upload photo
  const [namePhoto, setNamePhoto] = useState('')
  const [file, setFile] = useState()
  const [imageLoading, setImageLoading] = useState()
  const handleUpload = async (event) => {
    setImageLoading("")
    try {
      setFile(event.target.files[0]);
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
      borderRadius: "10%",
      height: 200,
      width: 200,
    }} />;
  };
  // ======> create menu
  const _createMenu = async (values) => {
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    try {
      const resData = await axios({
        method: 'POST',
        url: END_POINT_SEVER + '/v3/menu/create',
        data: {
          name: values?.name,
          quantity: values?.quantity,
          categoryId: values?.categoryId,
          price: values?.price,
          detail: values?.detail,
          unit: values?.unit,
          isOpened: isOpened,
          images: [namePhoto?.params?.Key],
          storeId: getTokken?.DATA?.storeId
        },
        headers: headers
      })
      if (resData?.data) {
        setMenus(resData?.data)
        handleClose()
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ")
      }
    } catch (err) {
      errorAdd('ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !')
    }
  }
  // detele menu
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState('')
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id })
    setShow3(true)
  };
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }
      const resData = await axios({
        method: 'DELETE',
        url: END_POINT_SEVER + `/v3/menu/delete/${dateDelete?.id}`,
        headers: headers
      })
      if (resData?.data) {
        setMenus(resData?.data)
        handleClose3()
        successAdd("ການລົບຂໍ້ມູນສຳເລັດ")
      }
    } catch (err) {
      errorAdd('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ !')
    }
  }
  // =======>
  // update 
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState('')
  const handleShow2 = async (item) => {
    setdataUpdate(item)
    setShow2(true)
  };
  const _updateCategory = async (values) => {
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    const resData = await axios({
      method: 'PUT',
      url: END_POINT_SEVER + `/v3/menu/update`,
      data: {
        id: dataUpdate?._id,
        data: {
          name: values?.name,
          quantity: values?.quantity,
          categoryId: values?.categoryId,
          price: values?.price,
          detail: values?.detail,
          unit: values?.unit,
          isOpened: isOpened,
          images: [namePhoto?.params?.Key ?? dataUpdate?.images[0]],
        }
      },
      headers: headers
    })
    if (resData?.data) {
      setMenus(resData?.data)
      handleClose2()
      successAdd("ການລົບຂໍ້ມູນສຳເລັດ")
    }
  }
  const _updateQtyCategory = async (values) => {
    const resData = await axios({
      method: 'PUT',
      url: END_POINT_SEVER + "/addQty_menus",
      data: {
        id: getIdMenu,
        qty: qtyMenu,
      },
    }).then(async function (response) {
      handleClose4()
      successAdd("ການເພີ່ມຈຳນວນສຳເລັດ")
      handleClose()
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }).catch(function (error) {
      errorAdd('ການເພີ່ມຈຳນວນບໍ່ສຳເລັດ !')
    })
  }
  return (
    <div style={BODY}>
      <div>
        <Nav variant="tabs" defaultActiveKey="/settingStore/menu">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>ເມນູອາຫານ</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/category" onClick={() => _category()}>ປະເພດອາຫານ</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div className="col-sm-12 text-right">
          <Button className="col-sm-2" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={handleShow}>ເພີ່ມເມນູອາຫານ</Button>{' '}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຮູບພາບ</th>
                  <th scope="col">ຊື່ປະເພດອາຫານ</th>
                  <th scope="col">ຊື່ອາຫານ</th>
                  <th scope="col">ລາຄາ</th>
                  <th scope="col">ສະຖານະ</th>
                  <th scope="col">ຈຳນວນ</th>
                  <th scope="col">ໝາຍເຫດ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {Menus?.map((data, index) => {
                  return (
                    <tr >
                      <td>{index + 1}</td>
                      <td>
                        {data?.images.length > 0 ? (
                          <center>
                            <Image src={URL_PHOTO_AW3 + data?.images[0]} width="150" height="150" style={{
                              height: 50,
                              width: 50,
                              borderRadius: '50%',
                            }} />
                          </center>
                        ) : (<center>
                          <Image src={profileImage} width="150" height="150" style={{
                            height: 50,
                            width: 50,
                            borderRadius: '50%',
                          }} />
                        </center>)}
                      </td>
                      <td>{data?.categoryId?.name}</td>
                      <td>{data?.name}</td>
                      <td>{moneyCurrency(data?.price)}</td>
                      <td style={{ color: data?.isOpened ? "green" : "red" }}>{STATUS_MENU(data?.isOpened)}</td>
                      <td style={{ color: data?.quantity < 10 ? "red" : "green" }}>{data?.quantity}</td>
                      <td>{data?.detail ? data?.detail : " - "}</td>
                      <td>
                        <FontAwesomeIcon icon={faEdit} onClick={() => handleShow2(data)} style={{ color: COLOR_APP, cursor: "pointer" }} />
                        <FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: 20, color: "red", cursor: "pointer" }} onClick={() => handleShow3(data?._id, data?.name)} />
                        {/* <FontAwesomeIcon icon={faPlus} style={{ marginLeft: 20, color: "red", cursor: "pointer" }} onClick={() => handleShow4(data?._id)} /> */}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* add menu */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: "",
            quantity: "",
            categoryId: "",
            price: "",
            detail: "",
            unit: "",
          }}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = 'ກະລຸນາປ້ອນຊື່ອາຫານ...';
            }
            if (!values.price) {
              errors.price = 'ກະລຸນາປ້ອນລາຄາ...';
            }
            if (!values.quantity) {
              errors.quantity = 'ກະລຸນາປ້ອນ...';
            }
            if (!values.categoryId) {
              errors.categoryId = 'ກະລຸນາປ້ອນ...';
            }
            if (!values.unit) {
              errors.unit = 'ກະລຸນາປ້ອນ...';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createMenu(values)
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
                      borderRadius: "10%",
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
                  {imageLoading ? <div className="progress" style={{ height: 20 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                  </div> : <div style={{ height: 20 }} />}
                </div>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control as="select"
                    name="categoryId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryId}
                    style={{ border: errors.categoryId && touched.categoryId && errors.categoryId ? "solid 1px red" : "" }}
                  >
                    <option selected={true} disabled={true} value="">ເລືອກປະເພດອາຫານ</option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
                <div class="form-row">
                  <div class="col-3">
                    <div class="form-group">
                      <label>ສະຖານະເປີດ/ປິດ</label>
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="form-row">
                      <div class="col">
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="open"
                            name="isOpened"
                            defaultChecked
                            class="custom-control-input"
                            onChange={() => setIsOpened(true)}
                          />
                          <label class="custom-control-label" for="open">
                            ເປີດ
                          </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="off"
                            name="isOpened"
                            class="custom-control-input"
                            onChange={() => setIsOpened(false)}
                          />
                          <label class="custom-control-label" for="off">
                            ປິດ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ອາຫານ..."
                    style={{ border: errors.name && touched.name && errors.name ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ລາຄາ</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.price && touched.price && errors.price ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.quantity}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.quantity && touched.quantity && errors.quantity ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.unit && touched.unit && errors.unit ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="detail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.detail}
                    placeholder="ໝາຍເຫດ..."
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => handleSubmit()}>ບັນທືກ</Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      {/* delete menu */}
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ? </div>
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
      {/* update menu */}
      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ອັບເດດເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: dataUpdate?.name,
            quantity: dataUpdate?.quantity,
            categoryId: dataUpdate?.categoryId?._id,
            price: dataUpdate?.price,
            detail: dataUpdate?.detail,
            unit: dataUpdate?.unit,
          }}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = 'ກະລຸນາປ້ອນຊື່ອາຫານ...';
            }
            if (!values.price) {
              errors.price = 'ກະລຸນາປ້ອນລາຄາ...';
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
                      borderRadius: "10%",
                      cursor: "pointer",
                      display: "flex",
                    }}>
                      {file ? <ImageThumb image={file} /> :
                        <center>
                          <Image src={URL_PHOTO_AW3 + dataUpdate?.images[0]} alt="" width="150" height="150" style={{
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
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control as="select"
                    name="categoryId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryId}
                  >
                    <option selected={true} disabled={true}>ເລືອກປະເພດອາຫານ</option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
                <div class="form-row">
                  <div class="col-3">
                    <div class="form-group">
                      <label>ສະຖານະເປີດ/ປິດ</label>
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="form-row">
                      <div class="col">
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="open"
                            name="isOpened"
                            defaultChecked={dataUpdate?.isOpened ? true : false}
                            class="custom-control-input"
                            onChange={() => setIsOpened(true)}
                          />
                          <label class="custom-control-label" for="open">
                            ເປີດ
                          </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="off"
                            name="isOpened"
                            defaultChecked={!dataUpdate?.isOpened ? true : false}
                            class="custom-control-input"
                            onChange={() => setIsOpened(false)}
                          />
                          <label class="custom-control-label" for="off">
                            ປິດ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ສະຖານະ</Form.Label>
                  <Form.Control as="select"
                    name="status"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.status}
                  >
                    <option selected={true} disabled={true}>ເລືອກສະຖານະ</option>
                    <option value="HAS">ເປີດ</option>
                    <option value="DONOT">ປິດ</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ອາຫານ..."
                    style={{ border: errors.name && touched.name && errors.name ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ລາຄາ</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.price && touched.price && errors.price ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.quantity}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.quantity && touched.quantity && errors.quantity ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                    placeholder="ລາຄາ..."
                    style={{ border: errors.unit && touched.unit && errors.unit ? "solid 1px red" : "" }} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="detail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.detail}
                    placeholder="ໝາຍເຫດ..."
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose2}>
                  ຍົກເລີກ
                </Button>
                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => handleSubmit()}>ບັນທືກ</Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      {/* add qty menu */}
      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>ປ້ອນຈຳນວນສີນຄ້າ </div>
            <div style={{ height: 20 }}></div>
            <input type="number" className="form-control" onChange={(e) => setQtyMenu(e?.target?.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose4}>
            ຍົກເລີກ
          </Button>
          <Button type="button" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }} onClick={() => _updateQtyCategory()}>
            ຢືນຢັນການເພີ່ມ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
