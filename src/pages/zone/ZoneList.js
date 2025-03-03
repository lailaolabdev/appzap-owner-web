import React, { useEffect, useState } from "react";
import Box from "../../components/Box";
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Modal,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTh, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { MdAssignmentAdd } from "react-icons/md";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { Formik } from "formik";
import { END_POINT_SEVER } from "../../constants/api";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getHeaders } from "../../services/auth";
import ReactPaginate from "react-paginate";

import { useStoreStore } from "../../zustand/storeStore";

export default function ZoneList() {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { storeDetail } = useStoreStore();
  const limitData = 10;
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);

  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [zoneData, setZoneData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    getHeaderInfo();
  }, []);

  const getHeaderInfo = async () => {
    const header = await getHeaders();
    if (header) {
      setToken(header?.authorization);
    }
  };

  useEffect(() => {
    if (token) {
      getDataZone();
    }
  }, [token, pagination]);

  const getDataZone = async () => {
    try {
      setIsLoading(true);
      const data = await Axios.get(`${END_POINT_SEVER}/v3/zones`, {
        params: {
          storeId: storeDetail?._id,
          skip: (pagination - 1) * limitData,
          limit: limitData,
        },
        headers: {
          Authorization: token,
        },
      });
      if (data?.status == 200) {
        setZoneData(data?.data?.data);
        setTotalPagination(Math.ceil(data?.data?.total / limitData));
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

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

  const _create = async (values) => {
    try {
      setIsLoading(true);
      const data = await Axios.post(`${END_POINT_SEVER}/v3/zone`, values, {
        headers: {
          Authorization: token,
        },
      });
      if (data?.status == 200) {
        setIsLoading(false);
        handleCloseAdd();
        getDataZone();
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _update = async (values, id) => {
    try {
      setIsLoading(true);
      const data = await Axios.put(`${END_POINT_SEVER}/v3/zone/${id}`, values, {
        headers: {
          Authorization: token,
        },
      });
      if (data?.status == 200) {
        setIsLoading(false);
        handleCloseEdit();
        getDataZone();
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _delete = async () => {
    try {
      setIsLoading(true);
      const data = await Axios.delete(
        `${END_POINT_SEVER}/v3/zone/${dataDelete?._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data?.status == 200) {
        setIsLoading(false);
        handleCloseDelete();
        getDataZone();
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  return (
    <Box
      sx={{ padding: { md: 20, xs: 10 } }}
      style={{
        maxHeight: "100vh",
      }}
    >
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => navigate(`/settingStore/${params?.id}`)}
        >
          {t("setting")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t("zone_setting")}</Breadcrumb.Item>
      </Breadcrumb>

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
            <FontAwesomeIcon icon={faTh} /> {t("zone_list")}
          </span>
          <Button
            variant="dark"
            bg="dark"
            onClick={handleShowAdd}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <MdAssignmentAdd />
            {t("fill_zone")}
          </Button>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div
              style={{
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <table className="w-100">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("name")}</th>
                  <th>{t("manage")}</th>
                </tr>
              </thead>
              <tbody>
                {zoneData?.map((item, index) => (
                  <tr key={index}>
                    <td>{(pagination - 1) * limitData + index + 1}</td>
                    <td>{item?.name}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: COLOR_APP }}
                        onClick={() => handleShowEdit(item)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{ marginLeft: 20, color: "red" }}
                        onClick={() => handleShowDelete(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            bottom: 20,
          }}
        >
          <ReactPaginate
            previousLabel={
              <span className="glyphicon glyphicon-chevron-left">{`${t(
                "previous"
              )}`}</span>
            }
            nextLabel={
              <span className="glyphicon glyphicon-chevron-right">{`${t(
                "next"
              )}`}</span>
            }
            breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
            breakClassName={"break-me"}
            pageCount={totalPagination} // Replace with the actual number of pages
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={(e) => {
              setPagination(e?.selected + 1);
            }}
            containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
          />
        </div>
      </Card>

      {/* create */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>{t("fill_zone")}</Modal.Title>
        </Modal.Header>
        <Formik
          enableReinitialize
          initialValues={{
            name: "",
            storeId: params?.id ?? "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("please_fill")}`;
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
                <Form.Group>
                  <Form.Label>{t("name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    isInvalid={!!errors.name}
                    placeholder={t("please_fill")}
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

      {/* update */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit_zone")}</Modal.Title>
        </Modal.Header>
        <Formik
          enableReinitialize
          initialValues={{
            name: dataUpdate?.name,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("please_fill")}`;
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _update(values, dataUpdate?._id);
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
                <Form.Group>
                  <Form.Label>{t("name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    isInvalid={!!errors.name}
                    placeholder={t("please_fill")}
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
            <div>{t("sure_to_delete_zone")}</div>
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
            onClick={() => _delete()}
          >
            {t("confirm_delect")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
}
