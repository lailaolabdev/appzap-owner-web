import React, { useEffect } from "react";
import { Modal, Button, InputGroup, Table, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getMenus } from "../../../services/menu";
import { useStore } from "../../../store";

export default function PopupMenuStock({ open, onClose, categoryId }) {
  const { t } = useTranslation();
  const { storeDetail } = useStore();

  const confirm = () => {
    console.log("confirm");
  };

  useEffect(() => {
    getMenu();
  }, [open]);

  const getMenu = async () => {
    try {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += categoryId ? `categoryId=${categoryId}` : "";

      const resMenu = await getMenus(findby);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <Modal show={open} onHide={onClose} className="modal-select-stock">
        <Modal.Title className="m-4 flex justify-between">
          {t("create_stock")}{" "}
          <Button onClick={() => confirm}>{t("confirm")}</Button>{" "}
        </Modal.Title>
        <hr></hr>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
