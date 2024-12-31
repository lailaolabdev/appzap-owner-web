import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  InputGroup,
  Table,
  Form,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getMenus } from "../../../services/menu";
import { useStore } from "../../../store";
import { useNavigate } from "react-router-dom";

import { useStoreStore } from "../../../zustand/storeStore";

export default function PopupMenuStock({ open, onClose, categoryId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { storeDetail } = useStoreStore()
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const confirm = () => {
    navigate("/settingStore/stock/add");
    const selectedStockDetails = selectedStocks.map((stock) => ({
      name: stock.name,
      quantity: stock.quantity,
      categoryName: stock.categoryId.name,
      categoryId: stock.categoryId._id,
    }));
    localStorage.setItem("StockName", JSON.stringify(selectedStockDetails));
  };

  useEffect(() => {
    getMenu();
    setSelectedStocks([]);
  }, [open]);

  const getMenu = async () => {
    try {
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += categoryId ? `categoryId=${categoryId}` : "";

      const resMenu = await getMenus(findby);
      setStock(resMenu);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onSelectStocksAll = async () => {
    if (isSelectAll) {
      setSelectedStocks([]);
      setIsSelectAll(false);
    } else {
      const _stocksNew = [];
      // console.log("stocks:--new-->", stocks);
      stock.map((item) => {
        _stocksNew.push(item);
      });
      setSelectedStocks(_stocksNew);
      setIsSelectAll(true);
    }
    return;
  };

  const onSelectSigleStoks = (selectedProduct) => {
    const exists = selectedStocks.some(
      (product) => product._id === selectedProduct._id
    );

    if (exists) {
      // If the product is already in the array, remove it
      const filteredProducts = selectedStocks.filter(
        (product) => product._id !== selectedProduct._id
      );
      setSelectedStocks(filteredProducts);
    } else {
      // If the product is not in the array, add it
      const updatedProducts = [...selectedStocks, selectedProduct];
      setSelectedStocks(updatedProducts);
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      getMenu().finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <div>
      <Modal show={open} onHide={onClose} className="modal-select-stock">
        <Modal.Title className="m-4 flex justify-between">
          {t("create_stock")}{" "}
          <Button onClick={() => confirm()}>{t("confirm")}</Button>{" "}
        </Modal.Title>
        <hr></hr>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">{t("loading")}</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{ textAlign: "left", textWrap: "nowrap" }}
                  >
                    <Form.Check
                      onClick={() => onSelectStocksAll()}
                      label={t("no")}
                      id={t("no")}
                    />
                  </th>
                  <th style={{ textAlign: "center" }}>{t("stock_name")}</th>
                  <th style={{ textAlign: "center" }}>{t("type")}</th>
                  <th style={{ textAlign: "center" }}>{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {stock &&
                  stock.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ width: 30 }}>
                          {isSelectAll ? (
                            <Form.Check
                              checked={true}
                              label={index + 1}
                              readOnly
                            />
                          ) : (
                            <Form.Check
                              type="checkbox"
                              id={index + 1}
                              onChange={() => onSelectSigleStoks(item)}
                              label={index + 1}
                            />
                          )}
                        </div>
                      </td>
                      {/* <td style={{ textAlign: "left" }}>
                        <Form.Check
                          name="stockSelect"
                          id={index + 1}
                          label={index + 1}
                        />
                      </td> */}
                      <td style={{ textAlign: "center" }}>{item?.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {item?.categoryId.name}
                      </td>
                      <td style={{ textAlign: "center" }}>{item?.quantity}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
