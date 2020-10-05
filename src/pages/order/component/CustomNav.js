import React from "react";
import { Nav } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrashAlt,
  faPen,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'

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
  font_text_black, BUTTON_OUTLINE_PRIMARY



} from "../../../constants/index"
const CustomNav = (props) => {
  return (
    <Nav variant="tabs" defaultActiveKey={props.default}>
      <Nav.Item>
        <Nav.Link href="/orders/pagenumber/1">ອໍເດີເຂົ້າ</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/orders/doing/pagenumber/1">ກຳລັງເຮັດ</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/orders/served/pagenumber/1">ເສີບແລ້ວ</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/orders/canceled/pagenumber/1">ຍົກເລີກແລ້ວ</Nav.Link>
      </Nav.Item>
      <Row style={{ marginLeft: 500 }}>
                <Col sm={6}>
                  {/* <span style={PRIMARY_FONT_BLACK}>ໂຕະ1</span> */}
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
                    variant={BUTTON_OUTLINE_PRIMARY}
                  >
                    <FontAwesomeIcon
                      icon={faPen}
                      style={{ float: 'left', marginTop: 4 }}
                    />
										ອັບເດດ
									</Button>
                </Col>
              </Row>
    </Nav>
  );
};

export default CustomNav;
