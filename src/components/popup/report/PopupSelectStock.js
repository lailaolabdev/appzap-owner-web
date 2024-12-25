import { React, useState, useEffect } from "react";
import { Modal, Button, InputGroup, Table, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PopupMenuStock from "./PopupMenuStock";

export default function PopupSelectStock({ open, onClose, categoryMenu }) {
  const { t } = useTranslation();
  const [prepaDatas, setPrepaDatas] = useState([]);
  const [popup, setPopup] = useState();

  const onSelectSigleStoks = (selectedProduct) => {
    setPrepaDatas(selectedProduct);
  };

  const onConfirm = () => {
    setPopup({ PopupMenuStock: true });
    onClose();
  };

  return (
    <div>
      <Modal show={open} onHide={onClose} className="modal-select-stock">
        <Modal.Title className="m-4 flex justify-between">
          {t("create_stock")}{" "}
          <Button onClick={onConfirm}>{t("confirm")}</Button>{" "}
        </Modal.Title>
        <hr></hr>
        <Modal.Body>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>{t("no")}</th>
                <th style={{ textAlign: "center" }}>{t("stock_name")}</th>
              </tr>
            </thead>
            <tbody>
              {categoryMenu &&
                categoryMenu.map((item, index) => (
                  <tr key={index}>
                    <td style={{ justifyItems: "center" }}>
                      <div style={{ width: 30 }}>
                        <Form.Check
                          type="radio"
                          name="stockSelect"
                          id={index + 1}
                          onChange={() => onSelectSigleStoks(item)}
                          checked={prepaDatas === item}
                          label={index + 1}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>{item.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <PopupMenuStock
        open={popup?.PopupMenuStock}
        onClose={setPopup}
        categoryId={prepaDatas?._id}
      />
    </div>
  );
}
