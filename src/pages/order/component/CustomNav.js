import React from "react";
import { Nav } from "react-bootstrap";
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
    </Nav>
  );
};

export default CustomNav;
