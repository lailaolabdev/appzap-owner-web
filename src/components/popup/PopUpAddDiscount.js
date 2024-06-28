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
  dataBill
}) {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const { storeDetail } = useStore();
  const [selectedButton, setSelectedButton] = useState("%");
  const [Categorys, setCategorys] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [discountCategory, setDiscountCategory] = useState(0);
  const [discountCategoryAmount, setDiscountCategoryAmount] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const [selectedButtonCategory, setSelectedButtonCategory] = useState();

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  const setDiscountBill = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-discount";
      const discountAmount =
        filterCategory !== "All" ? discountCategoryAmount : discount;
      const discountType =
        filterCategory !== "All" ? selectedButtonCategory : selectedButton;
      const _body = {
        id: dataBill?._id,
        data: {
          discount: discountAmount,
          discountType: discountType === "%" ? "PERCENT" : "LAK"
        }
      };
      const _header = await getHeaders();
      const res = await axios.put(url, _body, { headers: _header });
    } catch (err) {
      console.log(err);
    }
  };

  const getcategory = async (id) => {
    try {
      const response = await fetch(
        END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`,
        {
          method: "GET"
        }
      );
      const json = await response.json();
      const orderCategoryIds = value.map((order) => order.categoryId);
      const filteredCategories = json.filter((category) =>
        orderCategoryIds.includes(category._id)
      );
      setCategorys(filteredCategories);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateCategorySum = (categoryId) => {
    const filteredOrders = value.filter(
      (order) => order.categoryId === categoryId
    );
    const categoryTotal = _.sumBy(
      filteredOrders,
      (order) => order.price * order.quantity
    );
    return categoryTotal;
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
    console.log("_sumTotal: ", _sumTotal);
    setTotal(_sumTotal);
    setDiscount(dataBill?.discount);
  }, [value, dataBill]);

  useEffect(() => {
    if (filterCategory !== "All") {
      const total = calculateCategorySum(filterCategory);
      setCategoryTotal(total);
    } else {
      setCategoryTotal(0);
    }
  }, [filterCategory, value]);

  useEffect(() => {
    if (filterCategory !== "All") {
      const discountValue =
        selectedButton === "%"
          ? (categoryTotal * discountCategory) / 100
          : discountCategory;
      setDiscountCategoryAmount(discountValue);
      const newTotal = total - discountValue;
      setAdjustedTotal(newTotal);
    } else {
      setDiscountCategoryAmount(0);
      setAdjustedTotal(total);
    }
  }, [discountCategory, selectedButton, categoryTotal, total, filterCategory]);

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t("discount")}</Modal.Header>
      <Modal.Body>
        <TableCustom>
          <thead>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ສະຖານະ</th>
              <th>ຜູ້ສັ່ງ</th>
              <th>ເວລາ</th>
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
                            : "red"
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
            justifyContent: "flex-end"
          }}
        >
          <div>
            ລວມ: {moneyCurrency(total)} {storeDetail?.firstCurrency}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>ສ່ວນຫຼຸດ</div>
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
                      alignItems: "center"
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
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
                      alignItems: "center"
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
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
            disabled={filterCategory !== "All"}
          />
          <div>{selectedButton}</div>
        </div>
        <hr />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}></div>
        <div >
          <h5>ສ່ວນຫຼຸດປະເພດອາຫານ</h5>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <label style={{ marginRight: "18px" }}>ປະເພດ</label>
          <select
            className="form-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ display: "inline-block", width: "auto" }}
          >
            <option value="All">ເລືອກປະເພດ</option>
            {Categorys &&
              Categorys?.map((data, index) => {
                return (
                  <option key={"category" + index} value={data?._id}>
                    {data?.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>ສ່ວນຫຼຸດ</div>
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
                      alignItems: "center"
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
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
                      alignItems: "center"
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
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
            onClick={() => setDiscountCategory(storeDetail?.firstCurrency)}
            onChange={(e) => {
              setDiscountCategory(e.target.value);
              console.log(discountCategory);
            }}
            disabled={filterCategory === "All"}
          />
          <div>{storeDetail?.firstCurrency}</div>
        </div>

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          ຍອດລວມຂອງປະເພດທີ່ເລືອກ: {moneyCurrency(categoryTotal)}{" "}
          {storeDetail?.firstCurrency}
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          ຍອດຫຼຸດຂອງປະເພດທີ່ເລືອກ: {moneyCurrency(discountCategoryAmount)}{" "}
          {storeDetail?.firstCurrency}
        </div>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          ລວມຫຼັງສ່ວນຫຼຸດ: {moneyCurrency(adjustedTotal)}{" "}
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
          ເພີ່ມສ່ວນຫຼຸດ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 12,
  ["th,td"]: {
    padding: 0
  },
  ["th:first-child"]: {
    maxWidth: 40,
    width: 40
  },
  ["td:first-child"]: {
    maxWidth: 40,
    width: 40
  },
  thead: {
    backgroundColor: "#e9e9e9"
  }
});
