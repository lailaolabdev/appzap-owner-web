import React, { useEffect, useState, useRef } from "react";
import useReactRouter from "use-react-router";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Checkbox, FormControlLabel } from "@material-ui/core";

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
export default function TableList() {
  const { history, location, match } = useReactRouter();
  const number = match?.params?.number;
  let activeTableId = match?.params?.tableId;
  const [reLoadData, setreLoadData] = useState()
  const [Opentable, setOpentable] = useState()
  const socket = socketIOClient(END_POINT);
  const [userData, setUserData] = useState({})
  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
  }, [])
  socket.on(`createorder${userData?.data?.storeId}`, data => {
    setreLoadData(data)
  });
  socket.on(`loginApp${userData?.data?.storeId}`, data => {
    setOpentable(data)
  });

  /**
   * useState
   */
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
    _getTable()
  }, []);
  useEffect(() => {
    _getTable()
  }, [reLoadData]);
  useEffect(() => {
    _getTable()
  }, [Opentable]);
  useEffect(() => {
    const url = END_POINT + `/orders?code=${activeTableId}`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataOrder(response)
      })
  }, [activeTableId, reLoadData])
  const _searchDate = async (table) => {
    setTableCode(table?.order?.code);
    let checkout =
      table &&
        table?.order &&
        table?.order?.checkout == false
        ? true
        : false;
    await setCheckedToUpdate([]);
    await _onHandlerTableDetail(table.table_id, checkout, table?.code);
    await setGenerateCode(table?.code);
    const url = END_POINT + `/orders?code=${table?.code}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataOrder(response)
      })
  }
  const [CheckStatus, setCheckStatus] = useState()
  const [CheckStatusCancel, setCheckStatusCancel] = useState()
  useEffect(() => {
    let newData = []
    let checkDataStatus = []
    let checkDataStatusCancel = []
    for (let i = 0; i < dataOrder?.length; i++) {
      for (let k = 0; k < dataOrder[i]?.order_item?.length; k++) {
        newData.push(dataOrder[i]?.order_item[k])
        if (dataOrder[i]?.order_item[k]?.status === "SERVED") {
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
  // ===== query table ===>
  const _getTable = async () => {
    const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=${match?.params?.storeId}`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setDataTable(response)
      })
  }
  // =====>>>>> fix by joy

  useEffect(() => {
    const fetchTable = async () => {
      const res = await getTables();
      await setTable(res);
    };
    fetchTable();
  }, []);
  const _onHandlerTableDetail = async (table_id, checkout, code) => {
    await setTableId(table_id);
    let _orderDataFromTable = await getOrdersWithTableId(
      ACTIVE_STATUS,
      table_id
    );
    if (_orderDataFromTable.length !== 0 && checkout === true) {
      let newArr = [];
      _orderDataFromTable.map((order, index) => {
        if (index == 0) {
          let newData = {
            id: order?.orderId,
            code: order?.code,
          };
          newArr.push(newData);
        } else {
          let newData = {
            id: order?.orderId,
            code: order?.code,
          };
          for (let i = 0; i < newArr.length; i++) {
            if (newData.id == newArr[i].id) {
              break;
            }
            if (i === newArr.length - 1) {
              newArr.push(newData);
            }
          }
        }
      });

      await setOrderIds(newArr);
      await setCheckoutModal(true);
    } else if (_orderDataFromTable.length !== 0) {
      await setOrderFromTable(_orderDataFromTable);
    }
    history.push(`/tables/pagenumber/${number}/tableid/${code}/${match?.params?.storeId}`);
  };
  const _handlecheckout = async () => {
    await updateOrder(orderIds, CHECKOUT_STATUS);
    setCheckoutModal(false);
    history.push(`/tables/pagenumber/${number}/tableid/${activeTableId}/${match?.params?.storeId}`);
  };
  const [IdMenuOrder, setIdMenuOrder] = useState([])
  const _handleCheckbox = async (event, id,index) => {
    if (event?.target?.checked === true) {
      let _addData = [];
      _addData.push({ id: id, checked: event.target.checked, number: index });
      setCheckedToUpdate([
        ...checkedToUpdate,
        ..._addData,
      ]);
    } else {
      const _removeId = await checkedToUpdate?.filter((item) => item.id !== id);
      setCheckedToUpdate(_removeId);
    }
  };
  // =======>>>>>>>>> update
  const _handleUpdateServe = async () => {
    await updateOrderItem(checkedToUpdate, SERVE_STATUS);
    window.location.reload();
  };
  const _handleUpdate = async () => {
    await updateOrderItem(checkedToUpdate, DOING_STATUS);
    window.location.reload();
  };
  const _handleCancel = async () => {
    await updateOrderItem(checkedToUpdate, CANCEL_STATUS);
    window.location.reload();
  };
  const _checkAll = (item) => {
    if (item?.target?.checked === true) {
      setcheckBoxAll(true)
      let allData = []
        for (let p = 0; p < dataOrder[0]?.order_item?.length; p++){
          allData.push({ id: dataOrder[0]?.order_item[p]?._id })
        }
      setCheckedToUpdate(allData)
    } else {
      setcheckBoxAll(false)
      setCheckedToUpdate()
      setCheckedToUpdate([])
    }
  }
    const _onSelectBox = (index) => {
      for (let i = 0; i < checkedToUpdate?.length; i++){
        if (checkedToUpdate[i]?.number === index) {
          return "true"
       }
      }
    }
  const _prinbill = async () => {
    let billId = []
    for (let i = 0; i < checkedToUpdate?.length; i++) {
      billId.push(checkedToUpdate[i]?.id)
    }
    await window.open(`/BillForChef/?id=${billId}`); 
    _handleUpdate()
  }
  const _checkOut = async () => {
    window.open(`/CheckBillOut/${match?.params?.storeId}/?code=${match?.params?.tableId}`);
  }
  const _onClickMenuDetail = async () => {
    await setMenuItemDetailModal(true);
  };
  return (
    <div style={TITLE_HEADER}>
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
                ໂຕະທັງໜົດ
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
                    <div className="card" key={index}>
                      <Button
                        key={index}
                        className="card-body"
                        style={{
                          width: 180,
                          height: 140,
                          border: "none",
                          outlineColor: "#FB6E3B",
                          backgroundColor: table?.code === activeTableId ? "#FB6E3B" : tableId == table?.table_id ? "#FB6E3B" : "white",
                        }}
                        onClick={async () => {
                          _searchDate(table)
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
                            <div style={{ color: table?.code === activeTableId ? "#FFF" : tableId == table?.table_id ? "white" : "#C4C4C4", fontWeight: "bold" }}>ໂຕະ {table?.table_id}</div>
                            <div style={{ color: table?.code === activeTableId ? "#FFF" : tableId == table?.table_id ? "white" : "red" }}>{table?.code}</div>
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
            {activeTableId == "00" ? null :
              <Container fluid>
                <Row>
                  <Col sm={3}>
                    <span style={PRIMARY_FONT_BLACK}>ໂຕະ {tableId}  ({generateCode})</span>
                  </Col>
                </Row>
                  <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                    <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
                    {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} /> */}
                    </div>
                  <div style={{ display: CheckStatus?.length === newData?.length - CheckStatusCancel?.length ? "none":''}}>
                      <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => _handleCancel()}>ຍົກເລີກ</Button>
                      <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _prinbill()}>ສົ່ງໄປຄົວ</Button>
                      <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={()=>_handleUpdateServe()}>ເສີບແລ້ວ</Button>
                    </div>
                  <div style={{ display: CheckStatus?.length !== newData?.length - CheckStatusCancel?.length ? "none" : CheckStatus?.length === 0 ? "none" : "" }}>
                    <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _onClickMenuDetail()}>Checkout</Button>
                    <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _checkOut()}>ໄລ່ເງີນ</Button>
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
                        <tr key={index}>
                          <td>
                            <Checkbox
                              disabled={orderItem?.status === "SERVED" ? "true":""}
                              checked={_onSelectBox(index) ? _onSelectBox(index) : checkBoxAll}
                              onChange={(e) => _handleCheckbox(e, orderItem?._id, index)}
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
                              {orderItem?.status ? orderStatus(orderItem?.status): "-"}
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
      <UpdateOrderModal
        show={showOrderModal}
        hide={() => setShowOrderModal(false)}
        handleUpdate={_handleUpdate}
      />
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
