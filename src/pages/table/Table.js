
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

/**
 * component
 * */
import Loading from '../../constants/loading'
import MenusDetail from "./components/MenusDetail"

import { getHeaders, } from '../../services/auth'
import { tables } from '../../services/table'
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


/**
 * css
 * **/

const Tables = () => {
  const { history, location, match } = useReactRouter();
  var numberPage = match.params.pagenumber


  /**
   * useState
   * */

  const [showTable, setShowTable] = useState(false);
  const [table, setTable] = useState([])
  const [tableName, setTableName] = useState("");
  const [showModal, setShowModal] = useState(false);


  React.useEffect(() => {
    const fetchTable = async () => {
      const res = await tables();
      setTable(res);
    }
    fetchTable();
  }, [])

  /**
   * function
   * */
  const _onHandlerTable = (table_id) => {
    setShowTable(true);
    setTableName(table_id)
    console.log("click Table number ", table_id)
  }
  const _onClickMenuDetail = () => {
    console.log("click menuDetail: ")
    setShowModal(!showModal);
  }

  if (tableName) {
    console.log("tableName : ", tableName)
  }
  console.log("tables:", tables())
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
                <div style={half_backgroundColor}>
                  <Col sm={8}>
                    {table && table.map((data, index) => {
                      return (
                        <div
                          key={index}
                          style={table_container}
                          onClick={() => { _onHandlerTable(data.table_id) }}
                        >
                          <div className="d-flex flex-row-reverse"  >
                            <img src="https://www.flaticon.com/svg/static/icons/svg/891/891451.svg"
                              style={{ width: 40, height: 40 }} />

                            {/* <img src="https://www.flaticon.com/svg/static/icons/svg/84/84139.svg"
                              style={{ width: 40, height: 40 }} /> */}

                          </div>
                          <div style={table_style_center}>
                            <span style={font_text}> ໂຕະ {data.table_id}</span>
                          </div>
                          <div style={table_style_center}>
                            <span style={font_description_text}>(ວ່າງ)</span>
                          </div>
                        </div>
                      )
                    })}
                  </Col>
                </div>
              </Row>
            </Container>
          </div>
          <div style={padding} />


          {/* Detail Table */}

          {
            showTable ?
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
                      <span style={PRIMARY_FONT_BLACK}>{tableName.name}</span>
                    </Col>
                    <Col sm={3}>
                      <Button
                        style={BUTTON_EDIT}
                        variant={BUTTON_OUTLINE_BLUE}
                        onClick={() => { _onClickMenuDetail() }}
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
                    {food.map((value, index) => {
                      return (
                        <tr index={value}>
                          <td >
                            <Checkbox
                              // hidden={isAdmin}
                              color="primary"
                              name="selectAll"
                            // onChange={(e) => _checkAll(e)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{value.menu}</td>
                          <td>{currency(value.price)}</td>
                          <td>{value.status}</td>
                          <td>{value.datetime}</td>
                        </tr>
                      )
                    })}
                  </Table>
                  <div style={{ marginBottom: 100 }} />
                  <div className="d-flex justify-content-end">
                    <div className="p-2 col-example text-left">ລາຄາລວມ:</div>
                    <div className="p-2 col-example text-left" style={{ backgroundColor: "#F1F1F1", width: 140, height: 50 }}>
                      <span>{currency(12345)}</span>
                      <span style={{ justifyContent: "flex-end", display: "row" }}>ກີບ</span>
                    </div>
                    <div className="p-2 col-example text-left" style={{ width: 180, height: 50, display: "flex", justifyContent: "flex-start" }}>
                      <Button
                        style={BUTTON_SUCCESS}
                        variant={BUTTON_OUTLINE_BLUE}
                      >
                        ເຊັກບິນ
						    			</Button>
                    </div>
                  </div>
                </Container>
              </div>
              : null
          }

        </div>
      </div>
    </div >

  );
};

export default Tables;

const NAV = {
  backgroundColor: '#F9F9F9',
  marginTop: -10,
  paddingTop: 10,
}

const _numberTable = [
  { name: "ໂຕະ 1" },
  { name: "ໂຕະ 2" },
  { name: "ໂຕະ 3" },
  { name: "ໂຕະ 4" },
]



const food = [
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },

]
