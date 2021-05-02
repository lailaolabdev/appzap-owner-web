import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import Dropdown from "react-bootstrap/Dropdown"
import NavDropdown from "react-bootstrap/NavDropdown"
import { USER_KEY, END_POINT } from "../constants"
import useReactRouter from "use-react-router"
import ImageProfile from "../image/profile.png"
import { Badge } from 'react-bootstrap'

export default function NavBar() {
  const { history, location, match } = useReactRouter()
  const [userData, setUserData] = useState({})
  console.log("🚀 ~ file: Navbar.js ~ line 15 ~ NavBar ~ userData", userData?.data)
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

  const _onDetailProfile = () => {
    history.push(`/pagenumber/${1}/profile/${userData.id}`)
  }
  const [checkBill, setcheckBill] = useState()
  useEffect(() => {
    _searchDate()
  }, [])
  const _searchDate = async () => {
    const url = END_POINT + `/orders?status=CALLTOCHECKOUT&checkout=false`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setcheckBill(response)
      })
  }
  const _gotohistoryCheckbill = () => {
    history.push('/checkBill')
  }
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
          zIndex: 1001,
        }}
        variant="dark"
      >
        <Navbar.Brand style={{ color: "#909090" }} href="#">
          {/*	<Image src={ImageLogo} height={40} width={150} />*/}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
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
                  onClick={() => _onDetailProfile()}
                >
                  Profile
								</Dropdown.Item>
                <NavDropdown.Divider />
                <Dropdown.Item
                  style={{ color: "#909090" }}
                  onClick={() => _onLogout()}
                >
                  Logout
								</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Image
              src={userData.image ? userData.image.url : ImageProfile}
              width={50}
              height={50}
              roundedCircle
            />
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
