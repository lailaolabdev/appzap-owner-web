import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { COLOR_APP, padding } from "../../constants";
import Box from "../../components/Box";
import { useStore } from "../../store";
import { BsExclamationDiamondFill } from "react-icons/bs";
import {
  getSetting,
  updateSetting,
  updateSettingCafe,
  updateSettingCRM,
  getSettingCafe,
  updateSettingDelivery,
  updateSettingShift,
  updateSettingServiceChange,
} from "../../services/setting";
import PopUpEditTax from "../../components/popup/PopUpEditTax";
import PopUpEditServiceCharge from "../../components/popup/PopUpEditServiceCharge";
import PopUpCreateServiceCharge from "../../components/popup/PopUpCreateServiceCharge";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { useStoreStore } from "../../zustand/storeStore";

export default function ConfigPage() {
  const { t } = useTranslation();
  // state
  const [setting, setSetting] = useState();
  const [switchState, setSwitchState] = useState({});
  const [switchCafeState, setSwitchCafeState] = useState(false);
  const [tax, setTax] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [popup, setPopup] = useState();
  const { storeDetail, fetchStoreDetail, updateStoreDetail } = useStoreStore();

  // provider
  const { audioSetting, setAudioSetting, profile } = useStore();

  // useEffect
  useEffect(() => {
    getSettingData();
    getServiceCharge();
    getDataTax();
  }, []);

  // function
  const handleCreateServiceCharge = async (serviceCharge) => {
    try {
      const { DATA } = await getLocalData();
      const _res = await Axios.post(
        END_POINT_SEVER + "/v4/create/service-charge",
        { serviceCharge: parseInt(serviceCharge), storeId: DATA.storeId }
      );
      console.log("SUCCESS: ", _res);
      getServiceCharge();
      setPopup();
    } catch (error) {
      console.error("Failed to create service charge", error);
    }
  };
  const handleChangeTax = async (newTax) => {
    const { DATA } = await getLocalData();
    const _res = await Axios.put(
      END_POINT_SEVER + "/v4/tax/update/" + DATA.storeId,
      { newTax: parseInt(newTax) }
    );
    getDataTax();
    setPopup();
  };
  const handleChangeServiceCharge = async (serviceCharge) => {
    const { DATA } = await getLocalData();
    const _res = await Axios.put(
      END_POINT_SEVER + "/v4/update/service-charge/" + DATA.storeId,
      { serviceCharge: parseInt(serviceCharge) }
    );
    getServiceCharge();
    setPopup();
  };
  const getDataTax = async () => {
    const { DATA } = await getLocalData();
    const _res = await Axios.get(END_POINT_SEVER + "/v4/tax/" + DATA?.storeId);
    setTax(_res?.data?.taxPercent);
  };

  const getServiceCharge = async () => {
    const { DATA } = await getLocalData();
    const _res = await Axios.get(
      `${END_POINT_SEVER}/v4/service-charge/${DATA?.storeId}`
    );
    setServiceCharge(_res?.data?.serviceCharge);
  };

  const getSettingData = async () => {
    const data = await getSetting(storeDetail?._id);
    setSwitchState((prev) => ({ ...prev, ...data?.smartMenu }));
    setSetting(data);
  };

  const changeSwitchData = async (dataUpdate) => {
    const data = await updateSetting(setting?._id, dataUpdate);
    setSwitchState((prev) => ({ ...prev, ...data?.smartMenu }));
  };

  const changeCafe = async (e) => {
    const isCafe = e.target.checked;
    const _type = isCafe ? "CAFE" : "GENERAL";
    await updateSettingCafe(profile?.data.storeId, { data: _type });
    // zustand store
    await fetchStoreDetail(storeDetail?._id);
  };
  const changeCRM = async (e) => {
    const isType = e.target.checked;
    await updateSettingCRM(profile?.data.storeId, { data: isType });
    // zustand store
    await fetchStoreDetail(storeDetail?._id);
  };

  const changeDelivery = async (e) => {
    const isType = e.target.checked;

    await updateSettingDelivery(profile?.data.storeId, { data: isType });
    // zustand store
    await fetchStoreDetail(storeDetail?._id);
  };
  const changeShift = async (e) => {
    const isType = e.target.checked;
    await updateSettingShift(profile?.data.storeId, { data: isType });
  };

  const changeSericeChange = async (e) => {
    const isType = e.target.checked;
    await updateSettingServiceChange(profile?.data.storeId, { data: isType });
    // console.log("changeSericeChange", isType);
    await fetchStoreDetail(storeDetail?._id);
  };

  const BankPayment = async (e) => {
    const isChecked = e.target.checked;

    // zustand store
    await updateStoreDetail(
      { isBankPaymentAvailable: isChecked },
      storeDetail?._id
    );
    await fetchStoreDetail(storeDetail?._id);
  };

  const changeBooking = async (e) => {
    const isChecked = e.target.checked;

    // zustand store
    await updateStoreDetail({ isReservable: isChecked }, storeDetail?._id);
    await fetchStoreDetail(storeDetail?._id);
  };

  const TooltipFunc = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <BsExclamationDiamondFill style={{ color: COLOR_APP }} />
    </OverlayTrigger>
  );

  return (
    <>
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
          height: "100%",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("posconfig")}</Breadcrumb.Item>
        </Breadcrumb>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
          }}
        >
          {!storeDetail?.isStatusCafe && (
            <>
              <Card border="primary" style={{ margin: 0 }}>
                <Card.Header
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {t("tax")}
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px dotted ${COLOR_APP}`,
                    }}
                  >
                    <div>
                      {t("tax")}: {tax}%
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Button onClick={() => setPopup({ PopUpEditTax: true })}>
                        {t("edit")}
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px dotted ${COLOR_APP}`,
                    }}
                  >
                    <div>
                      {t("service_charge")}: {serviceCharge}%
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={() =>
                          setPopup({ PopUpEditServiceCharge: true })
                        }
                      >
                        {t("edit")}
                      </Button>
                    </div>
                  </div>
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
                  SMART MENU & SELF ORDERING
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: `${t("oppen_smart_menu")}`,
                      key: "open",
                      tooltip: `${t("close_oppen_for_work")}`,
                      disabled: true,
                      default: true,
                    },
                    {
                      title: `${t("oppen_table_first")}`,
                      key: "shouldOpenTableForSelfOrdering",
                      tooltip: "",
                      disabled: true,
                    },
                    {
                      title: `${t("auto_oppen")}`,
                      key: "autoOpenTable",
                      tooltip: "",
                      disabled: true,
                    },
                    {
                      title: `${t("table_qr")}`,
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
                            ? `${t("oppen")}`
                            : `${t("close")}`}
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
                  {t("stock_system")}
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: `${t("enable_stock")}`,
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
                            ? `${t("oppen")}`
                            : `${t("close")}`}
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
                  {t("booking")}
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: `${t("enable_booking")}`,
                      key: "fer",
                      disabled: false,
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
                        <Form.Label htmlFor={"booking-" + item?.key}>
                          {storeDetail?.isReservable
                            ? `${t("oppen")}`
                            : `${t("close")}`}
                        </Form.Label>
                        <Form.Check
                          disabled={item?.disabled}
                          type="switch"
                          checked={storeDetail?.isReservable}
                          id={"booking-" + item?.key}
                          onChange={changeBooking}
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
                  {t("isCafe")}
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: t("enable_cafe"),
                      key: "fer",
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
                        <Form.Label htmlFor={"switch-cafe-" + item?.key}>
                          {storeDetail?.isRestuarant == "CAFE"
                            ? `${t("oppen")}`
                            : `${t("close")}`}
                        </Form.Label>
                        <Form.Check
                          type="switch"
                          checked={storeDetail?.isRestuarant == "CAFE"}
                          id={"switch-cafe-" + item?.key}
                          onChange={changeCafe}
                        />
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </>
          )}
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("bank_payment_available")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: t("enable_bank_payment"),
                  key: "fer",
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
                    <Form.Label htmlFor={"transfer-payment-" + item?.key}>
                      {storeDetail?.isBankPaymentAvailable
                        ? `${t("oppen")}`
                        : `${t("close")}`}
                    </Form.Label>
                    <Form.Check
                      // disabled={true}
                      type="switch"
                      checked={storeDetail?.isBankPaymentAvailable}
                      id={"transfer-payment-" + item?.key}
                      onChange={BankPayment}
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
              {t("is_crm")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: t("open_crm"),
                  key: "crm",
                },
              ].map((item) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={item?.key}
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
                    <Form.Label htmlFor={`switch-crm-${item?.key}`}>
                      {storeDetail?.isCRM ? `${t("oppen")}` : `${t("close")}`}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={storeDetail?.isCRM}
                      id={`switch-crm-${item?.key}`}
                      onChange={changeCRM}
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
          {!storeDetail?.isStatusCafe && (
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {"Delivery Function"}
              </Card.Header>
              <Card.Body>
                {[
                  {
                    title: t("open_delivery"),
                    key: "delivery",
                  },
                ].map((item) => (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px dotted ${COLOR_APP}`,
                    }}
                    key={item?.key}
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
                      <Form.Label htmlFor={`switch-crm-${item?.key}`}>
                        {storeDetail?.isDelivery
                          ? `${t("oppen")}`
                          : `${t("close")}`}
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        checked={storeDetail?.isDelivery}
                        id={`switch-delivery-${item?.key}`}
                        onChange={changeDelivery}
                      />
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("shift")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: t("open_function_shift"),
                  key: "shift",
                },
              ].map((item) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={item?.key}
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
                    <Form.Label htmlFor={`switch-shift-${item?.key}`}>
                      {storeDetail?.isShift ? `${t("oppen")}` : `${t("close")}`}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={storeDetail?.isShift}
                      id={`switch-shift-${item?.key}`}
                      onChange={changeShift}
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
              {t("service_charge")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: t("service_charge_open"),
                  key: "service_charge",
                },
              ].map((item) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={item?.key}
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
                    <Form.Label htmlFor={`service_charge-${item?.key}`}>
                      {storeDetail?.isServiceChange
                        ? `${t("oppen")}`
                        : `${t("close")}`}
                    </Form.Label>
                    <Form.Check
                      type="switch"
                      checked={storeDetail?.isServiceChange}
                      id={`service_charge-${item?.key}`}
                      onChange={changeSericeChange}
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Box>
      </Box>
      {/* popup */}
      <PopUpEditTax
        open={popup?.PopUpEditTax}
        onClose={() => setPopup()}
        prevTax={tax}
        onSubmit={handleChangeTax}
      />
      <PopUpEditServiceCharge
        open={popup?.PopUpEditServiceCharge}
        onClose={() => setPopup()}
        prevServiceCharge={serviceCharge}
        onSubmit={handleChangeServiceCharge}
      />
      <PopUpCreateServiceCharge
        open={popup?.PopUpCreateServiceCharge}
        onClose={() => setPopup()}
        onSubmit={handleCreateServiceCharge}
      />
    </>
  );
}
