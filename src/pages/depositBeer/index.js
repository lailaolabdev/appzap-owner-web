/** @format */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik } from 'formik';
import ReactToPrint from "react-to-print";
import { Button, Modal, Form } from "react-bootstrap";
import { STATUS_BEERFAK, formatDateDay, formatDateNow, formatDateTime, generateRandomTextAndNumber } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  END_POINT_SEVER,
  getLocalData,
} from "../../constants/api";
import { successAdd, warningAlert } from "../../helpers/sweetalert";
import { ComponentToPrintBill } from "./billBeerFak";

export default function DepositBeer() {
  const componentRef = useRef();
  let _randomCode = generateRandomTextAndNumber(15)
  const [startDate, setStartDate] = useState(formatDateNow(new Date()));
  const [endDate, setEndDate] = useState(formatDateNow(new Date()));
  const [seletedOrderItem, setSeletedOrderItem] = useState();
  const [menuCreate, setmenuCreate] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [dataBeerFaks, setDataBeerFaks] = useState([]);
  const [dataBeerFaksSelect, setDataBeerFaksSelect] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setMenuData()
    setShow(true)
  };
  const [confirme, setConfirme] = useState(false);

  const [showDetail, setShowDetail] = useState(false);
  const handleCloseDetail = () => setShowDetail(false);
  const handleShowDetail = (data) => {
    setDataBeerFaksSelect(data);
    setShowDetail(true);
  };
  const handleCloseConfirme = () => setConfirme(false);
  const handleShowConf = (status, data) => {
    setDataBeerFaksSelect({ ...data, statusForUpdate: status })
    setConfirme(true);
  };



  function handleSetQuantity(int, seletedOrderItem) {
    let _data = seletedOrderItem?.quantity + int;
    if (_data > 0) {
      setSeletedOrderItem({ ...seletedOrderItem, quantity: _data });
    }
  }

  useEffect(() => {
    _getDatas();
  }, []);

  const _getDatas = async () => {
    const { DATA, TOKEN } = await getLocalData();
    let _data = await axios({
      method: "get",
      url: `${END_POINT_SEVER}/v3/beer-faks/` + DATA?.storeId,
      headers: TOKEN,
    });
    if (_data?.data) {
      setDataBeerFaks(_data?.data);
    }
  };

  const _updadteStatus = async () => {
    const { TOKEN } = await getLocalData();
    let _update = await axios({
      method: "put",
      url: `${END_POINT_SEVER}/v3/beer-fak/` + dataBeerFaksSelect?._id,
      data: {
        "status": dataBeerFaksSelect?.statusForUpdate
      },
      headers: TOKEN,
    });
    if (_update?.data?.message === "UPDATE_SUCCESS") {
      _getDatas()
      handleCloseConfirme()
      successAdd("ອັບເດດສຳເລັດ")
    }
  };
  const _create = async (data) => {
    const { TOKEN, DATA } = await getLocalData();
    let _update = await axios({
      method: "post",
      url: `${END_POINT_SEVER}/v3/beer-fak`,
      data: {
        "storeId": DATA?.storeId,
        "billCode": _randomCode,
        "customerName": data?.customerName,
        "menu": menuData,
        "amount": menuData?.length,
        "startDate": data?.startDate,
        "endDate": data?.endDate,
        "status": "WAITING"
      },
      headers: TOKEN,
    });
    if (_update?.data) {
      _getDatas()
      handleClose()
      successAdd("ສຳເລັດ")
    }
  };
  const _fineMenuForCreateBill = async () => {
    let _menu = menuData ? [...menuData] : [];
    const { DATA, TOKEN } = await getLocalData();
    let _data = await axios({
      method: "get",
      url: `${END_POINT_SEVER}/v3/menus/?storeId=` + DATA?.storeId + "&name=" + menuName,
      headers: TOKEN,
    });
    if (_data?.data?.length > 0) {
      _menu?.push({
        menuId: _data?.data[0]?._id,
        name: _data?.data[0]?.name,
        qty: 1
      })
      setMenuData(_menu);
      return
    }
    warningAlert("ບໍ່ມີລາຍການນີ້")
    return

  };
  let _onDeleteMenu = (dataIndex) => {
    let _fileter = menuData?.filter((data, index) => index !== dataIndex)
    setMenuData(_fileter)
  }



  return (
    <div>
      <div
        style={{
          padding: 40,
          display: "flex",
          justifyItems: "end",
          justifyContent: "end",
        }}>
        <Button variant='primary' onClick={() => handleShow()}>
          ເປີດບີນຝາກເບຍ
        </Button>
      </div>
      <div style={{ paddingLeft: 40, paddingRight: 40 }}>
        <h4>ນຳນວນທັ້ງໝົດ ( {dataBeerFaks?.tatol} )</h4>
        <table className='table'>
          <thead className='thead-dark' style={{ textAlign: "center" }}>
            <tr>
              <th>#</th>
              <th scope='col'>ເລກທີບີນຝາກ</th>
              <th scope='col'>ຊື່ລູກຄ້າ</th>
              <th scope='col'>ສະຖານະ</th>
              <th scope='col'>ວັນທີຝາກເບຍ</th>
              <th scope='col'>ກຳນົດຝາກ</th>
              <th scope='col'>ວັນທີສ້າງ</th>
              <th scope='col'>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {dataBeerFaks?.data?.map((item, index) => (
              <tr >
                <th scope='row' onClick={() => handleShowDetail(item)}>{index + 1}</th>
                <td onClick={() => handleShowDetail(item)}>{item?.billCode}</td>
                <td onClick={() => handleShowDetail(item)}>{item?.customerName}</td>
                <td onClick={() => handleShowDetail(item)}>{STATUS_BEERFAK(item?.status)}</td>
                <td onClick={() => handleShowDetail(item)}>{formatDateDay(item?.startDate)}</td>
                <td onClick={() => handleShowDetail(item)}>{formatDateDay(item?.endDate)}</td>
                <td onClick={() => handleShowDetail(item)}>
                  <div>
                    {item?.createdBy?.firstname +
                      " " +
                      item?.createdBy?.lastname}
                  </div>
                  <div>{formatDateDay(item?.createdAt)}</div>
                </td>
                <td>
                  <Button variant='secondary' onClick={() => handleShowConf("CANCEL", item)} disabled={item?.status !== "WAITING" ? true : false}>
                    ຍົກເລີກ
                  </Button>
                  <Button variant='primary' onClick={() => handleShowConf("SUCCESS", item)} disabled={item?.status !== "WAITING" ? true : formatDateDay(formatDateNow(new Date())) > formatDateDay(item?.endDate) ? true : false}>
                    ເບີກເຄືອງ
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ==== */}

      <Modal show={showDetail} size='lg' onHide={handleCloseDetail}>
        <Modal.Header closeButton>
          <Modal.Title>ບີນຝາກເບຍ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>ເລກທີບີນຝາກ : {dataBeerFaksSelect?.billCode}</p>
            <p>ຊື່ລູກຄ້າ : {dataBeerFaksSelect?.customerName}</p>
            <p>
              ວັນທີຝາກເບຍ {formatDateDay(dataBeerFaksSelect?.startDate)}: ,
              ກຳນົດຝາກ : {formatDateDay(dataBeerFaksSelect?.endDate)}
            </p>
            <p>ສະຖານະ : {STATUS_BEERFAK(dataBeerFaksSelect?.status)}</p>
            <p>ຈຳນວນເມນູທັ້ງໝົດ : {dataBeerFaksSelect?.menu?.length}</p>
            <table className='table' striped bordered hover>
              <thead className='thead-dark' style={{ textAlign: "center" }}>
                <tr>
                  <th>#</th>
                  <th>ຊື່ສີນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                </tr>
              </thead>
              <tbody>
                {dataBeerFaksSelect?.menu?.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.name}</td>
                    <td>{item?.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ justifyContent: "center", display: "flex" }}>
              {/* <Button variant='primary' onClick={handleClose}>
                Print
              </Button> */}
               <Form.Group className="mt-4" controlId="formBasicEmail">
                  <ReactToPrint
                    trigger={() => (
                      <div>
                        <Button
                          className="col-12"
                          id="btnPrint"
                          style={{
                            color: "#476fbc",
                            border: "2px solid #476fbc",
                            borderRadius: 8,
                            backgroundColor: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          <FontAwesomeIcon icon={faPrint} /> {"  "}ພີມບິນ
                        </Button>
                      </div>
                    )}
                    content={() => componentRef.current}
                  />
                </Form.Group>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* ==== */}
      <Modal show={show} size='lg' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ເປີດບີນຝາກເບຍ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            billCode: _randomCode,
            customerName: '',
            startDate: startDate,
            endDate: endDate,
            status: "WAITING"
          }}
          validate={values => {
            const errors = {};
            if (!values.billCode) {
              errors.billCode = 'Required';
            }
            return errors;
          }}
          onSubmit={(values) => {
            _create(values)
            console.log("🚀 ~ file: index.js:218 ~ DepositBeer ~ values:", values)
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div>
                  <Form>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                      <Form.Label>ເລກທີບີນຝາກ</Form.Label>
                      <Form.Control
                        type='text'
                        name="billCode"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.billCode}
                        placeholder='ເລກທີບີນຝາກ' />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                      <Form.Label>ຊື່ລູກຄ້າ</Form.Label>
                      <Form.Control
                        type='text'
                        name="customerName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.customerName}
                        placeholder='ຊື່ລູກຄ້າ' />
                    </Form.Group>
                    <div style={{ display: "flex" }}>
                      <Form.Group
                        className='mb-3 col-6'
                        controlId='formBasicPassword'>
                        <Form.Label>ວັນທີຝາກເບຍ</Form.Label>
                        <Form.Control
                          type='date'
                          name="startDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.startDate}
                          defaultValue={startDate}
                          placeholder='ວັນທີຝາກເບຍ'
                        />
                      </Form.Group>
                      <Form.Group
                        className='mb-3 col-6'
                        controlId='formBasicPassword'>
                        <Form.Label>ກຳນົດຝາກ</Form.Label>
                        <Form.Control
                          type='date'
                          name="endDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.endDate}
                          defaultValue={endDate}
                          placeholder='ກຳນົດຝາກ'
                        />
                      </Form.Group>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Form.Group
                        className='mb-3 col-6'
                        controlId='formBasicPassword'>
                        <Form.Label>ຊື່ເມນູອາຫານ</Form.Label>
                        <Form.Control
                          type='text'
                          onChange={(e) => setMenuName(e?.target?.value)}
                          placeholder='ຊື່ເມນູອາຫານ' />
                      </Form.Group>
                      <Form.Group
                        className='mb-3 col-6'
                        controlId='formBasicPassword'
                        style={{ padding: 32 }}>
                        <Button
                          variant='secondary'
                          onClick={() => _fineMenuForCreateBill()}
                        >
                          ຄົ້ນຫາເມນູ
                        </Button>
                      </Form.Group>
                    </div>
                  </Form>
                  <table className='table' striped bordered hover>
                    <thead className='thead-dark' style={{ textAlign: "center" }}>
                      <tr>
                        <th>#</th>
                        <th>ຊື່ສີນຄ້າ</th>
                        <th>ຈຳນວນ</th>
                        <th>ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuData?.map((item, index) =>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.name}</td>
                          <td
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            <button
                              style={{ color: "blue", border: "none", width: 25 }}
                              onClick={() => handleSetQuantity(-1, seletedOrderItem)}>
                              -
                            </button>
                            {item?.qty ? 1 : 0}
                            <button
                              style={{ color: "red", border: "none", width: 25 }}
                              onClick={() => handleSetQuantity(1, seletedOrderItem)}>
                              +
                            </button>
                          </td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className='delete-img'
                              onClick={() => _onDeleteMenu(index)}
                              style={{ color: "red", cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button variant='success' onClick={() => handleSubmit()}>
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      {/* ==== */}
      <Modal show={confirme} onHide={handleCloseConfirme}>
        <Modal.Header closeButton>
          <Modal.Title>ອັບເດດສະຖານະເປັນ : {STATUS_BEERFAK(dataBeerFaksSelect?.statusForUpdate)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>ທ່ານຕ້ອງການອັບເດດບີນນີ້ບໍ : </div>
            <div style={{ color: "red" }}>( {dataBeerFaksSelect?.billCode} ) </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseConfirme()}>
            ຍົກເລີກ
          </Button>
          <Button variant="primary" onClick={() => _updadteStatus()}>
            ອັບເດດສະຖານະ
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ display: "none" }}>
        <ComponentToPrintBill
          ref={componentRef}
          data={dataBeerFaksSelect}
        />
      </div>
    </div>
  );
}
