import React, { useState } from "react";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen, faPrint } from "@fortawesome/free-solid-svg-icons";
import { END_POINT } from '../../../constants'

/**
 * const
 **/
import {
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_DELETE,
  BUTTON_OUTLINE_PRIMARY,
  BUTTON_DEFUALT,
  BUTTON_EDIT_HOVER,
  BUTTON_DANGER
} from "../../../constants/index";
const CustomNav = (props) => {
  const _prinbill = async () => {
    await window.open(`/BillForChef/?id=${props?.data}`);
  }
  const [editButtonHover, setEditButtonHover] = useState(false)
  return (
    <div>
      <Nav variant="tabs" defaultActiveKey={props.default}>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} href="/orders/pagenumber/1">ອໍເດີເຂົ້າ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} href="/orders/doing/pagenumber/1">ກຳລັງເຮັດ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} href="/orders/served/pagenumber/1">ເສີບແລ້ວ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link style={{color: "#FB6E3B"}}  href="/orders/canceled/pagenumber/1">ຍົກເລີກແລ້ວ</Nav.Link> */}
        </Nav.Item>
        <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
          {props.status ? (
            <Button
              onClick={() => _prinbill()}
              variant={BUTTON_OUTLINE_DANGER}
              style={BUTTON_EDIT}

            >
              <FontAwesomeIcon
                icon={faPrint}
                style={{ float: "left", marginTop: 4 }}
              />
                Print
            </Button>
          ) : (
            <div></div>
          )}
          <div style={{ width: 20 }} />
          <Button
            // onMouseEnter={()=>setEditButtonHover(true)} onMouseLeave={()=>setEditButtonHover(false)}
            onClick={props.handleUpdate}
            // style={editButtonHover ? BUTTON_EDIT_HOVER : BUTTON_DELETE}
            style={BUTTON_EDIT_HOVER}
          // variant={BUTTON_OUTLINE_PRIMARY}
          >
            <FontAwesomeIcon
              icon={faPen}
              style={{ float: "left", marginTop: 4 }}
            />
                ອັບເດດ
              </Button>
        </Nav.Item>
      </Nav>
    </div >
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
