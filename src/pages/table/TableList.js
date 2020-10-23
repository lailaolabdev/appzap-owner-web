
/**
 * Library
 * */
import React, { useState } from "react"
import useReactRouter from "use-react-router"
import Nav from "react-bootstrap/Nav"
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checkbox from "@material-ui/core/Checkbox";
import Table from 'react-bootstrap/Table'
import {
  faTrashAlt,
  faPen,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Router } from "react-router-dom"
import Modal from 'react-bootstrap/Modal'



/**
 * component
 * */
import Loading from '../../constants/loading'
import MenusDetail from "./components/MenusDetail"
import TableInputation from './components/TableInputation'
import { Formik } from "formik"
import * as Yup from "yup"


import { getHeaders, } from '../../services/auth'
import { tables, generatedCode, getOrderData } from '../../services/table'
import MenusItemDetail from "./components/MenusItemDetail"



/**
* const 
**/
import {
  TITLE_HEADER,
  HEADER,
  BODY,
  DIV_NAV,
  table_container,
  table_style_center,
  font_text,
  font_description_text,
  half_backgroundColor,
  padding,
  PRIMARY_FONT_BLACK,
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_INDEX,
  BUTTON_DELETE,
  BUTTON_OUTLINE_DARK,
  padding_white,
  table_container_blue,
  BUTTON_SUCCESS,
  font_text_black,
  currency,
  BUTTON_OUTLINE_BLUE



} from "../../constants/index"
import UpdateOrderModal from "./components/UpdateOrderModal";
import TableOrder from "./components/Table";



/**
 * css
 * **/

const TableList = () => {
  const { history, location, match } = useReactRouter();
  var numberPage = match.params.pagenumber


  /**
   * useState
   * */


  const [table, setTable] = useState([])
  const [tableName, setTableName] = useState("");
  const [valueArray, setValueArray] = useState("");
  const [tableId, setTableId] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [orderFromTable, setOrderFromTable] = useState();
  const handleClose = () => setShowModal(false);

  /**
   * useEffect
   * **/
  React.useEffect(() => {
    const fetchTable = async () => {
      const res = await tables();
      setTable(res);
    }
    fetchTable();
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await getOrderData(tableName);
      setOrderData(res);
    }
    fetchData();
  }, []);

  // React.useEffect(()=>{
  //   const res = await getOrders();
  // })


  /**
   * function
   * */
  const _onHandlerTableDetail = async (table_id) => {

    let _orderDataFromTable = await getOrderData(table_id);
    await setOrderFromTable(_orderDataFromTable);


    // if (orderFromTable) {


    await setTableName(table_id);
    await setShowTable(true);


    // } else {
    //   let id = await generatedCode(table_id);
    //   await setTableId(id);
    //   await setShowModal(true);
    // }

  }
  const _checkOrderItem = async (tableId, e) => {
    let isCheck = e.target.checked;
    if (isCheck == true) {
      setValueArray(tableId);
      setDummy(!dummy);
    }
    setShowOrderModal(false);
  }
  const _onClickMenuDetail = async () => {
    await setMenuItemDetailModal(true);
  }
  const _onClickUpdateOrder = async () => {
    await setShowOrderModal(true);
    console.log("value: ", valueArray);
  }

  const data = [{ no: 1, status: "ຫວ່າງ" },
  { no: 2, status: "ເປີດ" }, { no: 3, status: "ຫວ່າງ" }, { no: 4, status: "ເປີດ" },
  ]

  return (

    <div style={TITLE_HEADER}>
      <div style={{ marginTop: -10, paddingTop: 10, }}>
        <div style={DIV_NAV}>
          <Nav
            variant="tabs"
            style={NAV}
            defaultActiveKey={`/tables/pagenumber/1`}

          >
            <Nav.Item>
              <Nav.Link
                href={`/tables/pagenumber/1`}
              >
                ໂຕະທັງໜົດ
					</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div style={BODY} style={{ display: "flex", paddingBottom: 50, minHeight: "100vh", }}>
          <div style={half_backgroundColor}>
            <Container fluid>
              <Row>
                {table && table.map((table, index) => (
                  <div className="card" key={index}>
                    <Button
                      key={index}
                      className="card-body"
                      style={{ width: 180, height: 100 }}
                      variant={`${table.status}` == "ເປີດ" ? "success" : "default"}
                      onClick={() => { _onHandlerTableDetail(table.table_id) }}
                    >
                      <div>
                        <span style={{ fontSize: 20 }}>ໂຕະ {` ${table.table_id}`}</span>
                      </div>
                      <div>
                        <span>{`${table.status}`}</span>
                      </div>
                    </Button>
                  </div>
                ))}
              </Row>
            </Container>
          </div>
          <div style={padding} />


          {/* Detail Table */}
          {showTable ?
            <div style={{
              width: "60%",
              backgroundColor: "#FFF",
              minHeight: "75vh",
              borderColor: "black",
              borderWidth: 1,
              paddingLeft: 20,
              paddingTop: 20
            }}>
              <Container fluid>
                <Row>
                  <Col sm={3}>
                    <span style={PRIMARY_FONT_BLACK}>ໂຕະ {tableName}</span>
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_EDIT}
                      variant={BUTTON_OUTLINE_BLUE}
                      onClick={_onClickMenuDetail}
                    >
                      ເບິ່ງບິນ
									    </Button>
                    {'\t'}
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_EDIT}
                      variant={BUTTON_OUTLINE_DANGER}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{ float: 'left', }}
                      />
										ຍົກເລີກ
									</Button>
                    {'\t'}
                  </Col>
                  <Col sm={3}>
                    <Button
                      style={BUTTON_DELETE}
                      variant={BUTTON_OUTLINE_DARK}
                      onClick={_onClickUpdateOrder}
                    >
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{ float: 'left', marginTop: 4 }}
                      />
										ອັບເດດ
									</Button>
                  </Col>
                </Row>
                <div style={padding_white} />
                <div >
                  <Table
                    responsive
                    className="staff-table-list borderless table-hover"
                  >
                    <thead style={{ backgroundColor: '#F1F1F1', }}>
                      <tr>
                        <th style={{ width: 50 }}></th>
                        <th style={{ width: 50 }}>ລຳດັບ</th>
                        <th style={{ width: 100 }}>ຊື່ເມນູ</th>
                        <th style={{ width: 100 }}>ຈຳນວນ</th>
                        <th style={{ width: 100 }}>ສະຖານະ</th>
                        <th>ວັນ,ທີ,ເດືອນ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log("orderFrom Table", orderFromTable)}

                      {orderFromTable && orderFromTable[0]?.order_item.map((orderItem, index) => (
                        <tr key={index}>
                          <td>
                            <Checkbox
                              color="primary"
                              name="selectOrderItem"
                              onChange={(e) => { _checkOrderItem(orderItem._id, e) }}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{orderItem.menu.name}</td>
                          <td>{currency(orderItem.quantity)}</td>
                          <td>{orderItem.status}</td>
                          <td>{orderItem.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div style={{ marginBottom: 100 }} />

              </Container>
            </div>
            : null
          }

        </div>
      </div>
      <TableInputation show={showModal} onHide={handleClose} data={tableId} />
      <MenusItemDetail show={menuItemDetailModal} hide={() => setMenuItemDetailModal(false)}
        value={tableName}
      />
      <UpdateOrderModal show={showOrderModal} hide={() => setShowOrderModal(false)} data={valueArray} />

    </div >
  );
};

export default TableList;

const NAV = {
  backgroundColor: '#F9F9F9',
  marginTop: -10,
  paddingTop: 10,
}
