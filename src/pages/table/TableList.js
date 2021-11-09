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
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import socketIOClient from "socket.io-client";
/**
 * component
 * */
import Loading from "../../components/Loading";
import UpdateOrderModal from "./components/UpdateOrderModal";
import UserCheckoutModal from "./components/UserCheckoutModal";
import CancelModal from "./components/CancelModal";
import MenusItemDetail from "./components/MenusItemDetail";
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
  const [DataTable, setDataTable] = useState()
  const [checkBoxAll, setcheckBoxAll] = useState(false);

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
    let checkDataStatus = []
    let checkDataStatusCancel = []
    for (let i = 0; i < dataOrder?.length; i++) {
      for (let k = 0; k < dataOrder[i]?.order_item?.length; k++) {
        newData.push(dataOrder[i]?.order_item[k])
        if ((dataOrder[i]?.order_item[k]?.status === "SERVED")) {
          checkDataStatus.push(dataOrder[i]?.order_item[k]?.status)
        }
        if (dataOrder[i]?.order_item[k]?.status === "CANCELED") {
          checkDataStatusCancel.push(dataOrder[i]?.order_item[k]?.status)
        }
      }
    }
    setCheckStatusCancel(checkDataStatusCancel)
    setCheckStatus(checkDataStatus)
    setnewData(newData)
  }, [dataOrder])


  /**
   * Get Table
   */
  const _getTable = async () => {
    const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=${match?.params?.storeId}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataTable(response)
      })
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
    setCheckedToUpdate([]);

    let checkout = table?.order?.checkout
    // _onHandlerTableDetail(table.table_id, checkout, table?.code);
    // const url = END_POINT + `/orders?code=${table?.code}&status=NOTCART`;

    const url = END_POINT + `/orders?code=${table?.code}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataOrder(response)
      })

    setIsLoading(false)
  }


  // socket.on(`createorder${userData?.data?.storeId}`, data => {
  //   setreLoadData(data)
  // });
  // socket.on(`loginApp${userData?.data?.storeId}`, data => {
  //   setOpentable(data)
  // });


  // useEffect(() => {
  //   _getTable()
  // }, [reLoadData]);

  // useEffect(() => {
  //   _getTable()
  // }, []);

  // useEffect(() => {
  //   const url = END_POINT + `/orders?code=${activeTableId}&status=NOTCART`;
  //   fetch(url)
  //     .then(response => response.json())
  //     .then(response => {
  //       setDataOrder(response)
  //     })
  // }, [activeTableId, reLoadData])



  const [CheckStatus, setCheckStatus] = useState()
  const [CheckStatusCancel, setCheckStatusCancel] = useState()





  // =====>>>>> fix by joy

  // useEffect(() => {
  //   const fetchTable = async () => {
  //     const res = await getTables();
  //     await setTable(res);
  //   };
  //   fetchTable();
  // }, []);

  const _onHandlerTableDetail = async (table_id, checkout, code) => {
    // await setTableId(table_id);
    // let _orderDataFromTable = await getOrdersWithTableId(
    //   ACTIVE_STATUS,
    //   table_id
    // );
    // if (_orderDataFromTable.length !== 0 && checkout === true) {
    //   let newArr = [];
    //   _orderDataFromTable.map((order, index) => {
    //     if (index == 0) {
    //       let newData = {
    //         id: order?.orderId,
    //         code: order?.code,
    //       };
    //       newArr.push(newData);
    //     } else {
    //       let newData = {
    //         id: order?.orderId,
    //         code: order?.code,
    //       };
    //       for (let i = 0; i < newArr.length; i++) {
    //         if (newData.id == newArr[i].id) {
    //           break;
    //         }
    //         if (i === newArr.length - 1) {
    //           newArr.push(newData);
    //         }
    //       }
    //     }
    //   });

    //   await setOrderIds(newArr);
    //   await setCheckoutModal(true);
    // } else if (_orderDataFromTable.length !== 0) {
    //   await setOrderFromTable(_orderDataFromTable);
    // }
    // history.push(`/tables/pagenumber/${number}/tableid/${code}/${match?.params?.storeId}`);
  };


  const _handlecheckout = async () => {
    await updateOrder(orderIds, CHECKOUT_STATUS);
    setCheckoutModal(false);
    history.push(`/tables/pagenumber/${number}/tableid/${activeTableId}/${match?.params?.storeId}`);
  };
  const [IdMenuOrder, setIdMenuOrder] = useState([])


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


  

  // const _handleUpdate = async () => {
  //   await updateOrderItem(checkedToUpdate, DOING_STATUS);
  //   // window.location.reload();
  // };


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
    // _handleUpdate()

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
      // setCheckedToUpdate()
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




  const _checkOut = async () => {
    document.getElementById('btnPrint').click();
  }
  const _onClickMenuDetail = async () => {
    await setMenuItemDetailModal(true);
  };

  const _goToAddOrder = (tableId, code) => {
    // console.log(tableId, code);
    history.push(`/addOrder/tableid/${tableId}/code/${code}`);
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
                {DataTable &&
                  DataTable.map((table, index) => (
                    <div className="card" key={"table" + index}>
                      <Button
                        key={index}
                        // className="card-body"
                        style={{
                          width: 180,
                          height: 140,
                          border: "none",
                          outlineColor: "#FB6E3B",
                          backgroundColor: tableId == table?.table_id ? "#FB6E3B" : "white",
                        }}
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
                            <div style={{ color: tableId == table?.table_id ? "white" : "#C4C4C4", fontWeight: "bold" }}>ຕູບ {table?.table_id}</div>
                            <div style={{ color: tableId == table?.table_id ? "white" : "red" }}>{table?.code}</div>
                            <div style={{ color: table?.code === activeTableId ? STATUS_OPENTABLE(table?.empty) === 'ວ່າງ' ? "#FFF" : "green" : STATUS_OPENTABLE(table?.empty) === 'ວ່າງ' ? "#C4C4C4" : "green", fontWeight: "bold" }}> ( {STATUS_OPENTABLE(table?.empty)} )</div>
                          </span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </Row>
            </Container>
          </div>
          {/* Detail Table */}
          <div
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
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _onClickMenuDetail()}>Checkout</Button>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _checkOut()}>ໄລ່ເງີນ</Button>
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
                              style={{ border: "1px", borderRadius: "10px", color: orderItem?.status === `SERVED` ? "green" : orderItem?.status === 'DOING' ? "blue" : "red" }}
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
          </div>
        </div>
      </div>

      <MenusItemDetail
        data={newData}
        show={menuItemDetailModal}
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
