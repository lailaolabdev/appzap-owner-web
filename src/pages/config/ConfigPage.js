import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../../components/Box";
import { useStore } from "../../store";
import { BsExclamationDiamondFill } from "react-icons/bs";
import { getSetting, updateSetting } from "../../services/setting";

export default function ConfigPage() {
  // state
  const [setting, setSetting] = useState();
  const [switchState, setSwitchState] = useState({});

  // provider
  const { audioSetting, setAudioSetting, storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    getSettingData();
  }, []);

  // function
  const getSettingData = async () => {
    const data = await getSetting(storeDetail?._id);
    setSwitchState((prev) => ({ ...prev, ...data?.smartMenu }));
    setSetting(data);
    console.log(data?.smartMenu);
  };
  const changeSwitchData = async (dataUpdate) => {
    const data = await updateSetting(setting?._id, dataUpdate);
  };
  const TooltipFunc = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <BsExclamationDiamondFill style={{ color: COLOR_APP }} />
    </OverlayTrigger>
  );

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>ຕັ້ງຄ່າ</Breadcrumb.Item>
          <Breadcrumb.Item active>POS config</Breadcrumb.Item>
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
              SMART MENU & SELF ORDERING
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ເປີດໃຊ້ງານ SMART MENU & SELF ORDERING",
                  key: "open",
                  tooltip: "ເປີດ/ປິດ ເພື່ອໃຊ້ງານສະມາດເມນູແລະເຊວອໍເດີຣິງ",
                  disabled: true,
                  default: true,
                },
                {
                  title: "ເປີດໂຕະກ່ອນຈຶ່ງສາມາດສັ່ງອາຫານ",
                  key: "shouldOpenTableForSelfOrdering",
                  tooltip: "",
                  disabled: true,
                },
                {
                  title: "ເປີດໂຕະອັດຕະໂນມັດ",
                  key: "autoOpenTable",
                  tooltip: "",
                  disabled: true,
                },
                {
                  title: "QR ໜ້າໂຕະສາມາດສະແກນເພື່ອສັ່ງອາຫານໄດ້ທຸກຄົນ",
                  key: "tableQrEveryoneCanSelfOrdering",
                  tooltip: "",
                  disabled: true,
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
                  <div>
                    {item?.title}{" "}
                    <TooltipFunc title={item?.tooltip} id={index} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label htmlFor={"switch-audio-" + item?.key}>
                      {switchState?.[item?.key] || item?.default
                        ? "ເປີດ"
                        : "ປິດ"}
                    </Form.Label>
                    <Form.Check
                      disabled={item?.disabled}
                      type="switch"
                      checked={switchState?.[item?.key] || item?.default}
                      id={"switch-audio-" + item?.key}
                      onChange={(e) => {
                        changeSwitchData({
                          [`smartMenu.${item?.key}`]: e.target.checked,
                        })
                          .then((e) => {
                            getSettingData();
                          })
                          .catch((er) => console.log(er));
                      }}
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
              ສະບົບສາງ ແລະ ສະຕ໊ອກ
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ເປີດໃຊ້ງານ ລະບົບສາງ",
                  key: "sang",
                  default: false,
                  disabled: true,
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
                      {audioSetting?.[item?.key] || item?.default
                        ? "ເປີດ"
                        : "ປິດ"}
                    </Form.Label>
                    <Form.Check
                      disabled={item?.disabled}
                      type="switch"
                      checked={audioSetting?.[item?.key] || item?.default}
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
              ການຈອງ
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ເປີດໃຊ້ງານການຈອງ",
                  key: "fer",
                  disabled: true,
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
                      disabled={item?.disabled}
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
