import React from "react";
import { Nav } from "react-bootstrap";
import useReactRouter from "use-react-router";
import { useHistory, useParams } from "react-router-dom";

export default function NavList({ ActiveKey = "/settingStore/stock" }) {
  const History = useHistory();
  const { id } = useParams();
  // functions
  const _menuList = () => {
    History.push(`/settingStore/stock/limit/40/page/1/${id}`);
  };
  const _category = () => {
    History.push(`/settingStore/stock/category/limit/40/page/1/${id}`);
  };
  const _history = () => {
    History.push(`/settingStore/stock/history/limit/40/page/1/${id}`);
  };
  return (
    <div>
      <Nav variant='tabs' defaultActiveKey={ActiveKey}>
        <Nav.Item>
          <Nav.Link eventKey='/settingStore/stock' onClick={() => _menuList()}>
            ສະຕ໊ອກທັງໝົດ
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey='/settingStore/stock/category'
            onClick={() => _category()}>
            ປະເພດສະຕ໊ອກ
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey='/settingStore/stock/history'
            onClick={() => _history()}>
            ປະຫວັດສະຕ໊ອກ
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
