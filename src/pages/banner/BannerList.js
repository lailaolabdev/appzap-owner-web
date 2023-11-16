import React, { useEffect, useState } from "react";
import AnimationLoading from "../../constants/loading";
import { BODY, COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Table } from "react-bootstrap";
import { Formik } from "formik";
import {
  CREATE_CURRENCY,
  DELETE_CURRENCY,
  END_POINT_SEVER,
  QUERY_CURRENCIES,
  QUERY_CURRENCY_HISTORY,
  UPDATE_CURRENCY,
  getLocalData,
} from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { moneyCurrency } from "../../helpers";
import { Breadcrumb, Nav, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import moment from "moment";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";

const images = [
  "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
  "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
  "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
  "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
  // 'url-to-second-image.jpg',
  // 'url-to-third-image.jpg',
  // Add more image URLs here
];

export default function BannerList() {
  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [currencyHistoryData, setCurrencyHistoryData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  const handleShowEdit = (data) => {
    setDataUpdate(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
    setDataDelete(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
      }
    };
    fetchData();
    getDataBanner();
  }, []);

  const getDataBanner = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const data = await getBanners("?storeId=" + DATA?.storeId);

        setBannerData(data);

        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _create = async (values) => {
    alert("sdfdf");
    console.log("values", values);
    await Axios({
      method: "POST",
      url: END_POINT_SEVER + "/v4/banner/create",
      headers: getTokken?.TOKEN,
      data: values,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
          handleCloseAdd();
          getDataBanner();
        }
      })
      .catch(function (error) {
        console.log("error", error);
        errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ ສະກຸນເງິນນີ້ມີແລ້ວ!");
      });
  };

  const _update = async (values) => {
    await Axios({
      method: "PUT",
      url: `${UPDATE_CURRENCY}/${dataUpdate?._id}`,
      headers: getTokken?.TOKEN,
      data: values,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
          handleCloseEdit();
          getDataBanner();
        }
      })
      .catch(function (error) {
        console.log("error", error);
        errorAdd("ແກ້ຂໍ້ມູນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນຂໍ້ມູນ ແລ້ວລອງໃໝ່ອີກຄັ້ງ!");
      });
  };

  const _confirmeDelete = async () => {
    await Axios({
      method: "DELETE",
      url: `${END_POINT_SEVER}/v4/banner/update${dataDelete?._id}`,
      headers: getTokken?.TOKEN,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ລົບຂໍ້ມູນສຳເລັດ");
          handleCloseDelete();
          getDataBanner();
        }
      })
      .catch(function (error) {
        errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
      });
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>ຕັ້ງຄ່າ</Breadcrumb.Item>
          <Breadcrumb.Item active>ຈັດການແບນເນີ</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          {/* <Nav
            variant="tabs"
            defaultActiveKey="currency-list"
            // onSelect={() => {}}
            style={{ marginBottom: 20 }}
          >
            <Nav.Item>
              <Nav.Link eventKey="currency-list">ສະກຸນເງິນທັງໝົດ</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="currency-history">ປະຫວັດການເລດເງິນ</Nav.Link>
            </Nav.Item>
          </Nav> */}
          <Tab
            eventKey="currency-list"
            title="ລາຍການແບນເນີ"
            style={{ paddingTop: 20 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: 10,
                gap: 10,
              }}
            >
              <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
                <Card.Header
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  <BsImages /> ຕົວຢ່າງ
                </Card.Header>
                <Card.Body>
                  <ImageSlider images={images} />
                </Card.Body>
              </Card>
              <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
                <Card.Header
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  <BsImages /> ເຄື່ອງມື
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: "ເປີດໃຊ້ງານແບນເນີ",
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
                          ເປີດ
                          {/* {audioSetting?.[item?.key] ? "ເປີດ" : "ປິດ"} */}
                        </Form.Label>
                        <Form.Check
                          disabled={item?.disabled}
                          type="switch"
                          checked={true}
                          id={"switch-audio-" + item?.key}
                          onChange={(e) => {}}
                        />
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </div>
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <BsImages /> ລາຍການແບນເນີ
                </span>
                <Button variant="dark" bg="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> ເພີ່ມລາຍການ
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th>ຮູບແບນເນີ</th>
                    <th>ຊື່ແບນນີ້</th>
                    <th>ສະຖານະ</th>
                    <th>ຈັດການຂໍ້ມູນ</th>
                  </tr>
                  {bannerData?.map((data, index) => (
                    <tr key={index}>
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">
                        <div
                          style={{
                            width: 200,
                            height: 100,
                            border: "1px solid #ccc",
                          }}
                        >
                          <img
                            src={
                              "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/medium/" +
                              data?.image
                            }
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-left">{data?.name}</td>
                      <td className="text-left">ເປີດ</td>
                      <td className="text-left">
                        {/* <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: COLOR_APP }}
                          onClick={() => handleShowEdit(data)}
                        /> */}
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          style={{ marginLeft: 20, color: "red" }}
                          onClick={() => handleShowDelete(data)}
                        />
                      </td>
                    </tr>
                  ))}
                </table>
              </Card.Body>
            </Card>
          </Tab>
          <Tab
            disabled
            eventKey="currency-history"
            title="ປະຫວັດການແບນເນີ"
            style={{ paddingTop: 20 }}
          >
            <Card
              border="secondary"
              bg="light"
              style={{ margin: 0, marginBottom: 20 }}
            >
              {" "}
              <Card.Header
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                <BsImages /> ປະຫວັດການແບນເນີ
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th>ຊື່ສະກຸນເງິນຫຼັກ</th>
                    <th>ຕົວຫຍໍ້ສະກຸນເງິນຫຼັກ</th>
                    <th>ເລດເງິນ</th>
                    <th>ຜູ້ແກ້ໄຂ</th>
                    <th>ເວລາແກ້ໄຂ</th>
                  </tr>
                  {currencyHistoryData?.map((e, i) => (
                    <tr>
                      <td className="text-left">{i + 1}</td>
                      <td className="text-left">{e?.currencyName}</td>
                      <td className="text-left">{e?.currencyCode}</td>
                      <td className="text-left">{e?.buy}</td>
                      <td className="text-left">{e?.createdBy?.userId}</td>
                      <td className="text-left">
                        {moment(e?.createdAt).format("DD/MM/YYYY LT")}
                      </td>
                    </tr>
                  ))}
                </table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* create */}
        <Modal
          show={showAdd}
          onHide={handleCloseAdd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>ເພີ່ມແບນເນີ</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
              image: "",
              storeId: getTokken?.DATA?.storeId ?? "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນ!";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _create(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Upload
                    src={values.src}
                    onChange={(e) => {
                      setFieldValue("image", e?.name);
                      setFieldValue("src", e?.url);
                    }}
                  />
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ແບນເນີ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder="ປ້ອນຊື່ສະກຸນເງິນ..."
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP_CANCEL,
                      color: "#ffff",
                    }}
                    onClick={handleCloseAdd}
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    ບັນທືກ
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* update */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>ແກ້ໄຂເລດເງິນ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              currencyName: dataUpdate?.currencyName,
              currencyCode: dataUpdate?.currencyCode,
              buy: dataUpdate?.buy,
              sell: dataUpdate?.sell,
              storeId: dataUpdate?.storeId,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.currencyName) {
                errors.currencyName = "ກະລຸນາປ້ອນ!";
              }
              if (!values.currencyCode) {
                errors.currencyCode = "ກະລຸນາປ້ອນ!";
              }
              if (!values.sell) {
                errors.sell = "ກະລຸນາປ້ອນ!";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("values", values);
              _update(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ສະກຸນເງິນ</Form.Label>
                    <Form.Control
                      type="text"
                      name="currencyName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.currencyName}
                      placeholder="ປ້ອນຊື່ສະກຸນເງິນ..."
                      isInvalid={!!errors.currencyName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.currencyName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຕົວຫຍໍ້ສະກຸນເງິນ</Form.Label>
                    <Form.Control
                      type="text"
                      name="currencyCode"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.currencyCode}
                      isInvalid={!!errors.currencyCode}
                      placeholder="ປ້ອນຕົວຫຍໍ້ສະກຸນເງິນ..."
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.currencyCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ເລດເງິນ</Form.Label>
                    <Form.Control
                      type="number"
                      name="sell"
                      // onChange={handleChange}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("buy", parseFloat(e.target.value));
                      }}
                      onBlur={handleBlur}
                      value={values.sell}
                      isInvalid={!!errors.sell}
                      placeholder="ປ້ອນເລດເງິນ..."
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sell}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP_CANCEL,
                      color: "#ffff",
                    }}
                    onClick={handleCloseEdit}
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    ບັນທືກ
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* delete */}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ</div>
              <div style={{ color: "red" }}>{`${dataDelete?.name}`}</div>
              <div>ແທ້ບໍ່ ?</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              ຍົກເລີກ
            </Button>
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _confirmeDelete()}
            >
              ຢືນຢັນການລົບ
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
