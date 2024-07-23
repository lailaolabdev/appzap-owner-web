import React, { useEffect, useState } from "react";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card } from "react-bootstrap";
import { Formik } from "formik";
import {
  END_POINT_SEVER,
  getLocalData,
} from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { getBanners } from "../../services/banner";
import Upload from "../../components/Upload";
import { useTranslation } from "react-i18next";

export default function BannerList() {
  const { t } = useTranslation();
  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [images, setImages] = useState([]);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);


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
        const _images = data.map(
          (e) =>
            "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/medium/" +
            e?.image
        );
        setImages(_images);
        console.log(_images)

        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _create = async (values) => {
    console.log("values", values);
    await Axios({
      method: "POST",
      url: END_POINT_SEVER + "/v4/banner/create",
      headers: getTokken?.TOKEN,
      data: values,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd(`${t('add_data_success')}`);
          handleCloseAdd();
          getDataBanner();
        }
      })
      .catch(function (error) {
        console.log("error", error);
        errorAdd(`${t('add_data_fail_crc_existed')}`);
      });
  };

  const _confirmeDelete = async () => {
    await Axios({
      method: "DELETE",
      url: `${END_POINT_SEVER}/v4/banner/delete/${dataDelete?._id}`,
      headers: getTokken?.TOKEN,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd(`${t('delete_data_success')}`);
          handleCloseDelete();
          getDataBanner();
        }
      })
      .catch(function (error) {
        errorAdd(`${t('delete_data_fail')}`);
      });
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t('setting')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t('manage_banner')}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          <Tab
            eventKey="currency-list"
            title={t('banner_list')}
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
                  <BsImages /> {t('ex')}
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
                  <BsImages /> {t('tool')}
                </Card.Header>
                <Card.Body>
                  {[
                    {
                      title: `${t('enable_banner')}`,
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
                          {t('oppen')}
                          {/* {audioSetting?.[item?.key] ? "ເປີດ" : "ປິດ"} */}
                        </Form.Label>
                        <Form.Check
                          disabled={item?.disabled}
                          type="switch"
                          checked={true}
                          id={"switch-audio-" + item?.key}
                          onChange={(e) => { }}
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
                  <BsImages /> {t('banner_list')}
                </span>
                <Button variant="dark" bg="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t('add_banner')}
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th>{t('banner_image')}</th>
                    <th>{t('banner_name')}</th>
                    <th>{t('status')}</th>
                    <th>{t('manage_data')}</th>
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
                      <td className="text-left">{t('oppen')}</td>
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
            title={t('banner_history')}
            style={{ paddingTop: 20 }}
          >

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
            <Modal.Title>{t('add_banner')}</Modal.Title>
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
                errors.name = `${t('please_fill')}`;
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
                    <Form.Label>{t('banner_name')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={t('fill_banner')}
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
                    {t('cancel')}
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    {t('save')}
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
              <div>{t('sure_to_delete_data')}</div>
              <div style={{ color: "red" }}>{`${dataDelete?.name}`}</div>
              <div>{t('realy')} ?</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t('cancel')}
            </Button>
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _confirmeDelete()}
            >
              {t('confirm')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
