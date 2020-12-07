/**
 * Library
 * */
import React, { useState } from "react";
import useReactRouter from "use-react-router";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "react-bootstrap/Table";
import {
  faTrashAlt,
  faPen,
  faRecycle,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
/**
 * component
 * */
import Loading from "../../components/Loading";
import UpdateOrderModal from "./components/UpdateOrderModal";
import UserCheckoutModal from "./components/UserCheckoutModal";
import CancelModal from "./components/CancelModal";
import GenTableCode from "./components/GenTableCode";
import MenusItemDetail from "./components/MenusItemDetail";
import { orderStatus } from "../../helpers";
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
  BUTTON_OUTLINE_BLUE,
  ACTIVE_STATUS,
  CANCEL_STATUS,
  CHECKOUT_STATUS,
} from "../../constants/index";

/**
 * css
 * **/

const TableList = () => {
  const { history, location, match } = useReactRouter();
  const number = match.params.number;
  const activeTableId = match.params.tableId;

  /**
   * useState
   */
  const [isLoading, setIsLoading] = useState(false);
  const [table, setTable] = useState([]);
  const [tableId, setTableId] = useState(activeTableId);
  const [orderIds, setOrderIds] = useState([]);
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [genTableCode, setGenTableCode] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [generateCode, setGenerateCode] = useState();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFromTable, setOrderFromTable] = useState();

  /**
   * useEffect
   * **/
  React.useEffect(() => {
    const fetchTable = async () => {
      await setIsLoading(true);
      const res = await getTableWithOrder();
      await setTable(res);
      await setIsLoading(false);
      await _onHandlerTableDetail(activeTableId);
    };
    fetchTable();
  }, []);
  React.useEffect(() => {
    if (tableId) {
      setCheckedToUpdate([]);
    }
  }, [tableId]);
  /**
   * function
   */
  const _onHandlerTableDetail = async (table_id, checkout) => {
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
      await setOrderFromTable(_orderDataFromTable);
      await setShowTable(true);
      await setCheckoutModal(true);
    } else if (_orderDataFromTable.length !== 0) {
      await setOrderFromTable(_orderDataFromTable);
      await setShowTable(true);
    } else {
      const _getCode = await generatedCode(table_id);
      if (_getCode) {
        setGenerateCode(_getCode);
        setGenTableCode(true);
      }
    }
    history.push(`/tables/pagenumber/${number}/tableid/${table_id}`);
  };
  const _handlecheckout = async () => {
    console.log("OrderFromTable::::::::::::::", orderIds);
    await updateOrder(orderIds, CHECKOUT_STATUS);
    setCheckoutModal(false);
    history.push(`/tables/pagenumber/${number}/tableid/{activeTableId}`);
  };
  const _handleCheckbox = async (event, id) => {
    if (event.target.checked == true) {
      let _addData = [];
      _addData.push({ id: id, checked: event.target.checked });
      setCheckedToUpdate((checkedToUpdate) => [
        ...checkedToUpdate,
        ..._addData,
      ]);
    } else {
      let _checkValue = checkedToUpdate;
      const _removeId = await _checkValue?.filter((check) => check.id !== id);
      setCheckedToUpdate(_removeId);
    }
  };
  const _onClickMenuDetail = async () => {
    await setMenuItemDetailModal(true);
  };
  const _onClickUpdateOrder = async () => {
    await setShowOrderModal(true);
  };
  const _handleCancel = async () => {
    await updateOrderItem(checkedToUpdate, CANCEL_STATUS);
    window.location.reload();
  };
  const _handleUpdate = async (status) => {
    await updateOrderItem(checkedToUpdate, status);
    window.location.reload();
  };

  if (checkedToUpdate) {
    console.log("checkedToUpdate", checkedToUpdate);
  }
  return (
    <div style={TITLE_HEADER}>
      {isLoading ? <Loading /> : ""}
      <button
        className="btn btn-outline-info"
        style={{ position: "fixed", bottom: 50, right: 50 }}
      >
        ເຄຍໂຕະ
      </button>
      <div style={{ marginTop: -10, paddingTop: 10 }}>
        <div style={DIV_NAV}>
          <Nav
            variant="tabs"
            style={NAV}
            defaultActiveKey={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
          >
            <Nav.Item>
              <Nav.Link
                href={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
              >
                ໂຕະທັງໜົດ
              </Nav.Link>
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
            <Container fluid>
              <Row>
                {table &&
                  table.map((table, index) => (
                    <div className="card" key={index}>
                      <Button
                        key={index}
                        className="card-body"
                        style={{ width: 180, height: 100 }}
                        variant={
                          tableId == table?.table_id ? "primary" : "default"
                        }
                        onClick={async () => {
                          let checkout =
                            table &&
                            table?.order &&
                            table?.order?.checkout == true
                              ? true
                              : false;
                          console.log("work::::::::::::::::::", checkout);
                          await setCheckedToUpdate([]);
                          await _onHandlerTableDetail(table.table_id, checkout);
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
                          {table?.order && table?.order?.checkout ? (
                            <FontAwesomeIcon icon={faRecycle} />
                          ) : (
                            <FontAwesomeIcon color="red" icon={faCommentDots} />
                          )}
                        </div>
                        <div>
                          <span style={{ fontSize: 20 }}>
                            ໂຕະ {` ${table?.table_id}`}
                          </span>
                        </div>
                        <div>
                          <span>{`${
                            table?.order ? "(ເປີດແລ້ວ)" : "(ວ່າງ)"
                          }`}</span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </Row>
            </Container>
          </div>
          <div style={padding} />

          {/* Detail Table */}
          {showTable ? (
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
              <Container fluid>
                <Row>
                  <Col sm={3}>
                    <span style={PRIMARY_FONT_BLACK}>ໂຕະ {tableId}</span>
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_EDIT}
                      variant={BUTTON_OUTLINE_BLUE}
                      onClick={_onClickMenuDetail}
                    >
                      ເບິ່ງບິນ
                    </Button>
                    {"\t"}
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_EDIT}
                      variant={BUTTON_OUTLINE_DANGER}
                      onClick={() => {
                        if (checkedToUpdate.length != 0) {
                          setCancelOrderModal(true);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{ float: "left" }}
                      />
                      ຍົກເລີກ
                    </Button>
                    {"\t"}
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_DELETE}
                      variant={BUTTON_OUTLINE_DARK}
                      onClick={() => {
                        if (checkedToUpdate.length != 0) {
                          _onClickUpdateOrder();
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{ float: "left", marginTop: 4 }}
                      />
                      ອັບເດດ
                    </Button>
                  </Col>
                </Row>
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
                      {orderFromTable &&
                        orderFromTable.map((orderItem, index) => (
                          <tr key={index}>
                            <td>
                              <Checkbox
                                // checked={
                                //   checkedToUpdate &&
                                //   checkedToUpdate.length !== 0 &&
                                //   checkedToUpdate[index]?.checked
                                // }
                                color="primary"
                                name="selectOrderItem"
                                onChange={(e) => {
                                  _handleCheckbox(e, orderItem?._id);
                                }}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{orderItem?.menu?.name}</td>
                            <td>{orderItem?.quantity}</td>
                            <td>
                              {orderItem?.status
                                ? orderStatus(orderItem?.status)
                                : "-"}
                            </td>
                            <td>
                              {orderItem?.updatedAt
                                ? moment(orderItem?.updatedAt).format("HH:mm A")
                                : "-"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
                <div style={{ marginBottom: 100 }} />
              </Container>
            </div>
          ) : null}
        </div>
      </div>
      <GenTableCode
        show={genTableCode}
        onHide={() => setGenTableCode(false)}
        data={generateCode}
      />
      <MenusItemDetail
        data={orderFromTable}
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
    </div>
  );
};

export default TableList;

const NAV = {
  backgroundColor: "#F9F9F9",
  marginTop: -10,
  paddingTop: 10,
};
