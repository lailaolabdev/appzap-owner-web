import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import useReactRouter from "use-react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Modal,
  Form,
  Nav,
  Image
} from "react-bootstrap";
import { END_POINT, BODY, COLOR_APP, URL_PHOTO_AW3 } from '../../constants'
import { CATEGORY, MENUS, PRESIGNED_URL, getLocalData } from '../../constants/api'
import { moneyCurrency, STATUS_MENU } from '../../helpers'
import { successAdd, errorAdd } from '../../helpers/sweetalert'
import profileImage from "../../image/profile.png"

export default function MenuList() {
  const { history, match } = useReactRouter()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    await fetch(CATEGORY + `/?storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setCategorys(json));
  }
  const getMenu = async (id) => {
    await fetch(MENUS + `/?storeId=${id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setMenus(json));
  }
  const _menuList = () => {
    history.push(`/menu/limit/40/page/1/${match?.params?.id}`)
  }
  const _category = () => {
    history.push(`/menu/category/limit/40/page/1/${match?.params?.id}`)
  }
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
      borderRadius: "10%",
      height: 200,
      width: 200,
    }} />;
  };
  // ======> create menu
  const _createMenu = async (values) => {
    const resData = await axios({
      method: 'POST',
      url: MENUS,
      data: {
        storeId: getTokken?.DATA?.storeId,
        name: values?.menuName,
        price: values?.price,
        detail: values?.detail,
        status: values?.status,
        category: values?.category,
        image: namePhoto?.params?.Key,
      },
    }).then(async function (response) {
      if (response?.status === 200) {
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ")
        handleClose()
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }).catch(function (error) {
      errorAdd('ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !')
    })
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
    const resData = await axios({
      method: 'DELETE',
      url: MENUS + `/${dateDelete?.id}`,
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
  // =======>
  // update 
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState('')
  const handleShow2 = async (item) => {
    await fetch(MENUS + `/${item}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setdataUpdate(json));
    setShow2(true)
  };
  const _updateCategory = async (values) => {
    const resData = await axios({
      method: 'PUT',
      url: MENUS + `/${dataUpdate?._id}`,
      data: {
        storeId: getTokken?.DATA?.storeId,
        name: values?.menuName,
        price: values?.price,
        detail: values?.detail,
        status: values?.status,
        category: values?.category,
        image: namePhoto?.params?.Key,
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
  return (
    <div style={BODY}>
      <div>
        <Nav variant="tabs" defaultActiveKey="menu">
          <Nav.Item>
            <Nav.Link eventKey="menu" onClick={() => _menuList()}>ເມນູອາຫານ</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="category" onClick={() => _category()}>ປະເພດອາຫານ</Nav.Link>
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
            <table class="table table-hover">
              <thead class="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຮູບພາບ</th>
                  <th scope="col">ຊື່ປະເພດອາຫານ</th>
                  <th scope="col">ຊື່ອາຫານ</th>
                  <th scope="col">ລາຄາ</th>
                  <th scope="col">ສະຖານະ</th>
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
                        {data?.image ? (
                          <center>
                            <Image src={URL_PHOTO_AW3 + data?.image} width="150" height="150" style={{
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
                      <td>{data?.category?.name}</td>
                      <td>{data?.name}</td>
                      <td>{moneyCurrency(data?.price)}</td>
                      <td style={{ color: STATUS_MENU(data?.status) === "ປິດ" ? "red" : "green" }}>{STATUS_MENU(data?.status)}</td>
                      <td>{data?.detail ? data?.detail : " - "}</td>
                      <td><FontAwesomeIcon icon={faEdit} onClick={() => handleShow2(data?._id)} style={{ color: COLOR_APP }} /><FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: 20, color: "red" }} onClick={() => handleShow3(data?._id, data?.name)} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
          <Modal.Title>ເພີ່ມເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            menuName: '',
            price: '',
            detail: '',
          }}
          validate={values => {
            const errors = {};
            if (!values.menuName) {
              errors.menuName = 'ກະລຸນາປ້ອນຊື່ອາຫານ...';
            }
            if (!values.price) {
              errors.price = 'ກະລຸນາປ້ອນລາຄາ...';
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
                  {imageLoading ? <div class="progress" style={{ height: 20 }}>
                    <div class="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                  </div> : <div style={{ height: 20 }} />}
                </div>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control as="select"
                    name="category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.category}
                  >
                    <option selected={true} disabled={true}>ເລືອກປະເພດອາຫານ</option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
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
                    name="menuName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.menuName}
                    placeholder="ຊື່ອາຫານ..."
                    style={{ border: errors.menuName && touched.menuName && errors.menuName ? "solid 1px red" : "" }} />
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
            menuName: dataUpdate?.name,
            price: dataUpdate?.price,
            detail: dataUpdate?.detail,
            category: dataUpdate?.category?._id,
            status: dataUpdate?.status,
          }}
          validate={values => {
            const errors = {};
            if (!values.menuName) {
              errors.menuName = 'ກະລຸນາປ້ອນຊື່ອາຫານ...';
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
                          <Image src={URL_PHOTO_AW3 + dataUpdate?.image} alt="" width="150" height="150" style={{
                            height: 200,
                            width: 200,
                            borderRadius: '10%',
                          }} />
                        </center>
                      }
                    </div>
                  </label>
                  {/* progass */}
                  {imageLoading ? <div class="progress" style={{ height: 20 }}>
                    <div class="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                  </div> : <div style={{ height: 20 }} />}
                </div>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control as="select"
                    name="category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.category}
                  >
                    <option selected={true} disabled={true}>ເລືອກປະເພດອາຫານ</option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>
                    })}
                  </Form.Control>
                </Form.Group>
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
                    name="menuName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.menuName}
                    placeholder="ຊື່ອາຫານ..."
                    style={{ border: errors.menuName && touched.menuName && errors.menuName ? "solid 1px red" : "" }} />
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
    </div>
  )
}
