import React from "react";
import { BODY } from "../../constants";
import NavList from "./components/NavList";
import { Breadcrumb } from "react-bootstrap";
import { t } from "i18next";

export default function StockCreate() {
  return (
    <div style={BODY}>
      <Breadcrumb>
        <Breadcrumb.Item>{t("stock_manage")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("create_stock")}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}
