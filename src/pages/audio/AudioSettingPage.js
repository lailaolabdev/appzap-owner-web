import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../../components/Box";
import { useStore } from "../../store";
import { useStoreStore } from "../../zustand/storeStore";
import { useTranslation } from "react-i18next";

export default function AudioSettingPage() {
  const { t } = useTranslation();
  // state

  // provider
  const { audioSetting, setAudioSetting } = useStore();
  const { storeDetail } = useStoreStore();

  // Check if the storeDetail._id matches the specific ID
  const isDisabled = storeDetail?._id === "6790c324e9c128001ad67410";

  // useEffect

  console.log("audioSetting", audioSetting);
  console.log("storeDetail", storeDetail);

  // function

  return (
    <>
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("menage_sound")}</Breadcrumb.Item>
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
              {t("restaurant_sound")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: `${t("has_order")}`,
                  key: "order",
                },
                {
                  title: `${t("oppen_tb_sound")}`,
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
                      {audioSetting?.[item?.key]
                        ? `${t("oppen")}`
                        : `${t("close")}`}
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
                      disabled={isDisabled} // Disable the switch if isDisabled is true
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
              {t("mg_sound")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: `${t("mg_in_sound")}`,
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
                      {audioSetting?.[item?.key]
                        ? `${t("oppen")}`
                        : `${t("close")}`}
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
                      disabled={isDisabled} // Disable the switch if isDisabled is true
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
              {t("other_sound")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: `${t("song_sound")}`,
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
                      {audioSetting?.[item?.key]
                        ? `${t("oppen")}`
                        : `${t("close")}`}
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
                      disabled={isDisabled} // Disable the switch if isDisabled is true
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
