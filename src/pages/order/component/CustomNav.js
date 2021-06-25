import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen, faPrint } from "@fortawesome/free-solid-svg-icons";
import { getLocalData } from '../../../constants/api'
import {
  BUTTON_EDIT,
  BUTTON_OUTLINE_DANGER,
  BUTTON_EDIT_HOVER,
} from "../../../constants/index";
import useReactRouter from "use-react-router"

const CustomNav = (props) => {
  const { match, history } = useReactRouter();
  const [getTokken, setgetTokken] = useState()
  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData()
      if (_localData) {
        setgetTokken(_localData)
      }
    }
    fetchData();
  }, [])
  const _prinbill = async () => {
    await window.open(`/BillForChef/?id=${props?.data}`);
  }
  const _order = () => {
    history.push(`/orders/pagenumber/1/${getTokken?.DATA?.storeId}`)
  }
  const _doing = () => {
    history.push(`/orders/doing/pagenumber/1/${getTokken?.DATA?.storeId}`)
  }
  const _served = () => {
    history.push(`/orders/served/pagenumber/1/${getTokken?.DATA?.storeId}`)
  }
  return (
    <div>
      <Nav variant="tabs" defaultActiveKey={props.default}>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} onClick={() => _order()}>ອໍເດີເຂົ້າ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} onClick={() => _doing()}>ກຳລັງເຮັດ</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link style={{ color: "#FB6E3B" }} onClick={() => _served()}>ເສີບແລ້ວ</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
          {props?.data?.length !== 0 ? (
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
            onClick={props.handleUpdate}
            style={BUTTON_EDIT_HOVER}
          >
            <FontAwesomeIcon
              icon={faPen}
              style={{ float: "left", marginTop: 4 }}
            />
                ອັບເດດ
              </Button>
        </Nav.Item> */}
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
