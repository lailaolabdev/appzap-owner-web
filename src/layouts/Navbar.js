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
            src="data:image/png;base64,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"
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
