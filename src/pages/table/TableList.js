import React, { useEffect, useState, useRef } from "react";
import useReactRouter from "use-react-router";
import { Row, Modal, Form, Container, Button, Nav, Col, Table } from "react-bootstrap";
import { Checkbox } from "@material-ui/core";
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faArchway,
  faCheckCircle,
  faFileInvoice,
  faRetweet,
  faWindowClose,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'

import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from 'axios';

/**
 * component
 * */
import Loading from "../../components/Loading";
import UserCheckoutModal from "./components/UserCheckoutModal";
import OrderCheckOut from "./components/OrderCheckOut";
import UpdateDiscountOrder from "./components/UpdateDiscountOrder";
import FeedbackOrder from "./components/FeedbackOrder";
import { orderStatus, moneyCurrency } from "../../helpers";
import { BillForChef } from '../bill/BillForChef';
import { BillForCheckOut } from '../bill/BillForCheckOut';
import { STORE } from '../../constants/api'

/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  half_backgroundColor,
  padding_white,
  CANCEL_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
} from "../../constants/index";
import { useStore } from "../../store";
import { END_POINT_SEVER } from '../../constants/api'
import {
  successAdd,
  errorAdd,
  warningAlert
} from "../../helpers/sweetalert"
import { getHeaders } from "../../services/auth";


export default function TableList() {
  const { history, match } = useReactRouter();
  const componentRef = useRef();
  const componentRefA = useRef();
  const number = match?.params?.number;
  const activeTableId = match?.params?.tableId;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [openModalSetting, setOpenModalSetting] = useState(false)
  const [dataSettingModal, setDataSettingModal] = useState()
  const [feedbackOrderModal, setFeedbackOrderModal] = useState(false)

  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [CheckStatus, setCheckStatus] = useState()
  const [CheckStatusCancel, setCheckStatusCancel] = useState()
  const [dataBill, setDataBill] = useState()
  const [modalAddDiscount, setModalAddDiscount] = useState(false)
  /**
 * useState
 */
  const {
    isTableOrderLoading,
    orderItemForPrintBill,
    tableList,
    setTableList,
    selectedTable,
    setSelectedTable,
    openTable,
    tableOrderItems,
    getTableDataStore,
    onSelectTable,
    onChangeMenuCheckbox,
    handleUpdateTableOrderStatus,
    resetTableOrder
  } = useStore();


  useEffect(() => {
    getTableDataStore()
  }, [])
  /**
   * Modify Order Status
   */
  useEffect(() => {
    if (!tableOrderItems) return;
    let _tableOrderItems = [...tableOrderItems]
    let _checkDataStatus = []
    let _checkDataStatusCancel = []
    _tableOrderItems.map((nData) => {
      if (nData.status === "SERVED") _checkDataStatus.push(nData?.status)
      if (nData.status === "CANCELED") _checkDataStatusCancel.push(nData?.status)
    })
    setCheckStatusCancel(_checkDataStatusCancel)
    setCheckStatus(_checkDataStatus)
  }, [tableOrderItems])
  const _handlecheckout = async () => {
    setCheckoutModal(false);
    history.push(`/tables/pagenumber/${number}/tableid/${activeTableId}/${match?.params?.storeId}`);
  };
  const _orderIsChecked = () => {
    let isIncluded = tableOrderItems.filter((item) => item.isChecked)
    return isIncluded.length == 0;
  }
  const _onCheckOut = async () => {
    setMenuItemDetailModal(true);
  };
  const _onAddDiscount = async () => {
    setModalAddDiscount(true);
  };
  const _goToAddOrder = (tableId, code) => {
    history.push(`/addOrder/tableid/${tableId}/code/${code}`);
  }
  const convertTableStatus = (_table) => {
    if (_table?.isOpened && _table?.isStaffConfirm) return <div style={{ color: "green" }}>ເປີດແລ້ວ</div>
    else if (_table?.isOpened && !_table?.isStaffConfirm) return <div style={{ color: "#fff" }}>ລໍຖ້າຢືນຢັນ</div>
    else if (!_table?.isOpened && !_table?.isStaffConfirm) return <div style={{ color: "#eee" }}>ວ່າງ</div>
    else return "-"
  }

  useEffect(() => {
    if (tableOrderItems?.length > 0) {
      getData(tableOrderItems[0]?.code)
    }
  }, [tableOrderItems])

  const getData = async (code) => {
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    const _resBill = await axios({
      method: 'get',
      url: END_POINT_SEVER + `/v3/bill-group/` + code,
      headers: headers
    })
    setDataBill(_resBill?.data)
  }
  
  const [codeTableNew, setCodeTableNew] = useState()

  const _changeTable = async () => {
    if (!codeTableNew) {
      handleClose()
      await Swal.fire({
        icon: 'warning',
        title: "ກະລຸນາເລືອກໂຕະ",
        showConfirmButton: false,
        timer: 1500
      })
      return
    }
    try {
      let header = await getHeaders();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }
      const changTable = await axios({
        method: 'put',
        url: END_POINT_SEVER + `/v3/bill-transfer`,
        data: {
          "codeTableOld": selectedTable?.code,
          "codeTableNew": codeTableNew
        },
        headers: headers
      })
      if (changTable?.status === 200) {
        handleClose()
        setSelectedTable()
        setTableList(changTable?.data)
        await Swal.fire({
          icon: 'success',
          title: "ການປ່ຽນໂຕະສໍາເລັດ",
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: "ການປ່ຽນໂຕະບໍ່ສໍາເລັດ",
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const _openModalSetting = (data) => {
    setDataSettingModal(data)
    setOpenModalSetting(true)
  }

  const _resetTable = async () => {
    try {
      if (tableOrderItems?.length > 0) {
        setOpenModalSetting(false)
        warningAlert("ບໍ່ສາມາດປິດໂຕະໄດ້ເພາະມີການໃຊ້ງານ...!")
        return
      }
      let header = await getHeaders();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': header.authorization
      }
      const updateTable = await axios({
        method: 'put',
        url: END_POINT_SEVER + `/v3/code/update`,
        data: {
          id: dataSettingModal?._id,
          data: {
          "isOpened": "false",
          "isStaffConfirm": "false"
          }
        },
        headers: headers
      })
      setOpenModalSetting(false)
      if (updateTable?.data) {
        setSelectedTable()
        setTableList(updateTable?.data)
        successAdd("ການປິດໂຕະສຳເລັດ")
      }
    } catch (err) {
      errorAdd("ການປິດໂຕະບໍ່ສຳເລັດ")
    }
  }

  return (
    <div style={TITLE_HEADER}>
      {isTableOrderLoading ? <Loading /> : ""}
      <div style={{ marginTop: -10, paddingTop: 10 }}>
        <div style={DIV_NAV}>
          <Nav
            variant="tabs"
            style={NAV}
            defaultActiveKey={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
          >
            <Nav.Item>
              <Nav.Link
                style={{ color: "#FB6E3B", border: "none" }}
                active={true}
              >
                ໂຕະທັງໝົດ : {tableList?.length}
                {/* ໂຕະທັງໝົດ : {tableList?.length}, ໂຕະທີ່ເປິດທັງໝົດ : {tableList?.length}, ໂຕະທີ່ຫວ່ງທັງໝົດ : {tableList?.length}, ໂຕະທີ່ການ checkBill ທັງໝົດ : {tableList?.length} */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className="ml-auto row mr-5"
              style={{ paddingBottom: "3px" }}
            >
            </Nav.Item>
          </Nav>
        </div>
        <div
          style={BODY}
          style={{
            display: "flex",
            paddingBottom: 50,
            overflow: "hidden",
          }}
        >
          <div style={half_backgroundColor}>
            <Container>
              <div style={{height: 10 }}></div>
              <Row>
                {tableList &&
                  tableList.map((table, index) => (
                    <div className="card" key={"table" + index}>
                      <Button
                        key={index}
                        style={{
                          width: 180,
                          height: 140,
                          border: "none",
                          outlineColor: "#FB6E3B",
                          backgroundColor: table?.isStaffConfirm ? "#FB6E3B" : "white",
                          border: selectedTable?.tableName == table?.tableName ? "2px solid #FB6E3B" : "2px solid  white",
                        }}
                        className={table?.isOpened && !table?.isStaffConfirm ? "blink_card" :""}
                        // className={table?.isOpened && !table?.isStaffConfirm ? "blink_card" : dataBill?.code === table?.code && dataBill?.status === "CALL_TO_CHECKOUT" ? "blink_card":""}
                        onClick={async () => {
                          onSelectTable(table)
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            float: "right",
                            right: 10,
                            top: 10,
                          }}
                        >
                        </div>
                        <div>
                          <span style={{ fontSize: 20 }}>
                            <div style={{ color: table?.staffConfirm ? "white" : "#616161", fontWeight: "bold", fontSize: 25 }}>{table?.tableName}</div>
                            <div style={{ color: table?.staffConfirm ? "white" : "#616161" }}>{table?.code}</div>
                            <div >{convertTableStatus(table)}</div>
                          </span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </Row>
            </Container>
          </div>
          {/* Detail Table */}
          {(selectedTable != null && (selectedTable?.isStaffConfirm && selectedTable?.isOpened)) && <div
            style={{
              width: "60%",
              backgroundColor: "#FFF",
              maxHeight: "90vh",
              borderColor: "black",
              overflowY: "scroll",
              borderWidth: 1,
              paddingLeft: 20,
              paddingTop: 20,
            }}
          >
            {
              <Container >
                <Row style={{ margin: 0 }}>
                  <Col sm={12} style={{ backgroundColor: "#eee" }}>
                    <p style={{ fontSize: 30, margin: 0, fontWeight: "bold" }}>ຂໍ້ມູນໂຕະ</p>
                    <p style={{ fontSize: 20, margin: 0, fontWeight: "bold" }}>ໂຕະ: {selectedTable?.tableName} </p>
                    <p style={{ fontSize: 20, margin: 0 }}>ລະຫັດເຂົ້າໂຕະ:  {selectedTable?.code}</p>
                    <p style={{ fontSize: 20, margin: 0 }}>ເວລາເປີດ:   {moment(selectedTable?.createdAt).format("HH:mm:ss A")}</p>
                    <p style={{ fontSize: 20, margin: 0 }}>ຜູ້ຮັບຜິດຊອບ:   {dataBill?.orderId[0]?.updatedBy?.firstname && dataBill?.orderId[0]?.updatedBy?.lastname ? dataBill?.orderId[0]?.updatedBy?.firstname + " " + dataBill?.orderId[0]?.updatedBy?.lastname:""}</p>
                    <p style={{ fontSize: 20, margin: 0 }}>ມີສ່ວນຫຼຸດ:   {moneyCurrency(dataBill?.discount)} {dataBill?.discountType === "PERCENT" ? "%" : "ກີບ"}</p> 
                  </Col>
                </Row>
                <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15 }}>
                  <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
                  </div>
                  <div style={{
                    display: CheckStatus?.length === tableOrderItems?.length - CheckStatusCancel?.length ?
                      (CheckStatus?.length !== tableOrderItems?.length - CheckStatusCancel?.length ? "" : CheckStatus?.length === 0 ? "" : "none")
                      : "none"
                  }}>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{}}>
                      <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={()=>_openModalSetting(selectedTable)}><FontAwesomeIcon icon={faWindowClose} style={{ color: "#fff", marginRight: 10 }} />ປິດໂຕະ</Button>
                      <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={handleShow}><FontAwesomeIcon icon={faRetweet} style={{ color: "#fff", marginRight: 10 }} />ລວມໂຕະ</Button>
                      <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={() => _onAddDiscount()}><FontAwesomeIcon icon={faPercent} style={{ color: "#fff" }} /> ເພີ່ມສ່ວນຫຼຸດ</Button>
                      <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={() => _onCheckOut()}><FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} />Checkout</Button>
                      <ReactToPrint
                        trigger={() => <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }}><FontAwesomeIcon icon={faFileInvoice} style={{ color: "#fff" }} /> CheckBill</Button>}
                        content={() => componentRefA.current}
                      />
                      <div style={{ display: 'none' }}>
                        <BillForCheckOut ref={componentRefA} newData={dataBill} dataStore={dataBill?.storeId} />
                      </div>
                    </div>
                    <div>
                      <Button variant="light" className="hover-me" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={() => _goToAddOrder(selectedTable?.tableId, selectedTable?.code, selectedTable?._id)}>+ ເພີ່ມອໍເດີ</Button>
                    </div>
                  </div>
                </div>
                <div style={{ height: 20 }}></div>
                <div style={{ display: _orderIsChecked() ? "none" : 'flex'}}>ອັບເດດເປັນສະຖານະ: </div>
                <div style={{ height: 20 }}></div>
                <div style={{ display: _orderIsChecked() ? "none" : 'flex', justifyContent: "space-between" }}>
                  <div>
                    <ReactToPrint
                      trigger={() => <Button
                        variant="light"
                        style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }}
                      >ພີມບີນສົ່ງໄປຄົວ</Button>}
                      content={() => componentRef.current}
                    />
                    <div style={{ display: 'none' }}>
                      <BillForChef ref={componentRef} newData={orderItemForPrintBill} />
                    </div>
                  </div>
                  <div>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => setFeedbackOrderModal(true)}>ສົ່ງຄືນ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(CANCEL_STATUS, match?.params?.storeId)}>ຍົກເລີກ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(DOING_STATUS, match?.params?.storeId)}>ສົ່ງໄປຄົວ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(SERVE_STATUS, match?.params?.storeId)}>ເສີບແລ້ວ</Button>
                  </div>
                </div>
                <div style={padding_white} />
                <div>
                  <Table
                    responsive
                    className="staff-table-list borderless table-hover"
                  >
                    <thead style={{ backgroundColor: "#F1F1F1" }}>
                      <tr>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>#</th>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>ລຳດັບ</th>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>ຊື່ເມນູ</th>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>ຈຳນວນ</th>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>ສະຖານະ</th>
                        <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>ເວລາ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableOrderItems ? tableOrderItems?.map((orderItem, index) => (
                        <tr key={"order" + index} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ border: "none" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}>
                              <Checkbox
                                checked={orderItem?.isChecked ? true : false}
                                onChange={(e) => onChangeMenuCheckbox(orderItem)}
                                color="primary"
                                inputProps={{ "aria-label": "secondary checkbox" }}
                              />
                            </div>
                          </td>
                          <td ><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{index + 1}</p></div></td>
                          <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{orderItem?.name}</p></div></td>
                          <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{orderItem?.quantity}</p></div></td>
                          <td>
                            <div
                              style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50, color: orderItem?.status === `SERVED` ? "green" : orderItem?.status === 'DOING' ? "" : "red" }}
                            >
                              <p style={{ margin: 0 }}>{orderItem?.status ? orderStatus(orderItem?.status) : "-"}</p>
                            </div>
                          </td>
                          <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{orderItem?.createdAt
                            ? moment(orderItem?.createdAt).format("HH:mm A")
                            : "-"}</p></div></td>
                        </tr>
                      )) : ""}
                    </tbody>
                  </Table>
                  {tableOrderItems?.length == 0 && <div className="text-center">
                    <div style={{ marginTop: 50, fontSize: 50 }}> ໂຕະນີ້ຍັງບໍ່ມີອໍເດີ</div>
                  </div>}
                </div>
                <div style={{ marginBottom: 100 }} />
              </Container>
            }
          </div>}
          {(selectedTable != null && (!selectedTable?.isStaffConfirm)) && <div
            style={{
              width: "60%",
              backgroundColor: "#FFF",
              maxHeight: "90vh",
              borderColor: "black",
              overflowY: "scroll",
              borderWidth: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p style={{ fontSize: 50, fontWeight: "bold" }}>ໂຕະ:{selectedTable?.table_id}</p>
            <QRCode
              value={JSON.stringify({
                storeId: selectedTable?.storeId,
                tableId: selectedTable?.tableId
              })}
              style={{ width: 100 }}
            />
            <p style={{ fontSize: 20 }}>ນໍາເອົາQRcodeນີ້ໄປໃຫ້ລູກຄ້າ ຫລື ກົດເປີດໂຕະເພື່ອລິເລີ່ມການນໍາໃຊ້ງານ</p>
            <div style={{ height: 30 }} />
            <Button variant="light" className="hover-me" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", fontSize: 40, padding: 20 }} onClick={() => openTable()}>
              <FontAwesomeIcon icon={!selectedTable?.isOpened ? faArchway : faCheckCircle} style={{ color: "#fff" }} /> {!selectedTable?.isOpened ? "ເປີດໂຕະ" : "ຢືນຢັນເປີດໂຕະ"}</Button>
          </div>}

          {selectedTable == null && <div style={{
            width: "60%",
            backgroundColor: "#FFF",
            maxHeight: "90vh",
            borderColor: "black",
            overflowY: "scroll",
            borderWidth: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <p style={{ margin: 0, fontSize: 30 }}>
              ເລືອກໂຕະເພື່ອເບິ່ງອໍເດີ</p>
          </div>}
        </div>
      </div>

      <OrderCheckOut
        data={dataBill}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
      />

      <UpdateDiscountOrder
        data={tableOrderItems}
        tableData={selectedTable}
        show={modalAddDiscount}
        resetTableOrder={resetTableOrder}
        hide={() => setModalAddDiscount(false)}
      />

      <FeedbackOrder
        data={orderItemForPrintBill}
        tableData={selectedTable}
        show={feedbackOrderModal}
        hide={() => setFeedbackOrderModal(false)}
      />

      <UserCheckoutModal
        show={checkoutModel}
        hide={() => setCheckoutModal(false)}
        tableId={selectedTable?.code}
        func={_handlecheckout}
      />

      <Modal
        show={show}
        onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ລວມໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Label>ຍ້າຍຈາກໂຕະ : {selectedTable?.tableName}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>ໄປຫາໂຕະ : </Form.Label>
              <div style={{ height: 10 }}></div>
              <select className="form-select form-control" aria-label="Default select example"
                onChange={(e) => setCodeTableNew(e.target.value)}
              >
                <option selected disabled>ເລືອກໂຕະ</option>
                {tableList?.map((item, index) =>
                  <option key={"talbe-" + index} value={item?.code} disabled={selectedTable?.tableName === item?.tableName ? true : false}>ໂຕະ {item?.tableName}</option>
                )}
              </select>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose()}>ຍົກເລີກ</Button>
          <Button variant="success" onClick={() => _changeTable()}>ລວມໂຕະ</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={openModalSetting}
        onHide={() => setOpenModalSetting(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ຕັ້ງຄ່າໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            ທ່ານຕ້ອງການປິດໂຕະ {dataSettingModal?.tableName} ນີ້ບໍ ?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenModalSetting(false)}>ຍົກເລີກ</Button>
          <Button variant="success" onClick={() => _resetTable()}>ປິດໂຕະ</Button>
        </Modal.Footer>
      </Modal>

    </div >
  );
};

const NAV = {
  backgroundColor: "#F9F9F9",
  marginTop: -10,
  paddingTop: 10,
  border: "none"
};
