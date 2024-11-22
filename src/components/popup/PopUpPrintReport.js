import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import { BsPrinter } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export default function PopUpPrintReport({ open, onClose, setPopup }) {
  const { t } = useTranslation();
  // state

  // useEffect

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <BsPrinter /> {t("chose_print_product")}
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportSale: true })}
          >
            <span>{t("bill_history")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportStaffSale: true })}
          >
            <span>{t("staff_history")}</span>
          </Button>
          <Button style={{ height: 100, padding: 20 }} disabled>
            <span>{t("sales_history")}</span>
          </Button>

          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuSale: true })}
          >
            <span>{t("menu_list")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuCategorySale: true })}
          >
            <span>{t("menu_type_list")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuAndCategorySale: true })}
          >
            <span>{t("menu_and_type_list")}</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ delivery: true })}
          >
            <span>Delivery</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
