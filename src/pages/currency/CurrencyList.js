import React, { useEffect, useState } from "react";
import AnimationLoading from "../../constants/loading";
import { BODY, COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import { CREATE_CURRENCY, DELETE_CURRENCY, END_POINT_SEVER, QUERY_CURRENCIES, UPDATE_CURRENCY, getLocalData } from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { moneyCurrency } from "../../helpers";

export default function CurrencyList() {
  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  const handleShowEdit = (data) => {
    setDataUpdate(data)
    setShowEdit(true)
  }
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
    setDataDelete(data)
    setShowDelete(true)
  }
  const handleCloseDelete = () => setShowDelete(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
      }
    };
    fetchData();
    getDataCurrency()
  }, []);

  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const data = await Axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status == 200) {
          setCurrencyData(data?.data?.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _create = async (values) => {
    await Axios({
      method: "POST",
      url: CREATE_CURRENCY,
      headers: getTokken?.TOKEN,
      data: values
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
          handleCloseAdd();
          getDataCurrency();
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
      data: values
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
          handleCloseEdit();
          getDataCurrency();
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
      url: `${DELETE_CURRENCY}/${dataDelete?._id}`,
      headers: getTokken?.TOKEN,
    })
      .then(async function (response) {
        if (response?.status === 200) {
          successAdd("ລົບຂໍ້ມູນສຳເລັດ");
          handleCloseDelete();
          getDataCurrency();
        }
      })
      .catch(function (error) {
        errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
      });
  };

  return (
    <div>
      {isLoading ? <AnimationLoading /> : 
        <div>
          <div style={BODY}>
            <div className="row" style={{ padding: 30 }}>
              <div className="col-md-12" style={{ fontSize: "20px" }}>
                ຈຳນວນເລດເງິນ
              </div>
            </div>
            <div style={{ paddingBottom: 20 }}>
              <div className="col-md-12">
                <button
                  type="button"
                  className="btn btn-app col-2 "
                  style={{
                    float: "right",
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                  }}
                  onClick={handleShowAdd}
                >
                  {" "}
                  ເພີ່ມ{" "}
                </button>
              </div>
            </div>

            <div style={{ height: 40 }}></div>
            <div>
              <div className="col-sm-12">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>#</th>
                      <th>ຊື່ສະກຸນເງິນ</th>
                      <th>ຕົວຫຍໍ້ສະກຸນເງິນ</th>
                      <th>ເລດເງິນ</th>
                      <th>ຈັດການຂໍ້ມູນ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencyData?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-left">
                            {index + 1}
                          </td>
                          <td className="text-left">{data?.currencyName}</td>
                          <td className="text-left">{data?.currencyCode}</td>
                          <td className="text-left">{moneyCurrency(data?.sell)}</td>
                          <td className="text-left">
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP }}
                              onClick={() => handleShowEdit(data)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ marginLeft: 20, color: "red" }}
                              onClick={() =>
                                handleShowDelete(data)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }

      {/* create */}
      <Modal
        show={showAdd}
        onHide={handleCloseAdd}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມເລດເງິນ</Modal.Title>
        </Modal.Header>
        <Formik
          enableReinitialize
          initialValues={{
            currencyName: "",
            currencyCode: "",
            buy: "",
            sell: "",
            storeId: getTokken?.DATA?.storeId ?? "",
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
                    onChange={e => {
                      handleChange(e)
                      setFieldValue('buy', parseFloat(e.target.value))
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
                  style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
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
            console.log("values", values)
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
                    onChange={e => {
                      handleChange(e)
                      setFieldValue('buy', parseFloat(e.target.value))
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
                  style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
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
            <div>ທ່ານຕ້ອງການລົບສະກຸນເງິນ</div>
            <div style={{ color: "red" }}>{`${dataDelete?.currencyName} (${dataDelete?.currencyCode})`}</div>
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
    </div>
  );
}
