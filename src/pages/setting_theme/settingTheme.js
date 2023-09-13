import React, { useEffect, useState } from "react";
import Box from "../../components/Box";
import {
  Breadcrumb,
  Button,
  Card,
  ListGroup,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import IFrame from "../../components/IFrame";

import { COLOR_APP } from "../../constants";
import { AiOutlineFontSize } from "react-icons/ai";
import { IoMdColorPalette } from "react-icons/io";
import { BsFlagFill } from "react-icons/bs";
import { CgToolbarBottom } from "react-icons/cg";
import { MdMenuBook, MdOutlineTabletAndroid } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaMobileAlt } from "react-icons/fa";
import { IoDesktopOutline } from "react-icons/io5";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GoContainer } from "react-icons/go";

import defualtPreset from "./presets/defualtPreset";
import homePage from "./presets/homePage";
import compileJson from "../../helpers/compileJson";
import deCompileJson from "../../helpers/deCompileJson";
import { useStore } from "../../store/useStore";
import MenuItemThemeTool from "./customs/MenuItemThemeTool";
import SelfOrderingPage from "./ThemeIframe";
export default function SettingTheme() {
  // state

  // provider
  const { storeDetail } = useStore();
  // useEffect
  // function
  return (
    <Box
      sx={{
        padding: { md: 20, xs: 10 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Breadcrumb>
        <Breadcrumb.Item>ຕັ້ງຄ່າຮ້ານຄ້າ</Breadcrumb.Item>
        <Breadcrumb.Item active>Theme smart menu</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr 320px",
          gridTemplateRows: "100%",
          flex: 1,
          gap: 10,
        }}
      >
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            ເຄື່ອງມື
          </Card.Header>
          <ListGroup variant="flush">
            {[
              {
                icon: <MdMenuBook />,
                title: "ເມນູ",
              },
              {
                icon: <IoMdColorPalette />,
                title: "ສີ",
              },
              {
                icon: <BsFlagFill />,
                title: "ແບນເນີ",
              },
              {
                icon: <CgToolbarBottom />,
                title: "Footer",
              },
              {
                icon: <AiOutlineFontSize />,
                title: "Font",
              },
            ].map((item) => (
              <ListGroup.Item
                action
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {item?.icon}
                <div>{item?.title}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Card.Body>
            <blockquote className="blockquote mb-0">
              <p>ເຄື່ອງມືສຳຫຼັບການຕັ້ງຄ່າຕີມສະມາດເມນູ</p>
              <footer className="blockquote-footer">
                ສາມາດອອກແບບຕາມຄວາມຕ້ອງການຂອງຮ້ານ
              </footer>
              <footer className="blockquote-footer">ປັບປຽນໄດ້ໃນທັນທີ</footer>
              <footer className="blockquote-footer">ມີຕີມໃຫ້ເລືອກຫຼາຍ</footer>
            </blockquote>
          </Card.Body>
          <Card.Footer>
            <Button style={{ width: "100%" }}>ບັນທຶກການແກ້ໄຂ</Button>
          </Card.Footer>
        </Card>
        {/* </div> */}
        {/* center tool */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Card
              border="primary"
              style={{ width: 320, height: 500, overflow: "hidden" }}
            >
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: "2px 5px",
                  height: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Mobile
                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                />
              </Card.Header>
              <Card.Body style={{ padding: 0 }}>
                <SelfOrderingPage
                  storeDetail={storeDetail}
                  environment="https://api.appzap.la"
                  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InRhYmxlSWQiOiI2MzYzM2UyOTZhZGE4ODAwMWZjN2Q0YzIiLCJjb2RlSWQiOiI2NDc2MGQ1MzFlOWNmYjAwMmI1MzQ4ZjMiLCJjb2RlIjoiRlI0QUZFIiwic3RvcmVJZCI6IjYzMjE4Y2NjNzgzZDM5MDAxZmQwODJiNSIsImJpbGxJZCI6IjY0ZmVmNjVlMjQ3NTJkMDAyYWEzZmE4NyJ9LCJpYXQiOjE2OTQ0MzA4MTR9.K543KxoW3n_AWVa9kLWDSs9IPTI2c0ZF9o8UGoNFdhM"
                />
                {/* <IFrame
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    padding: 0,
                    margin: 0,
                  }}
                  keyCount={keys}
                  ui={ui}
                ></IFrame> */}
              </Card.Body>
            </Card>
            <ButtonGroup style={{ position: "absolute", right: 0, top: 0 }}>
              <Button variant="outline-primary">
                <IoDesktopOutline />
              </Button>
              <Button variant="outline-primary">
                <MdOutlineTabletAndroid />
              </Button>
              <Button variant="outline-primary">
                <FaMobileAlt />
              </Button>
            </ButtonGroup>
          </div>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Body>
              {/* <div style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    border: `2px dotted ${COLOR_APP}`,
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: COLOR_APP,
                  }}
                >
                  <IoMdAdd />
                </div>
                <div
                  style={{
                    border: `2px solid ${COLOR_APP}`,
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: COLOR_APP,
                    fontWeight: "bold",
                  }}
                >
                  Default
                </div>
                <div
                  style={{
                    border: `2px solid ${COLOR_APP}`,
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: COLOR_APP,
                    fontWeight: "bold",
                  }}
                >
                  Max
                </div>
              </div> */}
            </Card.Body>
          </Card>
        </div>
        {/* right tool */}
        {/* <div> */}
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            ເຄື່ອງມື
          </Card.Header>
          <Card.Body>
            {/* <div>
              <Form.Control />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  border: `2px solid ${COLOR_APP}`,
                  height: 80,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: COLOR_APP,
                  fontWeight: "bold",
                }}
              >
                <TfiLayoutGrid4Alt />
              </div>
              <div
                style={{
                  border: `2px solid ${COLOR_APP}`,
                  height: 80,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: COLOR_APP,
                  fontWeight: "bold",
                }}
              >
                <GoContainer />
              </div>
              <div
                style={{
                  border: `2px solid ${COLOR_APP}`,
                  height: 80,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: COLOR_APP,
                  fontWeight: "bold",
                }}
              >
                Max
              </div>
            </div> */}
            <MenuItemThemeTool />
          </Card.Body>
        </Card>
        {/* </div> */}
      </div>
    </Box>
  );
}
