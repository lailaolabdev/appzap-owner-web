import React, { useEffect, useState, useRef } from "react";
import useReactRouter from "use-react-router";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './components/ToPrint';
import { ComponentToPrintBillInTable } from './components/ToPrintBillInTable';
import {
  faPen,
  faRecycle,
  faCommentDots,
  faChartArea,
  faPrint,
  faCashRegister,
  faArchway,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "axios";
import socketIOClient from "socket.io-client";
/**
 * component
 * */
import Loading from "../../components/Loading";
import UpdateOrderModal from "./components/UpdateOrderModal";
import UserCheckoutModal from "./components/UserCheckoutModal";
import CancelModal from "./components/CancelModal";
import OrderCheckOut from "./components/OrderCheckOut";
import { orderStatus, STATUS_OPENTABLE } from "../../helpers";
import {
  getTables,
  getTableWithOrder,
  generatedCode,
} from "../../services/table";
import {
  getOrdersWithTableId,
  updateOrderItem,
  updateOrder,
} from "../../services/order";
import Swal from 'sweetalert2'

/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  half_backgroundColor,
  padding,
  PRIMARY_FONT_BLACK,
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_DELETE,
  BUTTON_OUTLINE_DARK,
  padding_white,
  USER_KEY,
  ACTIVE_STATUS,
  CANCEL_STATUS,
  DOING_STATUS,
  CHECKOUT_STATUS,
  SERVE_STATUS,
  BUTTON_EDIT_HOVER,
  END_POINT,
} from "../../constants/index";
import { END_POINT_SEVER } from "../../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QRCode } from "react-qrcode-logo";
import { getHeaders } from "../../services/auth";
import { errorAdd } from "../../helpers/sweetalert";
export default function TableList() {
  const { history, location, match } = useReactRouter();
  const componentRef = useRef();
  const number = match?.params?.number;
  const socket = socketIOClient(END_POINT_SEVER);
  let activeTableId = match?.params?.tableId;



  /**
   * useState
   */
  const [reLoadData, setreLoadData] = useState()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [table, setTable] = useState([]);
  const [tableId, setTableId] = useState(activeTableId);
  const [tableData, setTableData] = useState();
  const [orderIds, setOrderIds] = useState([]);
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  //ເມື່ອ generateCode: ture
  const [generateCode, setGenerateCode] = useState();
  const [showOrderModal, setShowOrderModal] = useState(false);
  // ຂໍ້ມູນສະແດ່ໃນ table
  const [orderFromTable, setOrderFromTable] = useState();
  const [idTable, setTableCode] = useState("");
  const [data, setData] = useState();
  // =====>>>> query data order in table
  const [dataOrder, setDataOrder] = useState([])
  const [newData, setnewData] = useState([])
  const [tableList, setTableList] = useState([])
  const [checkBoxAll, setcheckBoxAll] = useState(false);
  const [CheckStatus, setCheckStatus] = useState()
  const [CheckStatusCancel, setCheckStatusCancel] = useState()

  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
    _getTable()
  }, [])


  /**
   * Modify Order
   */
  useEffect(() => {
    let newData = []
    for (let i = 0; i < dataOrder?.length; i++) {
      for (let k = 0; k < dataOrder[i]?.order_item?.length; k++) {
        newData.push(dataOrder[i]?.order_item[k])
      }
    }
    setnewData(newData)
  }, [dataOrder])



  /**
   * Modify Order Status
   */
  useEffect(() => {
    if (!newData) return;
    let _newData = [...newData]
    let _checkDataStatus = []
    let _checkDataStatusCancel = []
    _newData.map((nData) => {
      if (nData.status === "SERVED") _checkDataStatus.push(nData?.status)
      if (nData.status === "CANCELED") _checkDataStatusCancel.push(nData?.status)
    })

    setCheckStatusCancel(_checkDataStatusCancel)
    setCheckStatus(_checkDataStatus)
  }, [newData])





  /**
   * Get Table
   */
  const _getTable = async () => {
    const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=${match?.params?.storeId}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        setTableList(response)
        console.log({ response })
      })
  }


  /**
   * Get Table Orders
   */
  const getTableOrders = async (_table) => {
    const url = END_POINT + `/orders?code=${_table?.code}`;
    let res = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataOrder(response)
      })
    return res
  }



  /**
   * Select Table
   * @param {*} table 
   */
  const _onSelectTable = async (table) => {
    setIsLoading(true)
    setTableId(table.table_id);
    setTableCode(table?.order?.code);
    setGenerateCode(table?.code);
    setTableData(table)
    setCheckedToUpdate([]);
    await getTableOrders(table)
    setIsLoading(false)
  }



  const _resetTableOrder = () => {
    getTableOrders(table)
    _getTable()
    setDataOrder([])
    setTimeout(() => { setTableData() }, 100)
  }

  const _handlecheckout = async () => {
    await updateOrder(orderIds, CHECKOUT_STATUS);
    setCheckoutModal(false);
    history.push(`/tables/pagenumber/${number}/tableid/${activeTableId}/${match?.params?.storeId}`);
  };

  const _onChangeMenuCheckbox = async (event, id, index) => {
    if (event?.target?.checked === true) {
      setCheckedToUpdate([
        ...checkedToUpdate,
        { id: id, checked: event.target.checked, number: index },
      ]);
    } else {
      const _removeId = await checkedToUpdate?.filter((item) => item.id !== id);
      setCheckedToUpdate(_removeId);

    }
  };

  /**
   * ຍົກເລີກອໍເດີ
   */
  const _handleCancel = async () => {
    if (checkedToUpdate.length == 0) Swal.fire({
      icon: 'warning',
      title: "ເລືອກເມນູອໍເດີກ່ອນຍົກເລີກ",
      showConfirmButton: false,
      timer: 1800
    })
    await updateOrderItem(checkedToUpdate, CANCEL_STATUS);
    let newMenuOrder = newData.map((order) => {
      let isMatched = checkedToUpdate.filter((checkOrder) => checkOrder.id == order._id)
      if (isMatched.length > 0) {
        return {
          ...order,
          status: 'CANCELED'
        }
      } else return order
    })
    setnewData(newMenuOrder)
    setCheckedToUpdate([])
  };


  /**
     * ສົ່ງໄປຫາເຮືອນຄົວ
     */
  const _updateToKitchen = async () => {
    if (checkedToUpdate.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: "ເລືອກເມນູອໍເດີກ່ອນສົ່ງໄປເຮືອນຄົວ",
        showConfirmButton: false,
        timer: 1800
      })
      return
    }
    let billId = []
    for (let i = 0; i < checkedToUpdate?.length; i++) {
      billId.push(checkedToUpdate[i]?.id)
    }

    await updateOrderItem(checkedToUpdate, DOING_STATUS);

    let newMenuOrder = newData.map((order) => {
      let isMatched = checkedToUpdate.filter((checkOrder) => checkOrder.id == order._id)
      if (isMatched.length > 0) {
        return {
          ...order,
          status: 'DOING'
        }
      } else return order
    })
    setnewData(newMenuOrder)
    setCheckedToUpdate([])
    await window.open(`/BillForChef/?id=${billId}`);
  }


  /**
   * ອັບເດດອໍເດີເປັນເຊີບແລ້ວ
   */
  const _updateToServe = async () => {
    if (checkedToUpdate.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: "ເລືອກເມນູອໍເດີກ່ອນອັບເດດ",
        showConfirmButton: false,
        timer: 1800
      })
      return
    }
    await updateOrderItem(checkedToUpdate, SERVE_STATUS);
    let newMenuOrder = newData.map((order) => {
      let isMatched = checkedToUpdate.filter((checkOrder) => checkOrder.id == order._id)
      if (isMatched.length > 0) {
        return {
          ...order,
          status: SERVE_STATUS
        }
      } else return order
    })
    setnewData(newMenuOrder)
    setCheckedToUpdate([])
  };



  const _checkAll = (item) => {
    if (item?.target?.checked === true) {
      setcheckBoxAll(true)
      let allData = []
      for (let p = 0; p < dataOrder[0]?.order_item?.length; p++) {
        allData.push({ id: dataOrder[0]?.order_item[p]?._id })
      }
      setCheckedToUpdate(allData)
    } else {
      setcheckBoxAll(false)
      setCheckedToUpdate([])
    }
  }

  /**
   * Checkbox validated
   * @param {*} index 
   * @returns 
   */
  const _onSelectOrderMenu = (index) => {
    let isChecked = checkedToUpdate.filter((item) => item?.number == index)
    return isChecked.length > 0;
  }


  /**
   * ເປີດໂຕະ
   */
  const _openTable = async()=>{
    await axios
    .put(
      END_POINT + `/updateGenerates/${tableData?.code}`,
      {
        isOpened:true,
        staffConfirm:true
      },
      {
        headers: await getHeaders(),
      }
    ).then(async function (response) {
      //update Table
      let _tableList = [...tableList]
      let _newTable = _tableList.map((table)=>{
        if(table?.code == tableData?.code)return{
          ...table,
            isOpened:true,
            staffConfirm:true
        }
        else return table
      })
      setTableList(_newTable)
      Swal.fire({
        icon: 'success',
        title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
        showConfirmButton: false,
        timer: 1800
      })
    })
    .catch(function (error) {
      errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
    });
  }


  const _checkOut = async () => {
    document.getElementById('btnPrint').click();
  }

  const _onCheckOut = async () => {
    setMenuItemDetailModal(true);
  };

  const _goToAddOrder = (tableId, code) => {
    history.push(`/addOrder/tableid/${tableId}/code/${code}`);
  }


  const convertTableStatus = (_table) =>{
    if(_table?.isOpened && _table?.staffConfirm)return <div style={{color:"green"}}>ເປີດແລ້ວ</div>
    else if(_table?.isOpened && !_table?.staffConfirm)return  <div style={{color:"#FB6E3B"}}>ລໍຖ້າຢືນຢັນ</div>
    else if(!_table?.isOpened && !_table?.staffConfirm)return <div style={{color:"#eee"}}>ວ່າງ</div>
    else return "-"
  }

  return (
    <div style={TITLE_HEADER}>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => <button id="btnPrint">Print this out!</button>}
          content={() => componentRef.current}
        />
        {tableId}  ({generateCode})
        <div style={{ display: 'none' }}>
          <ComponentToPrintBillInTable ref={componentRef} newData={newData} tableId={tableId} generateCode={generateCode} firstname={userData?.data?.firstname} userData={userData} />
        </div>
      </div>
      {isLoading ? <Loading /> : ""}
      <div style={{ marginTop: -10, paddingTop: 10 }}>
        <div style={DIV_NAV}>
          <Nav
            variant="tabs"
            style={NAV}
            defaultActiveKey={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
          >
            <Nav.Item>
              <Nav.Link
                style={{ color: "#FB6E3B" }}
                href={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
              >
                ຕູບທັງໝົດ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className="ml-auto row mr-5"
              style={{ paddingBottom: "3px" }}
            >
              <Row>
                {" "}
                <div
                  className="ml-2 mr-5"
                  style={{ fontWeight: "bold", color: "#FB6E3B" }}
                >
                  {idTable}
                </div>
              </Row>
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
                          border: tableId == table?.table_id ? "2px solid #FB6E3B" : "2px solid  white",
                        }}
                        className={table?.isOpened && !table?.staffConfirm ? "blink_card" : ""}
                        onClick={async () => {

                          _onSelectTable(table)
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
                            <div style={{ color: table?.staffConfirm ? "white" : "#616161", fontWeight: "bold", fontSize: 40 }}>ຕູບ {table?.table_id}</div>
                            <div style={{ color: table?.staffConfirm ? "white" : "#616161" }}>{table?.code}</div>
                            {/* <div style={{ color: table?.code === activeTableId ? STATUS_OPENTABLE(table?.isOpened) === 'ວ່າງ' ? "#FFF" : "green" : STATUS_OPENTABLE(table?.isOpened) === 'ວ່າງ' ? "#C4C4C4" : "green", fontWeight: "bold" }}> ( {STATUS_OPENTABLE(table?.isOpened)} )</div> */}
                            <div >{ convertTableStatus(table)}</div>
                          </span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </Row>
            </Container>
          </div>
          {/* Detail Table */}
          {(tableData != null && (tableData?.staffConfirm && tableData?.isOpened)) && <div
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
              <Container fluid>
                <Row>
                  <Col sm={6}>
                    <span style={PRIMARY_FONT_BLACK}>ຕູບ {tableId}  ({generateCode})</span>
                  </Col>
                  <Col sm={6} style={{
                    textAlign: 'right',
                  }}>
                    {/* <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _goToAddOrder(tableId, generateCode)}>ເພີ່ມອໍເດີ</Button> */}
                  </Col>
                </Row>
                <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                  <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
                    {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} /> */}
                  </div>
                  <div style={{
                    display: CheckStatus?.length === newData?.length - CheckStatusCancel?.length ?
                      (CheckStatus?.length !== newData?.length - CheckStatusCancel?.length ? "" : CheckStatus?.length === 0 ? "" : "none")
                      : "none"
                  }}>
                    <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _goToAddOrder(tableId, generateCode)}>ເພີ່ມອໍເດີ</Button>
                  </div>
                  <div style={{ display: CheckStatus?.length === newData?.length - CheckStatusCancel?.length ? "none" : '' }}>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => _handleCancel()}>ຍົກເລີກ</Button>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _updateToKitchen()}>ສົ່ງໄປຄົວ</Button>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _updateToServe()}>ເສີບແລ້ວ</Button>
                    <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _goToAddOrder(tableId, generateCode)}>+ ເພີ່ມອໍເດີ</Button>
                  </div>
                  <div style={{ display: CheckStatus?.length !== newData?.length - CheckStatusCancel?.length ? "none" : CheckStatus?.length === 0 ? "none" : "" }}>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _onCheckOut()}><FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} /> Checkout</Button>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _checkOut()}>ກວດສອບຍອດການສັ່ງ</Button>
                    <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _goToAddOrder(tableId, generateCode)}>+ ເພີ່ມອໍເດີ</Button>
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
                        <th style={{ width: 20 }}></th>
                        <th style={{ width: 50 }}>ລຳດັບ</th>
                        <th>ຊື່ເມນູ</th>
                        <th>ຈຳນວນ</th>
                        <th>ສະຖານະ</th>
                        <th>ເວລາ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newData ? newData.map((orderItem, index) => (
                        <tr key={"order" + index}>
                          <td>
                            <Checkbox
                              disabled={orderItem?.status === "SERVED"}
                              checked={_onSelectOrderMenu(index)}
                              onChange={(e) => _onChangeMenuCheckbox(e, orderItem?._id, index)}
                              color="primary"
                              inputProps={{ "aria-label": "secondary checkbox" }}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{orderItem?.name}</td>
                          <td>{orderItem?.quantity}</td>
                          <td>
                            <div
                              style={{ border: "1px", borderRadius: "10px", color: orderItem?.status === `SERVED` ? "green" : orderItem?.status === 'DOING' ? "" : "red" }}
                            >
                              {orderItem?.status ? orderStatus(orderItem?.status) : "-"}
                            </div>
                          </td>
                          <td>
                            {orderItem?.createdAt
                              ? moment(orderItem?.createdAt).format("HH:mm A")
                              : "-"}
                          </td>
                        </tr>
                      )) : ""}
                      <tr>
                        <td>{data?.text}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div style={{ marginBottom: 100 }} />
              </Container>
            }
          </div>}

          {(tableData != null && (!tableData?.staffConfirm)) && <div
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
            <p style={{ fontSize: 50, fontWeight: "bold" }}>ໂຕະ:{tableData?.table_id}</p>
            <QRCode
              logoImage={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png"
              }
              value="https://github.com/gcoro/react-qrcode-logo"
              style={{ width: 100 }}
            />
            <p style={{ fontSize: 20 }}>ນໍາເອົາQRcodeນີ້ໄປໃຫ້ລູກຄ້າ ຫລື ກົດເປີດໂຕະເພື່ອລິເລີ່ມການນໍາໃຊ້ງານ</p>
            <div style={{ height: 30 }} />
            <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", fontSize: 40, padding: 20 }} onClick={() => _openTable()}>
              <FontAwesomeIcon icon={!tableData?.isOpened ? faArchway:faCheckCircle} style={{ color: "#fff" }} /> {!tableData?.isOpened ? "ເປີດໂຕະ" : "ຢືນຢັນເປີດໂຕະ"}</Button>
          </div>}

          {tableData == null && <div style={{
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
        data={newData}
        tableData={tableData}
        show={menuItemDetailModal}
        resetTableOrder={_resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
      />
      {/* <UpdateOrderModal
        show={showOrderModal}
        hide={() => setShowOrderModal(false)}
        handleUpdate={_handleUpdate}
      /> */}
      <CancelModal
        show={cancelOrderModal}
        hide={() => setCancelOrderModal(false)}
        handleCancel={_handleCancel}
      />

      <UserCheckoutModal
        show={checkoutModel}
        hide={() => setCheckoutModal(false)}
        tableId={tableId}
        func={_handlecheckout}
      />
    </div >
  );
};

const NAV = {
  backgroundColor: "#F9F9F9",
  marginTop: -10,
  paddingTop: 10,
};
