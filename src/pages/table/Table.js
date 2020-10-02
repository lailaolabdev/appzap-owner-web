
/**
 * Library
 * */
import React from "react"
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

/**
 * component
 * */
import Loading from '../../constants/loading'


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
  font_text_black



} from "../../constants/index"

/**
 * css
 * **/

const Tables = () => {
  const { history, location, match } = useReactRouter();
  var numberPage = match.params.pagenumber


  const _onHandlerTable = () => {
    console.log("click Table number")
  }

  return (

    <div style={TITLE_HEADER}>
      <h6 style={HEADER}>
        <a href={"#"}>
          ໝວດໃຫຍ່ທັງໝົດ
				</a>{' '}
				»{' '}
        <span>
          Hello
          </span>
      </h6>
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
        <div style={BODY} style={{ display: "flex", paddingBottom: 20, minHeight: "75vh", }}>
          <div style={half_backgroundColor}>
            <Container fluid>
              <Row>
                <div style={half_backgroundColor}>
                  <Col sm={8}>
                    {_numberTable.map((index, key) => {
                      return (
                        <div
                          style={table_container}
                          onClick={() => { _onHandlerTable() }}
                        >

                          <div style={table_style_center}>
                            <span style={font_text}>{index.name}</span>
                          </div>
                          <div style={table_style_center}>
                            <span style={font_description_text}>(ວ່າງ)</span>
                          </div>

                        </div>
                      )
                    })}
                  </Col>
                </div>
                {/* BLUE */}
                <div style={half_backgroundColor}>
                  <Col sm={8}>
                    {_numberTable_WHITE.map((index, key) => {
                      return (
                        <div
                          key={index}
                          style={table_container_blue}
                          onClick={() => { _onHandlerTable() }}
                        >
                          <div style={table_style_center}>
                            <span style={font_text_black}>{index.name}</span>
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
          <div style={{
            width: "50%", backgroundColor: "#FFF",
            minHeight: "75vh", borderColor: "black",
            borderWidth: 1,
            paddingLeft: 20,
            paddingTop: 20
          }}>
            <Container fluid>
              <Row>
                <Col sm={6}>
                  <span style={PRIMARY_FONT_BLACK}>ໂຕະ1</span>
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
                      <td>{value.price}</td>
                      <td>{value.status}</td>
                      <td>{value.datetime}</td>
                    </tr>
                  )
                })}
              </Table>
            </Container>

            {/*  */}

            {/*  */}
          </div>
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

const _numberTable_WHITE = [
  { name: "ໂຕະ 1 ຂາວ" },
  { name: "ໂຕະ 2 ຂາວ" },
  { name: "ໂຕະ 3 ຂາວ" },
  { name: "ໂຕະ 4 ຂາວ" },
]

const food = [
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },
  { menu: "ຕົ້ມຊໍາກຸ້ງ", price: "3", status: "ກໍາລັງຄົວ", datetime: "11-09-2020" },

]
