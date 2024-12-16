import React from "react";
import { Breadcrumb, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavList({ ActiveKey = "/settingStore/stock" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  // functions
  const _currentStock = () => {
    navigate(`/settingStore/reportStock`);
  };
  const _menuList = () => {
    navigate(`/settingStore/stock/limit/40/page/1/${id}`);
  };
  const _category = () => {
    navigate(`/settingStore/stock/category/limit/40/page/1/${id}`);
  };
  const _history = () => {
    navigate(`/settingStore/stock/history/limit/40/page/1/${id}`);
  };
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>{t("restaurant_setting")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("stock_manage")}</Breadcrumb.Item>
      </Breadcrumb>
      <Nav variant="tabs" defaultActiveKey={ActiveKey}>
        <Nav.Item>
          <Nav.Link
            eventKey="/settingStore/reportStock"
            onClick={() => _currentStock()}
          >
            {t("current_stock")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/settingStore/stock" onClick={() => _menuList()}>
            {t("all_stock")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/settingStore/stock/category"
            onClick={() => _category()}
          >
            {t("stock_type")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/settingStore/stock/history"
            onClick={() => _history()}
          >
            {t("stock_history")}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
