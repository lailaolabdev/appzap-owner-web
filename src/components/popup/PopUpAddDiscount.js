import React, { useState, useEffect } from "react";
import { Modal, Button, Row } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import moment from "moment";
import styled from "styled-components";
import { moneyCurrency, orderStatus } from "../../helpers";
import * as _ from "lodash";
import axios from "axios";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";

export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

export default function PopUpAddDiscount({
  open,
  value,
  onClose,
  onSubmit,
  dataBill,
}) {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const { storeDetail } = useStore();
  const [selectedButton, setSelectedButton] = useState("%");
  const [Categorys, setCategorys] = useState([]);
  const [categorysType, setCategorysType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [discountCategory, setDiscountCategory] = useState(0);
  const [discountOrder, setDiscountOrder] = useState(0);
  const [discountCategoryAmount, setDiscountCategoryAmount] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const [selectedButtonCategory, setSelectedButtonCategory] = useState("%");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (selectedButtonCategory === "%") {
      const totalDiscount = (categoryTotal * discountCategory) / 100;
      setDiscountOrder(totalDiscount);
    } else {
      setDiscountOrder(discountCategory);
    }
  }, [discountCategory]);

  useEffect(() => {
    getCategoryType();
  }, [open]);

  const setDiscountBill = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-discount";
      const discountAmount =
        selectedCategory !== "All" ? discountOrder : discount;
      const discountType =
        selectedCategory !== "All"
          ? selectedButtonCategory === "LAK"
          : selectedButton;
      const _body = {
        id: dataBill?._id,
        data: {
          discount: discountAmount,
          discountType: discountType === "%" ? "PERCENT" : "LAK",
        },
      };
      console.log("BODY: ", _body);
      const _header = await getHeaders();
      const res = await axios.put(url, _body, { headers: _header });
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryType = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: END_POINT_SEVER + `/v3/categoroy-type`,
      });
      console.log("CATEGORYTYPE: ", res.data.data);
      setCategorysType(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getcategory = async (id) => {
    try {
      const response = await fetch(
        END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`,
        {
          method: "GET",
        }
      );
      const json = await response.json();

      const orderCategoryIds = value.map((order) => order.categoryId);
      const filteredCategories = json.filter((category) =>
        orderCategoryIds.includes(category._id)
      );
      console.log("filteredCategories", filteredCategories);
      setFilteredCategories(filteredCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("Categorys:", Categorys);
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          getcategory(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    const data = value.filter((e) => e?.status !== "CANCEL");
    const _sumTotal = _.sumBy(data, (o) => o?.price * o?.quantity);
    setTotal(_sumTotal);
    setDiscount(dataBill?.discount);
  }, [value, dataBill, open]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId !== "All") {
      const filteredCategoriesType = filteredCategories.filter(
        (category) => category?.categoryTypeId === selectedCategoryId
      );

      const filteredOrders = value.filter((order) =>
        filteredCategoriesType.some(
          (category) => category?._id === order?.categoryId
        )
      );

      setFilteredOrders(filteredOrders);

      const totalForSelectedCategory = _.sumBy(
        filteredOrders,
        (o) => o.price * o.quantity
      );
      const totalDiscount = (totalForSelectedCategory * discountCategory) / 100;
      setCategoryTotal(totalForSelectedCategory);
      // setDiscountCategory(dataBill?.discount);
      setDiscountOrder(totalDiscount);
      console.log("OrderPrice: ", totalDiscount);
      // if (discountCategory === "%") {

      // }
    } else {
      const _sumTotal = _.sumBy(value, (o) => o.price * o.quantity);
      setCategoryTotal(_sumTotal);
      setDiscountOrder(0);
    }
  };

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t("discount")}</Modal.Header>
      <Modal.Body>
        <TableCustom>
          <thead>
            <tr>
              <th>{t("no")}</th>
              <th>{t("menu_name")}</th>
              <th>{t("qty")}</th>
              <th>{t("status")}</th>
              <th>{t("who_order")}</th>
              <th>{t("time")}</th>
            </tr>
          </thead>
          <tbody>
            {value
              ? value?.map((orderItem, index) => (
                  <tr
                    key={"order" + index}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td>{index + 1}</td>
                    <td>{orderItem?.name}</td>
                    <td>{orderItem?.quantity}</td>
                    <td
                      style={{
                        color:
                          orderItem?.status === `SERVED`
                            ? "green"
                            : orderItem?.status === "DOING"
                            ? ""
                            : "red",
                      }}
                    >
                      {orderItem?.status ? orderStatus(orderItem?.status) : "-"}
                    </td>
                    <td>{orderItem?.createdBy?.firstname}</td>
                    <td>
                      {orderItem?.createdAt
                        ? moment(orderItem?.createdAt).format("HH:mm A")
                        : "-"}
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </TableCustom>
        <div
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>
            {t("total")}: {moneyCurrency(total)} {storeDetail?.firstCurrency}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>{t("discount")}</div>
          <div style={{ display: "flex", border: "1px solid #ccc" }}>
            <div
              onClick={() => setSelectedButton("%")}
              style={
                selectedButton !== ""
                  ? {
                      backgroundColor:
                        selectedButton === "%" ? COLOR_APP : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              %
            </div>
            <div
              onClick={() => setSelectedButton(storeDetail?.firstCurrency)}
              style={
                selectedButton !== ""
                  ? {
                      backgroundColor:
                        selectedButton === storeDetail?.firstCurrency
                          ? COLOR_APP
                          : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <input
            onKeyDown={preventNegativeValues}
            type="number"
            value={discount}
            min="0"
            style={{ height: 40 }}
            onChange={(e) => {
              setDiscount(e.target.value);
            }}
            disabled={selectedCategory !== "All"}
          />
          <div>{selectedButton}</div>
        </div>
        <hr />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}></div>
        <div>
          <h5>{t("discount_for_food")}</h5>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <label style={{ marginRight: "18px" }}>{t("type")}</label>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ display: "inline-block", width: "auto" }}
          >
            <option value="All">{t("chose_type")}</option>
            {categorysType &&
              categorysType?.map((data, index) => {
                return (
                  <option key={"categoryType" + index} value={data?._id}>
                    {data?.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>{t("discount")}</div>
          <div style={{ display: "flex", border: "1px solid #ccc" }}>
            <div
              onClick={() => setSelectedButtonCategory("%")}
              style={
                selectedButtonCategory !== ""
                  ? {
                      backgroundColor:
                        selectedButtonCategory === "%" ? COLOR_APP : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              %
            </div>
            <div
              onClick={() =>
                setSelectedButtonCategory(storeDetail?.firstCurrency)
              }
              style={
                setSelectedButtonCategory !== ""
                  ? {
                      backgroundColor:
                        selectedButtonCategory === storeDetail?.firstCurrency
                          ? COLOR_APP
                          : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              {storeDetail?.firstCurrency}
            </div>
          </div>

          <div style={{ display: "flex", border: "1px solid #ccc" }}></div>
          <input
            onKeyDown={preventNegativeValues}
            type="number"
            value={discountCategory}
            min="0"
            style={{ height: 40 }}
            onChange={(e) => {
              setDiscountCategory(e.target.value);
            }}
            disabled={selectedCategory === "All"}
          />
          <div>{selectedButtonCategory}</div>
        </div>
        <div
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {t("total")}: {moneyCurrency(categoryTotal)}{" "}
          {storeDetail?.firstCurrency}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {t("discount_for_food")}: {moneyCurrency(discountOrder)}{" "}
          {storeDetail?.firstCurrency}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={async () => {
            setButtonDisabled(true);
            await setDiscountBill();
            onSubmit().then(() => {
              onClose();
              setButtonDisabled(false);
            });
          }}
        >
          {t("append_discount")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 12,
  ["th,td"]: {
    padding: 0,
  },
  ["th:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  ["td:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
