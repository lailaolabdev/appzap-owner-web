import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router"
import { Formik } from 'formik';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Modal,
  Button,
  Image,
  Form
} from "react-bootstrap";
import { END_POINT, HEADER, BODY, COLOR_APP, COLOR_APP_CANCEL, URL_PHOTO_AW3 } from '../../constants'
import { USERS, USER, USERS_UPDATE, USERS_CREATE, USERS_DELETE, PRESIGNED_URL, getLocalData } from '../../constants/api'
import AnimationLoading from "../../constants/loading"
import profileImage from "../../image/profile.png"
import { STATUS_USERS } from '../../helpers'
import { successAdd, errorAdd } from '../../helpers/sweetalert'


export default function UserList() {
  const { history, location, match } = useReactRouter()
  const _limit = match.params.limit;
  const _page = match.params.page;
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setuserData] = useState()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
  const getData = async () => {
    setIsLoading(true)
    await fetch(USERS + `/skip/0/limit/10/?storeId=${match?.params?.id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setuserData(json));
    setIsLoading(false)
  }
  const _AddUser = () => {
    history.push('/users/userAdd')
  }
  const _userDetail = () => {

  }
  const [totalPage, setTotalPage] = useState([]);
  useEffect(() => {
    if (userData?.total > 0) {
      _getArrayPageNumber()
    }
  }, [userData])
  const _getArrayPageNumber = () => {
    let rowPage = [];
    let _total = 0;
    if (userData?.total % parseInt(_limit) != 0) {
      _total = (parseInt(userData?.total) / parseInt(_limit)) + 1;
    } else {
      _total = parseInt(userData?.total) / parseInt(_limit);
    }
    for (let i = 1; i <= _total; i++) {
      rowPage.push(i);
    }
    setTotalPage(rowPage);
  };
  const _nextPage = (page) => {
    history.push(`/users/limit/${_limit}/page/${page}`)
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
  console.log("namePhoto===>", namePhoto)
  // lung jak upload leo pic ja ma so u nee
  const ImageThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} style={{
      borderRadius: "50%",
      height: 200,
      width: 200,
    }} />;
  };
  // create user
  const _createUser = async (values) => {
    const resData = await axios({
      method: 'POST',
      url: USERS_CREATE,
      headers: getTokken?.TOKEN,
      data: {
        storeId: getTokken?.DATA?.storeId,
        userId: values?.userId,
        password: values?.password,
        firstname: values?.firstname,
        lastname: values?.lastname,
        phone: values?.phone,
        role: values?.role,
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
      console.log("error", error)
      errorAdd('ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ UserId ນີ້ມີແລ້ວ!')
    })

  }
  // ======>
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
      url: USERS_DELETE + `?id=${dateDelete?.id}`,
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
  const [dataUpdate, setdataUpdate] = useState({})
  const handleShow2 = async (item) => {
    setdataUpdate(item)
    setShow2(true)
  };
  const _updateCategory = async (values) => {
    if (values?.userId === dataUpdate?.userId) {
      delete values?.userId
    }
    const resData = await axios({
      method: 'PUT',
      url: USERS_UPDATE + `?id=${dataUpdate?._id}`,
      headers: getTokken?.TOKEN,
      data: {
        firstname: values?.firstname,
        lastname: values?.lastname,
        phone: values?.phone,
        role: values?.role,
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
    <div>
      {isLoading ? <AnimationLoading /> : <div>
        <div style={BODY}>
          <div className="row" style={{ padding: 30 }}>
            <div className="col-md-12" style={{ fontSize: "20px" }}>ຈຳນວນພະນັກງານ ( {userData?.total} )</div>
          </div>
          <div style={{ paddingBottom: 20 }}>
            <div className="col-md-12" >
              <button type="button" className="btn btn-app col-2 " style={{ float: "right", backgroundColor: COLOR_APP, color: "#ffff" }} onClick={handleShow}> ເພີ່ມພະນັກງານ </button>
            </div>
          </div>
          <div style={{ height: 40 }}></div>
          <div>
            <div className="col-sm-12">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ຮູບພາບ</th>
                    <th scope="col">ຊື່</th>
                    <th scope="col">ນາມສະກຸນ</th>
                    <th scope="col">UserId</th>
                    <th scope="col">ສິດນຳໃຊ້ລະບົບ</th>
                    <th scope="col">ເບີໂທລະສັບ</th>
                    <th scope="col">ຈັດການຂໍ້ມູນ</th>
                  </tr>
                </thead>
                <tbody>
                  {userData?.users?.map((data, index) => {
                    return (
                      <tr onClick={() => _userDetail(data?._id)}>
                        <th scope="row">{index + 1 + parseInt(_limit) * parseInt(_page - 1)}</th>
                        <td>
                          {data?.image ? (
                            <center>
                              <Image src={URL_PHOTO_AW3 + data?.image} alt="" width="150" height="150" style={{
                                height: 50,
                                width: 50,
                                borderRadius: '50%',
                              }} />
                            </center>
                          ) : (<center>
                            <Image src={profileImage} alt="" width="150" height="150" style={{
                              height: 50,
                              width: 50,
                              borderRadius: '50%',
                            }} />
                          </center>)}
                        </td>
                        <td>{data?.firstname}</td>
                        <td>{data?.lastname}</td>
                        <td>{data?.userId}</td>
                        <td>{STATUS_USERS(data?.role)}</td>
                        <td>{data?.phone}</td>
                        <td><FontAwesomeIcon icon={faEdit} style={{ color: COLOR_APP }} onClick={() => handleShow2(data)}/><FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: 20, color: "red" }} onClick={() => handleShow3(data?._id, data?.firstname)} /></td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ textAlign: "center" }}>
                {totalPage?.map((item, index) => {
                  return (
                    <button style={{
                      width: 30,
                      height: 30,
                      border: "solid 1px #816aae",
                      marginLeft: 2,
                      backgroundColor: parseInt(_page) == index + 1 ? COLOR_APP : "#fff",
                      color: parseInt(_page) == index + 1 ? "#fff" : "#000",
                    }} onClick={() => _nextPage(item)}
                      key={item}
                    >{item}</button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      }
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມພະນັກງານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            userId: '',
            password: '',
            firstname: '',
            lastname: '',
            phone: '',
            role: 'USER',
          }}
          validate={values => {
            const errors = {};
            // if (!values.userId) {
            //   errors.userId = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            // if (!values.password) {
            //   errors.password = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            // if (!values.firstname) {
            //   errors.firstname = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            // if (!values.lastname) {
            //   errors.lastname = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            // if (!values.phone) {
            //   errors.phone = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createUser(values)
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
                  {imageLoading ? <div className="progress" style={{ height: 20 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                  </div> : <div style={{ height: 20 }} />}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>UserId</Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userId}
                    placeholder="UserId..."
                    style={{ border: errors.userId && touched.userId && errors.userId ? "solid 1px red" : "" }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="Password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Password..."
                    style={{ border: errors.password && touched.password && errors.password ? "solid 1px red" : "" }}

                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ສິດນຳໃຊ້ລະບົບ</Form.Label>
                  <Form.Control as="select"
                    name="role"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.role}
                  >
                    <option value="APPZAP_STAFF">ພະນັກງານ</option>
                    <option value="APPZAP_ADMIN">ຜູ້ບໍລິຫານ</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstname}
                    style={{ border: errors.firstname && touched.firstname && errors.firstname ? "solid 1px red" : "" }}
                    placeholder="ຊື່..." />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ນາມສະກຸນ</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastname}
                    style={{ border: errors.lastname && touched.lastname && errors.lastname ? "solid 1px red" : "" }}
                    placeholder="ນາມສະກຸນ..." />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ເບີໂທລະສັບ</Form.Label>
                  <Form.Control
                    type="number"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    style={{ border: errors.phone && touched.phone && errors.phone ? "solid 1px red" : "" }}
                    placeholder="ເບີໂທລະສັບ..." />
                </Form.Group>
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
      {/* update */}
      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ອັບເດດຂໍ້ມູນພະນັກງານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            userId: dataUpdate?.userId,
            firstname: dataUpdate?.firstname,
            lastname: dataUpdate?.lastname,
            phone: dataUpdate?.phone,
            role: dataUpdate?.role,
          }}
          validate={values => {
            const errors = {};
            // if (!values.userId) {
            //   errors.userId = 'ກະລຸນາປ້ອນ Userid... !';
            // }
            if (!values.firstname) {
              errors.firstname = 'ກະລຸນາປ້ອນ Userid... !';
            }
            if (!values.lastname) {
              errors.lastname = 'ກະລຸນາປ້ອນ Userid... !';
            }
            if (!values.phone) {
              errors.phone = 'ກະລຸນາປ້ອນ Userid... !';
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
                      borderRadius: "50%",
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
                  {imageLoading ? <div className="progress" style={{ height: 20 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${imageLoading}%`, backgroundColor: COLOR_APP }} aria-valuenow={imageLoading} aria-valuemin="0" aria-valuemax="100">{imageLoading}%</div>
                  </div> : <div style={{ height: 20 }} />}
                </div>
                {/* <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>UserId</Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userId}
                    placeholder="UserId..."
                    style={{ border: errors.userId && touched.userId && errors.userId ? "solid 1px red" : "" }}
                  />
                </Form.Group> */}
                {/* <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="Password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Password..."

                  />
                </Form.Group> */}
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ສິດນຳໃຊ້ລະບົບ</Form.Label>
                  <Form.Control as="select"
                    name="role"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.role}
                  >
                    <option value="USER">ພະນັກງານ</option>
                    <option value="STORE">ຜູ້ບໍລິຫານ</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstname}
                    style={{ border: errors.firstname && touched.firstname && errors.firstname ? "solid 1px red" : "" }}
                    placeholder="ຊື່..." />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ນາມສະກຸນ</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastname}
                    style={{ border: errors.lastname && touched.lastname && errors.lastname ? "solid 1px red" : "" }}
                    placeholder="ນາມສະກຸນ..." />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ເບີໂທລະສັບ</Form.Label>
                  <Form.Control
                    type="number"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    style={{ border: errors.phone && touched.phone && errors.phone ? "solid 1px red" : "" }}
                    placeholder="ເບີໂທລະສັບ..." />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }} onClick={handleClose2}>
                  ຍົກເລີກ
          </Button>
                <Button style={{ backgroundColor: COLOR_APP, color: "#ffff" }} onClick={() => handleSubmit()}>ບັນທືກ</Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>

      {/* ===== delete */}
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
    </div>
  )
}
