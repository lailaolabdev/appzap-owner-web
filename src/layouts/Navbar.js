import React, { useState, useEffect, useContext } from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Dropdown from "react-bootstrap/Dropdown"
import { USER_KEY, END_POINT, URL_PHOTO_AW3 } from "../constants"
import useReactRouter from "use-react-router"
import ImageProfile from "../image/profile.png"
import { Badge, Modal, Button, Table } from 'react-bootstrap'
import moment from 'moment';
import axios from 'axios';
import { SocketContext } from "../services/socket"
import { socket } from '../services/socket'


export default function NavBar() {
  const { history, location, match } = useReactRouter()
  const [getmassege, setgetmassege] = useState()
  const [userData, setUserData] = useState({})
  const [messageData, setmessageData] = useState()



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
  const _updateMessage = async () => {
    const resData = await axios({
      method: 'get',
      url: END_POINT + `/v2/messageDetail?storeId=${userData?.data?.storeId}&read=NOT&from=TABLE`,
    })
    setmessageData(resData?.data)
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  socket.on(`MESSAGE_STORE:${userData?.data?.storeId}`, (data) => {
    _updateMessage();
  });
  useEffect(() => {
    _updateMessage()
  }, [userData])
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
          <p style={{ marginTop: 20 }}>Version:2.0.7</p>
          <div style={{ marginLeft: 20 }}></div>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqimBa5dxfPceCwDPT8DBZeD-X7tjbzxU6nDbP8fCt2pXuxlJHeAD93uZJjiVOkiW5G4Q&usqp=CAU"
            width={35}
            height={35}
            roundedCircle
            onClick={() => history.push("/messagerList")}
            style={{ cursor: 'pointer'}}
          // onClick={handleShow}
          />
          <Badge variant="danger" >{messageData?.length ? messageData?.length : ""}</Badge>
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
                <th>ໂຕະ</th>
                <th>ຊື່</th>
                <th>ຂໍ້ຄວາມ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {messageData && messageData?.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.table_id ? item?.table_id : "-"}</td>
                    <td>{item?.customer_nickname}</td>
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
