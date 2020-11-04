import React from "react";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons";

/**
 * const
 **/
import {
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_DELETE,
  BUTTON_OUTLINE_PRIMARY,
} from "../../../constants/index";
const CustomNav = (props) => {
  return (
    <div>
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
          <Col sm={6}>{/* <span style={PRIMARY_FONT_BLACK}>ໂຕະ1</span> */}</Col>
          <Col sm={3}>
            {props.status ? (
              <Button
                onClick={props.handleCancel}
                style={BUTTON_EDIT}
                variant={BUTTON_OUTLINE_DANGER}
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{ float: "left", marginTop: 4 }}
                />
                ຍົກເລີກ
              </Button>
            ) : (
              <p></p>
            )}
            {"\t"}
          </Col>
          {!props.cantUpdate ? (
            <Col sm={3}>
              <Button
                onClick={props.handleUpdate}
                style={BUTTON_DELETE}
                variant={BUTTON_OUTLINE_PRIMARY}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ float: "left", marginTop: 4 }}
                />
                ອັບເດດ
              </Button>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Nav>
    </div>
  );
};

CustomNav.propTypes = {
  handleUpdate: PropTypes.func,
  status: PropTypes.bool,
  handleCancel: PropTypes.func,
  default: PropTypes.string.isRequired,
  cantUpdate: PropTypes.bool,
};
export default CustomNav;
