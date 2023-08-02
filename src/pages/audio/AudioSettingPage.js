import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../../components/Box";
import { useStore } from "../../store";

export default function AudioSettingPage() {
  // state

  // provider
  const { audioSetting, setAudioSetting } = useStore();

  // useEffect

  // function

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>ຕັ້ງຄ່າ</Breadcrumb.Item>
          <Breadcrumb.Item active>ຈັດການສຽງ</Breadcrumb.Item>
        </Breadcrumb>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
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
              ສຽງລະບົບຂາຍໜ້າຮ້ານ
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ສຽງອໍເດີເຂົ້າ",
                  key: "order",
                },
                {
                  title: "ສຽງເປີດໂຕະ",
                  key: "openTable",
                },
              ].map((item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={index}
                >
                  <div>{item?.title}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label htmlFor={"switch-audio-" + item?.key}>
                      {audioSetting?.[item?.key] ? "ເປີດ" : "ປິດ"}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={audioSetting?.[item?.key]}
                      id={"switch-audio-" + item?.key}
                      onChange={(e) =>
                        setAudioSetting((prev) => ({
                          ...prev,
                          [item?.key]: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ສຽງຂໍ້ຄວາມ
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ສຽງຂໍ້ຄວາມເຂົ້າ",
                  key: "message",
                },
              ].map((item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={index}
                >
                  <div>{item?.title}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label htmlFor={"switch-audio-" + item?.key}>
                      {audioSetting?.[item?.key] ? "ເປີດ" : "ປິດ"}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={audioSetting?.[item?.key]}
                      id={"switch-audio-" + item?.key}
                      onChange={(e) =>
                        setAudioSetting((prev) => ({
                          ...prev,
                          [item?.key]: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ສຽງອື່ນໆ
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ສຽງເພງ",
                  key: "music",
                },
              ].map((item, index) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={index}
                >
                  <div>{item?.title}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label htmlFor={"switch-audio-" + item?.key}>
                      {audioSetting?.[item?.key] ? "ເປີດ" : "ປິດ"}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={audioSetting?.[item?.key]}
                      id={"switch-audio-" + item?.key}
                      onChange={(e) =>
                        setAudioSetting((prev) => ({
                          ...prev,
                          [item?.key]: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Box>
      </Box>
      {/* popup */}
    </>
  );
}
