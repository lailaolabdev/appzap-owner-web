import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router"

import {
  Modal,
  Button,
  Image,
  Form
} from "react-bootstrap";
import { END_POINT, HEADER, BODY, COLOR_APP, COLOR_APP_CANCEL, URL_PHOTO_AW3 } from '../../constants'
import { USERS } from '../../constants/api'
import AnimationLoading from "../../constants/loading"
import profileImage from "../../image/profile.png"
import { STATUS_USERS } from '../../helpers'

export default function UserList() {
  const { history, location, match } = useReactRouter()
  const _limit = match.params.limit;
  const _page = match.params.page;
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setuserData] = useState()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getData()
  }, [])
  const getData = async (tokken) => {
    setIsLoading(true)
    await fetch(USERS + `/skip/0/limit/10/`, {
      method: "GET",
      headers: tokken
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
  return (
    <div>
      {isLoading ? <AnimationLoading /> : <div>
        <div style={BODY}>
          <div className="row" style={{ padding: 30 }}>
            <div className="col-md-12" style={{ fontSize: "20px" }}>users ( {userData?.total} )</div>
          </div>
          <div style={{ paddingBottom: 20 }}>
            <div className="col-md-12" >
              <button type="button" class="btn btn-app col-2 " style={{ float: "right", backgroundColor: COLOR_APP, color: "#ffff" }} onClick={handleShow}> Add user </button>
            </div>
          </div>
          <div style={{ height: 40 }}></div>
          <div>
            <div className="col-sm-12">
              <table class="table table-hover">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Pictures</th>
                    <th scope="col">Firstname</th>
                    <th scope="col">Lastname</th>
                    <th scope="col">Role</th>
                    <th scope="col">Phone number</th>
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
                              <Image src={URL_PHOTO_AW3 + data?.image} alt="AeonIcon" width="150" height="150" style={{
                                height: 50,
                                width: 50,
                                borderRadius: '50%',
                              }} />
                            </center>
                          ) : (<center>
                            <Image src={profileImage} alt="AeonIcon" width="150" height="150" style={{
                              height: 50,
                              width: 50,
                              borderRadius: '50%',
                            }} />
                          </center>)}
                        </td>
                        <td>{data?.firstname}</td>
                        <td>{data?.lastname}</td>
                        <td>{STATUS_USERS(data?.role)}</td>
                        <td>{data?.phone}</td>
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
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>UserId</Form.Label>
            <Form.Control type="text" placeholder="UserId..." />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="Password" placeholder="Password..." />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Example select</Form.Label>
            <Form.Control as="select">
              <option>ພະນັກງານ</option>
              <option>ຜູ້ບໍລິຫານ</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Firstname</Form.Label>
            <Form.Control type="text" placeholder="Firstname..." />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Lastname</Form.Label>
            <Form.Control type="text" placeholder="Lastname..." />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="number" placeholder="Phone..." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }} onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button style={{ backgroundColor: COLOR_APP, color: "#ffff" }} >ບັນທືກ</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
