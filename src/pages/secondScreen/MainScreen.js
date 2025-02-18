import React, { useState, useEffect } from "react";
import { COLOR_APP, COLOR_APP_CANCEL, URL_PHOTO_AW3 } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card } from "react-bootstrap";
import { Formik } from "formik";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import Loading from "../../components/Loading";
import ImageSliderSecondSreen from "../../components/ImageSliderSecondSreen";
import {
  getImageSlide,
  createImageSlide,
  deleteImageSlide,
  UpdateImageSlide,
  UseImageSlide,
  UseShowSlide,
  UseShowTable,
  UseShowTitle,
  UseOpenTwoScreen,
} from "../../services/imageSlide";
import UploadMutiple from "../../components/UploadMutiple";
import { useTranslation } from "react-i18next";
import { useShiftStore } from "../../zustand/ShiftStore";
import {
  useSlideImageStore,
  useCombinedToggleSlide,
} from "../../zustand/slideImageStore";
import { useSecondScreenStore } from "../../zustand/useSecondScreenStore";

import { useStore } from "../../store";
import UploadMultipleEdit from "../../components/UploadMutipleEdit";
import PreviewSlide from "./PreviewSlide";

const MainScreen = () => {
  const [screenDetails, setScreenDetails] = useState(null);
  const [secondScreenWindow, setSecondScreenWindow] = useState(null);
  const { t } = useTranslation();
  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageSlideData, setImageSlideData] = useState([]);
  const [dataDelete, setDataDelete] = useState({});
  const [dataEdit, setDataEdit] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [images, setImages] = useState([]);
  const { shiftCurrent } = useShiftStore();
  const { profile } = useStore();

  const {
    isToggledSlide,
    isToggledTable,
    isToggled,
    isToggledOpenTwoScreen,
    toggleSlide,
    toggleTable,
    toggle,
  } = useCombinedToggleSlide();

  const { SettoggleOpenScreen, isToggledOpenScreen } = useSecondScreenStore();
  const { UseSlideImage } = useSlideImageStore();

  useEffect(() => {
    if ("getScreenDetails" in window) {
      window
        .getScreenDetails()
        .then((details) => {
          setScreenDetails(details);
        })
        .catch((error) => {
          console.error("Error fetching screen details:", error);
          errorAdd(
            "Unable to fetch screen details. Please check your browser permissions."
          );
        });
    } else {
      console.warn("Window Management API is not supported in this browser.");
      errorAdd(
        "Your browser does not support the Window Management API. Please use a supported browser like Chrome or Edge."
      );
    }

    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
      }
    };
    fetchData();
    getDataImageSlide();
  }, []);

  const openSecondScreen = () => {
    if ("getScreenDetails" in window) {
      // Use Window Management API
      window.getScreenDetails().then((details) => {
        // console.log("details", details.screens);
        if (details.screens.length > 1) {
          const secondScreen = details.screens[1];
          const newWindow = window.open(
            "/second-screen",
            "_blank",
            `left=${secondScreen.availLeft},top=${secondScreen.availTop},width=${secondScreen.availWidth},height=${secondScreen.availHeight}`
          );
          if (!newWindow) {
            errorAdd("Browser blocked the new window. Please allow pop-ups.");
          } else {
            setSecondScreenWindow(newWindow);
            SettoggleOpenScreen(newWindow);
            newWindow.postMessage("FULLSCREEN", "*");
          }
        } else {
          // Fallback for unsupported browsers
          const newWindow = window.open(
            "/second-screen",
            "_blank",
            "width=1366,height=768"
          );

          if (!newWindow) {
            errorAdd("Browser blocked the new window. Please allow pop-ups.");
          } else {
            setSecondScreenWindow(newWindow);
            SettoggleOpenScreen(newWindow);
            newWindow.postMessage("FULLSCREEN", "*");
          }
        }
      });
    } else {
      // Fallback for unsupported browsers
      const newWindow = window.open(
        "second-screen",
        "_blank",
        "width=1366,height=768"
      );

      if (!newWindow) {
        errorAdd("Browser blocked the new window. Please allow pop-ups.");
      } else {
        setSecondScreenWindow(newWindow);
        SettoggleOpenScreen(newWindow);
        newWindow.postMessage("FULLSCREEN", "*");
      }
    }
  };

  console.log("secondScreenWindow", secondScreenWindow);
  console.log("isToggledOpenScreen", isToggledOpenScreen[0]?.closed);

  const closeSecondScreen = () => {
    if (secondScreenWindow && !secondScreenWindow.closed) {
      secondScreenWindow.close();
      // setSecondScreenWindow(null);
      SettoggleOpenScreen(null);
    } else {
      // alert("Second screen is already closed");
      errorAdd("ຈໍທີ່ສອງປິດແລ້ວ!!! ກະລຸນາກວດສອບເບິ່ງອີກຄັ້ງ");
    }
  };

  useEffect(() => {
    if (screenDetails) {
      const handleScreenChange = () => {
        // console.log("Screen change detected");
        // console.log("All screens:", screenDetails.screens);
      };
      screenDetails.addEventListener("screenschange", handleScreenChange);
      return () =>
        screenDetails.removeEventListener("screenschange", handleScreenChange);
    }

    console.log("screenDetails", screenDetails);
  }, [screenDetails]);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
    setDataDelete(data);
    setShowDelete(true);
  };
  const handleShowEdit = (data) => {
    setDataEdit(data);
    setShowEdit(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  // useEffect(() => {

  //   // if (isToggledOpenTwoScreen) {
  //   //   openSecondScreen();
  //   // } else {
  //   //   closeSecondScreen();
  //   // }
  //   // handleOpenTwoScreen();
  //   // handleUseShowTitle();
  //   // handleUseShowTable();
  //   // handleUseShowSlide();
  // }, []);

  const getDataImageSlide = async () => {
    try {
      const { DATA } = await getLocalData();
      if (!DATA) return;

      setIsLoading(true);

      let findBy = `?storeId=${DATA.storeId}`;
      if (shiftCurrent?.length > 0 && shiftCurrent[0]?._id) {
        findBy += `&shiftId=${shiftCurrent[0]._id}`;
      }

      const data = await getImageSlide(findBy);

      if (!data || data.length === 0) {
        setImageSlideData([]);
        setImages([]);
        setIsLoading(false);
        return;
      }

      // 🔹 Extract Images Correctly
      const _images = data.flatMap((item) =>
        item.images.map(
          (e) =>
            `https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/medium/${e}`
        )
      );

      setImageSlideData(data);
      setImages(_images);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching image slides:", err);
      setIsLoading(false);
    }
  };

  const _create = async (values) => {
    const response = await createImageSlide(values);
    if (response?.data) {
      successAdd(`${t("add_data_success")}`);
      handleCloseAdd();
      getDataImageSlide();
    } else {
      errorAdd(`${t("add_fail")}`);
    }
  };
  const _update = async (values) => {
    const response = await UpdateImageSlide(
      dataEdit?._id,
      getTokken?.DATA?.storeId,
      shiftCurrent[0]?._id,
      values
    );
    if (response?.data) {
      successAdd(`${t("edit_success")}`);
      handleCloseEdit();
      getDataImageSlide();
    } else {
      errorAdd(`${t("edit_failed")}`);
    }
  };

  const _confirmeDelete = async () => {
    const respone = await deleteImageSlide(
      dataDelete?._id,
      getTokken?.DATA?.storeId,
      shiftCurrent[0]?._id
    );

    if (respone.data) {
      successAdd(`${t("delete_data_success")}`);
      handleCloseEdit();
      getDataImageSlide();
    } else {
      errorAdd(`${t("delete_data_fail")}`);
    }
  };

  // useEffect(() => {
  //   if (isToggledOpenTwoScreen) {
  //     openSecondScreen();
  //   } else {
  //     closeSecondScreen();
  //   }
  // }, [isToggledOpenTwoScreen]);

  const toggleOpenSlideToSecondScreen = async (e, id) => {
    const _type = e?.target?.checked;
    const isType = _type ? "true" : "false";

    try {
      const response = await UseImageSlide(
        id,
        getTokken?.DATA?.storeId,
        shiftCurrent[0]?._id,
        isType
      );
      if (response.data) {
        getDataImageSlide();
      }
    } catch (error) {
      if (error?.response?.data?.type) {
        errorAdd("ກະລຸນາປິດສະໄລສ໌ທີ່ເປີດໃຊ້ງານຢູ່");
      } else {
        errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງານສະໄລສ໌ນີ້ໄດ້");
      }
    }
  };

  const handleUseShowSlide = async (e) => {
    const _type = e?.target?.checked;

    const isType = _type ? "true" : "false";

    try {
      const response = await UseShowSlide(
        getTokken?.DATA?.storeId,
        shiftCurrent[0]?._id,
        isType
      );

      if (response.data) {
        getDataImageSlide();
      }
    } catch (error) {
      errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງໄດ້");
    }
  };
  const handleUseShowTable = async (e) => {
    const _type = e?.target?.checked;
    const isType = _type ? "true" : "false";
    try {
      const response = await UseShowTable(
        getTokken?.DATA?.storeId,
        shiftCurrent[0]?._id,
        isType
      );

      if (response.data) {
        getDataImageSlide();
      }
    } catch (error) {
      errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງໄດ້");
    }
  };
  const handleUseShowTitle = async (e) => {
    const _type = e?.target?.checked;
    const isType = _type ? "true" : "false";
    try {
      const response = await UseShowTitle(
        getTokken?.DATA?.storeId,
        shiftCurrent[0]?._id,
        isType
      );

      if (response.data) {
        getDataImageSlide();
      }
    } catch (error) {
      errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງໄດ້");
    }
  };
  const handleOpenTwoScreen = async (e) => {
    const _type = e?.target?.checked;
    const isType = _type ? "true" : "false";
    try {
      const response = await UseOpenTwoScreen(
        getTokken?.DATA?.storeId,
        shiftCurrent[0]?._id,
        isType
      );

      if (response.data) {
        if (response?.data?.data?.isOpenSecondScreen) {
          openSecondScreen();
        } else {
          closeSecondScreen();
        }

        getDataImageSlide();
      }
    } catch (error) {
      errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງໄດ້");
    }
  };

  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     if (event.data.type === "SECOND_SCREEN_CLOSED") {
  //       toggleSecondScreen(); // Close the second screen in the Zustand state
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, [toggleSecondScreen]);

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("manage_second_screen")}</Breadcrumb.Item>
        </Breadcrumb>

        <Tabs defaultActiveKey="currency-list">
          <Tab
            eventKey="currency-list"
            title={t("list_slide_second_screen")}
            style={{ paddingTop: 20 }}
          >
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
                <div className="flex gap-2 items-center">
                  <BsImages />
                  <span>{t("list_slide_second_screen")}</span>
                </div>
                <Button variant="dark" bg="dark" onClick={handleShowAdd}>
                  <span className="flex gap-2 items-center">
                    <MdAssignmentAdd /> <span>{t("add_slide")}</span>
                  </span>
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>{t("no")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("image_slide")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("name_slide")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("status")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                  </tr>
                  {imageSlideData?.map((data, index) => (
                    <tr key={data?._id}>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {index + 1}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        <div
                          style={{
                            width: 200,
                            height: 100,
                            border: "1px solid #ccc",
                          }}
                        >
                          <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                              delay: 2500,
                              disableOnInteraction: false,
                            }}
                            pagination={{
                              clickable: true,
                            }}
                            // navigation={true}
                            modules={[Autoplay, Pagination]}
                            className="mySwiper"
                          >
                            {data?.images.map((item) => (
                              <SwiperSlide key={item}>
                                <img
                                  src={`${URL_PHOTO_AW3}${item}`}
                                  alt="placeholder"
                                  className="w-[200px] h-[100px] object-cover"
                                />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {data?.name}
                      </td>
                      <td>
                        <div className="flex justify-start items-center gap-2">
                          <Form.Label htmlFor={"switch-isPublished"}>
                            {data?.isPublished === UseSlideImage?.isPublished
                              ? t("oppen")
                              : t("close")}
                          </Form.Label>
                          <Form.Check
                            type="switch"
                            checked={
                              data?.isPublished === UseSlideImage?.isPublished
                            }
                            id={`switch-${index}`}
                            onChange={(e) =>
                              toggleOpenSlideToSecondScreen(e, data._id)
                            }
                          />
                        </div>
                      </td>
                      <td className="flex justify-start items-center pt-5 gap-2">
                        <Button onClick={() => handleShowDelete(data)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                        <Button onClick={() => handleShowEdit(data)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </table>
              </Card.Body>
            </Card>
          </Tab>
          <Tab
            eventKey="currency-list-1"
            title={t("ex_manage")}
            style={{ paddingTop: 20 }}
          >
            <div
              // style={{
              //   display: "grid",
              //   gridTemplateColumns: "1fr 1fr",
              //   gridGap: 10,
              //   gap: 10,
              // }}
              className="grid gap-2 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 dmd:grid-cols-1 md:grid-cols-1 sm:grid-cols-1"
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
                  <div className="flex gap-1 items-center">
                    <BsImages /> <span>{t("tool")}</span>
                  </div>
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
                    <div>{t("open_seconde_screen")}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label htmlFor={"switch-open"}>
                        {isToggledOpenTwoScreen ? t("oppen") : t("close")}
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        checked={isToggledOpenTwoScreen}
                        id={"switch-open"}
                        // onChange={(e) => toggleOpen(e)}
                        onChange={(e) => handleOpenTwoScreen(e)}
                      />
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
                    <div>{t("show_title")}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label htmlFor={"switch-audio-"}>
                        {isToggled ? t("oppen") : t("close")}
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        checked={isToggled}
                        id={"switch-title"}
                        // onChange={toggle}
                        onChange={(e) => handleUseShowTitle(e)}
                      />
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
                    <div>{t("show_slide")}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label htmlFor={"switch-slide"}>
                        {isToggledSlide ? t("oppen") : t("close")}
                      </Form.Label>
                      <Form.Check
                        // disabled={true}
                        type="switch"
                        checked={isToggledSlide}
                        id={"slide"}
                        // onChange={toggleSlide}
                        onChange={(e) => handleUseShowSlide(e)}
                      />
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
                    <div>{t("show_table")}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label htmlFor={"switch-table"}>
                        {isToggledTable ? t("oppen") : t("close")}
                      </Form.Label>
                      <Form.Check
                        // disabled={true}
                        type="switch"
                        checked={isToggledTable}
                        id={"table"}
                        // onChange={toggleTable}
                        onChange={(e) => handleUseShowTable(e)}
                      />
                    </div>
                  </div>
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
                  <div className="flex gap-1 items-center">
                    <BsImages /> <span>{t("ex")}</span>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="flex justify-center ">
                    <PreviewSlide />
                  </div>
                  {/* <ImageSliderSecondSreen images={images} /> */}
                </Card.Body>
              </Card>
            </div>
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
            <Modal.Title>{t("add_slide")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
              images: "",
              storeId: getTokken?.DATA?.storeId ?? "",
              shiftId: shiftCurrent[0]?._id ?? "",
              createdBy: profile?.data?._id ?? "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = `${t("name_slide")}`;
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
                  <UploadMutiple
                    src={values.src}
                    onChange={(e) => {
                      setFieldValue("images", e?.names);
                      setFieldValue("src", e?.urls);
                    }}
                  />
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("name_slide")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={t("name_slide")}
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
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Edit */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit_slide")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              name: dataEdit?.name,
              images: dataEdit?.images,
              src: dataEdit?.src,
              storeId: getTokken?.DATA?.storeId ?? "",
              shiftId: shiftCurrent[0]?._id ?? "",
              createdBy: profile?.data?._id ?? "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = `${t("name_slide")}`;
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
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
                  <UploadMultipleEdit
                    src={values.images}
                    onChange={(e) => {
                      setFieldValue("images", e?.names);
                      setFieldValue("urls", e?.urls);
                    }}
                  />
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("name_slide")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={t("name_slide")}
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
                    onClick={handleCloseEdit}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
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
            <div
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>{t("sure_to_delete_data")}</div>
              <div
                style={{ color: "red", margin: "0 5px" }}
              >{`${dataDelete?.name}`}</div>
              <div>{t("realy")} ?</div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _confirmeDelete()}
            >
              {t("confirm")}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
};

export default MainScreen;
