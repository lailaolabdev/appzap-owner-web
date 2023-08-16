import React from "react";
import Box from "../../components/Box";
import {
  Breadcrumb,
  Button,
  Card,
  ListGroup,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { AiOutlineFontSize } from "react-icons/ai";
import { IoMdColorPalette } from "react-icons/io";
import { BsFlagFill } from "react-icons/bs";
import { CgToolbarBottom } from "react-icons/cg";
import { MdMenuBook } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

export default function settingTheme() {
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
              <p> ຕັ້ງຄ່າຂໍ້ມູນຕາມຫົວຂໍ້ທີເລືອກ</p>
              <footer className="blockquote-footer">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </footer>
              <footer className="blockquote-footer">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </footer>
              <footer className="blockquote-footer">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </footer>
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
            <Card border="primary" style={{ width: 320, height: 500 }}>
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
              <Card.Body></Card.Body>
            </Card>
            <ButtonGroup style={{ position: "absolute", right: 0, top: 0 }}>
              <Button variant="primary">Desktop</Button>
              <Button variant="primary">Tablet</Button>
              <Button variant="primary">Mobile</Button>
            </ButtonGroup>
          </div>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Body>
              <div style={{ display: "flex", gap: 10 }}>
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
              </div>
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
              borderColor: COLOR_APP,
              color: COLOR_APP,
            }}
          >
            setting
          </Card.Header>
          <Card.Body>
            <div>
              <Form.Control />
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}
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
                Max
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
            </div>
          </Card.Body>
        </Card>
        {/* </div> */}
      </div>
    </Box>
  );
}
