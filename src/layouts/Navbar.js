import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Dropdown from "react-bootstrap/Dropdown"
import NavDropdown from "react-bootstrap/NavDropdown"
import { USER_KEY, END_POINT, URL_PHOTO_AW3 } from "../constants"
import useReactRouter from "use-react-router"
import ImageProfile from "../image/profile.png"
import { Badge, Modal, Button, Table } from 'react-bootstrap'
import socketIOClient from "socket.io-client";
import moment from 'moment';
import axios from 'axios';


export default function NavBar() {
  const { history, location, match } = useReactRouter()
  const [userData, setUserData] = useState({})
  const socket = socketIOClient(END_POINT);
  const [NewChackBill, setNewChackBill] = useState()
  const [getmassege, setgetmassege] = useState()

  socket.on("notificationCheckout", data => {
    setNewChackBill(data)
  });
  socket.on("messageAdmin", data => {
    setgetmassege(data)
  });
  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
    if (!ADMIN) {
      history.push(`/`)
    }
  }, [])
  const _onLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    history.push(`/`)
  }
  const [checkBill, setcheckBill] = useState()
  useEffect(() => {
    _searchDate()
  }, [NewChackBill])
  const _searchDate = async () => {
    const url = END_POINT + `/orders?status=CALLTOCHECKOUT&checkout=false`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setcheckBill(response)
      })
  }
  const [reLoadData, setreLoadData] = useState()
  socket.on("createorder", data => {
    setreLoadData(data)
  });
  useEffect(() => {
    getData()
  }, [reLoadData])
  const [orderItems, setorderItems] = useState()
  const getData = async (tokken) => {
    await fetch(END_POINT + "/orderItems?status=WAITING", {
      method: "GET",
    }).then(response => response.json())
      .then(json => setorderItems(json));
  }

  const [messageData, setmessageData] = useState()
  useEffect(() => {
    _message()
  }, [getmassege])
  const _message = async () => {
    const url = END_POINT + `/messages/?status=NOT`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setmessageData(response)
      })
  }
  const _gotohistoryCheckbill = () => {
    history.push('/checkBill')
  }
  const _updateMessage = async () => {
    let getId = []
    for (let p = 0; p < messageData?.length; p++) {
      getId.push(messageData[p]?._id)
    }
    // ======> update ststus= yes message
    const resData = await axios({
      method: 'PUT',
      url: END_POINT + `/messagesUpdateMany`,
      data: {
        getId
      },
    }).then(async function (response) {
      if (response) {
        window.location.reload();
      }
    }).catch(function (error) {
    })
  }
  const _orderindex = () => {
    history.push('/orders/pagenumber/1')
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <Navbar
        style={{
          backgroundColor: "#fff",
          boxShadow: "3px 0px 3px rgba(0, 0, 0, 0.16)",
          color: "#CC0000",
          width: "100%",
          height: 64,
          position: "fixed",
          zIndex: 1,
          marginLeft: 60,
          paddingRight: 80,
        }}
        variant="dark"
      >
        <Navbar.Brand style={{ color: "#909090" }} href="#">
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Image
            src="https://static.vecteezy.com/system/resources/thumbnails/001/976/814/small/shopping-chart-icon-doodle-hand-drawn-or-outline-icon-style-vector.jpg"
            width={35}
            height={35}
            roundedCircle
            onClick={() => _orderindex()}
          />
          <Badge variant="danger">{orderItems?.length ? orderItems?.length : ""}</Badge>
          <div style={{ marginLeft: 20 }}></div>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM_EuMtQtLai1XobOTisIwqDSJLsyAsAzD4fu4RsNabketghLEL8iA2WIzqT0mrnHcVdU&usqp=CAU"
            width={35}
            height={35}
            roundedCircle
            onClick={handleShow}
          />
          <Badge variant="danger">{messageData?.length ? messageData?.length : ""}</Badge>
          <div style={{ marginLeft: 20 }}></div>
          <Image
            src="https://icons-for-free.com/iconfiles/png/512/notification-131964743693202280.png"
            width={35}
            height={35}
            roundedCircle
            onClick={() => _gotohistoryCheckbill()}
          />
          <Badge variant="danger">{checkBill?.length ? checkBill?.length : ""}</Badge>
          <div style={{ marginLeft: 30 }}></div>
          <Form inline>
            <Dropdown>
              <Dropdown.Toggle
                style={{ color: "#909090" }}
                variant=""
                id="dropdown-basic"
              >
                {userData
                  ? (userData?.data?.firstname ? userData?.data?.firstname : "") +
                  " " +
                  (userData?.data?.lastname ? userData?.data?.lastname : "")
                  : ""}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  style={{ color: "#909090" }}
                  onClick={() => _onLogout()}
                >
                  ອອກຈາກລະບົບ
								</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Image
              src={userData?.data?.image ? URL_PHOTO_AW3 + userData?.data?.image : ImageProfile}
              width={45}
              height={45}
              roundedCircle
            />
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ຂໍ້ຄວາມຈາກລູກຄ້າ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>ຊື່</th>
                <th>ລະຫັດຕູບ</th>
                <th>ຂໍ້ຄວາມ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {messageData?.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.customer_nickname}</td>
                    <td>{item?.code}</td>
                    <td>{item?.text}</td>
                    <td>{moment(item?.createdAt).format("HH:mm a")}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            ປິດ
          </Button>
          <Button variant="success" onClick={() => _updateMessage()}>
            ອ່ານແລ້ວ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
