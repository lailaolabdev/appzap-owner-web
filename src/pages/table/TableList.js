import React, { useEffect, useState, useRef } from "react";
import useReactRouter from "use-react-router";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Checkbox } from "@material-ui/core";
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faArchway,
  faCheckCircle,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import { QRCode } from "react-qrcode-logo";

/**
 * component
 * */
import Loading from "../../components/Loading";
import UserCheckoutModal from "./components/UserCheckoutModal";
import OrderCheckOut from "./components/OrderCheckOut";
import { orderStatus } from "../../helpers";
import { BillForChef } from '../bill/BillForChef';
import { BillForCheckOut } from '../bill/BillForCheckOut';
import { STORE, getLocalData } from '../../constants/api'

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



export default function TableList() {
  const { history, location, match } = useReactRouter();
  const componentRef = useRef();
  const componentRefA = useRef();
  const number = match?.params?.number;
  const activeTableId = match?.params?.tableId;

  const {
    isTableOrderLoading,
    orderItemForPrintBill,
    tableList,
    selectedTable,
    openTable,
    tableOrderItems,
    getTableDataStore,
    onSelectTable,
    onChangeMenuCheckbox,
    handleUpdateTableOrderStatus,
    resetTableOrder
  } = useStore();

  /**
   * useState
   */
  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [CheckStatus, setCheckStatus] = useState()
  const [CheckStatusCancel, setCheckStatusCancel] = useState()
  const [dataStore, setStore] = useState()


  useEffect(() => {
    getTableDataStore()
    getData()
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

  /**
   * ເຊັກເບິ່ງວ່າໄອເທັມຖືກເລືອກບໍ
   * @returns 
   */
  const _orderIsChecked = () => {
    let isIncluded = tableOrderItems.filter((item) => item.isChecked)
    return isIncluded.length == 0;
  }

  const _onCheckOut = async () => {
    setMenuItemDetailModal(true);
  };

  const _goToAddOrder = (tableId, code) => {
    history.push(`/addOrder/tableid/${tableId}/code/${code}`);
  }

  const convertTableStatus = (_table) => {
    if (_table?.isOpened && _table?.staffConfirm) return <div style={{ color: "green" }}>ເປີດແລ້ວ</div>
    else if (_table?.isOpened && !_table?.staffConfirm) return <div style={{ color: "#fff" }}>ລໍຖ້າຢືນຢັນ</div>
    else if (!_table?.isOpened && !_table?.staffConfirm) return <div style={{ color: "#eee" }}>ວ່າງ</div>
    else return "-"
  }
  const getData = async () => {
    await fetch(STORE + `/?id=${match?.params?.storeId}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setStore(json));
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
                href={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
              >
                ໂຕະທັງໝົດ
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
              <Row>
                {tableList &&
                  tableList.map((table, index) => (
                    <div className="card" key={"table" + index}>
                      <Button
                        key={index}
                        // className="card-body"
                        style={{
                          width: 180,
                          height: 140,
                          border: "none",
                          outlineColor: "#FB6E3B",
                          backgroundColor: table?.staffConfirm ? "#FB6E3B" : "white",
                          border: selectedTable?.table_id == table?.table_id ? "2px solid #FB6E3B" : "2px solid  white",
                        }}
                        className={table?.isOpened && !table?.staffConfirm ? "blink_card" : ""}
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
                            <div style={{ color: table?.staffConfirm ? "white" : "#616161", fontWeight: "bold", fontSize: 40 }}>ໂຕະ {table?.table_id}</div>
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
          {(selectedTable != null && (selectedTable?.staffConfirm && selectedTable?.isOpened)) && <div
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
                    <p style={{ fontSize: 20, margin: 0, fontWeight: "bold" }}>ໂຕະ: {selectedTable?.table_id} </p>
                    <p style={{ fontSize: 20, margin: 0 }}>ລະຫັດເຂົ້າໂຕະ:  {selectedTable?.code}</p>
                    <p style={{ fontSize: 20, margin: 0 }}>ເວລາເປີດ:   {moment(selectedTable?.createdAt).format("HH:mm:ss A")}</p>
                  </Col>
                </Row>
                <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15 }}>
                  <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
                    {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} /> */}
                  </div>
                  <div style={{
                    display: CheckStatus?.length === tableOrderItems?.length - CheckStatusCancel?.length ?
                      (CheckStatus?.length !== tableOrderItems?.length - CheckStatusCancel?.length ? "" : CheckStatus?.length === 0 ? "" : "none")
                      : "none"
                  }}>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{}}>
                      <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={() => _onCheckOut()}><FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} /> Checkout</Button>
                      <ReactToPrint
                          trigger={() => <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }}><FontAwesomeIcon icon={faFileInvoice} style={{ color: "#fff" }} /> ກວດຍອດ</Button>}
                          content={() => componentRefA.current}
                      />
                      <div style={{ display: 'none' }}>
                        <BillForCheckOut ref={componentRefA} newData={tableOrderItems} dataStore={dataStore} />
                      </div>
                    </div>
                    <div>
                      <Button variant="light" className="hover-me" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }} onClick={() => _goToAddOrder(selectedTable?.table_id, selectedTable?.code)}>+ ເພີ່ມອໍເດີ</Button>
                    </div>
                  </div>
                </div>
                <div style={{ display: _orderIsChecked() ? "none" : '' }}>
                  <div>ອັບເດດເປັນສະຖານະ: </div>
                  <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(CANCEL_STATUS, match?.params?.storeId)}>ຍົກເລີກ</Button>
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
                  <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(DOING_STATUS, match?.params?.storeId)}>ສົ່ງໄປຄົວ</Button>
                  <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(SERVE_STATUS, match?.params?.storeId)}>ເສີບແລ້ວ</Button>
                </div>
                <div style={padding_white} />
                <div>
                  <Table
                    responsive
                    className="staff-table-list borderless table-hover"
                  >
                    <thead style={{ backgroundColor: "#F1F1F1" }}>
                      <tr>
                        <th style={{ width: 20, border: "none" }}></th>
                        <th style={{ width: 50, border: "none" }}>ລຳດັບ</th>
                        <th style={{ border: "none" }}>ຊື່ເມນູ</th>
                        <th style={{ border: "none" }}>ຈຳນວນ</th>
                        <th style={{ border: "none" }}>ສະຖານະ</th>
                        <th style={{ border: "none" }}>ເວລາ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableOrderItems ? tableOrderItems.map((orderItem, index) => (
                        <tr key={"order" + index} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ border: "none" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}>
                              <Checkbox
                                disabled={orderItem?.status === "SERVED"}
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
                  {tableOrderItems.length == 0 && <div className="text-center">
                    <div style={{ marginTop: 50, fontSize: 50 }}> ໂຕະນີ້ຍັງບໍ່ມີອໍເດີ</div>
                  </div>}
                </div>
                <div style={{ marginBottom: 100 }} />
              </Container>
            }
          </div>}

          {(selectedTable != null && (!selectedTable?.staffConfirm)) && <div
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
        data={tableOrderItems}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
      />

      <UserCheckoutModal
        show={checkoutModel}
        hide={() => setCheckoutModal(false)}
        tableId={selectedTable?.code}
        func={_handlecheckout}
      />
    </div >
  );
};

const NAV = {
  backgroundColor: "#F9F9F9",
  marginTop: -10,
  paddingTop: 10,
  border: "none"
};
