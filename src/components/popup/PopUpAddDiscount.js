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
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Separator } from "../../components/ui/Separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Button as CustomButton } from "../../components/ui/Button";
import { useStoreStore } from "../../zustand/storeStore";

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
  const { tableOrderItems } = useStore();
  const { storeDetail } = useStoreStore();
  const [selectedButton, setSelectedButton] = useState("%");
  const [categorysType, setCategorysType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [discountCategory, setDiscountCategory] = useState(0);
  const [discountOrder, setDiscountOrder] = useState(0);
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
      const calculatedDiscount = (categoryTotal * discountCategory) / 100;
      const totalDiscount = Math.floor(calculatedDiscount);
      setDiscountOrder(totalDiscount);
    } else {
      setDiscountOrder(discountCategory);
    }
  }, [discountCategory]);

  useEffect(() => {
    getCategoryType(storeDetail?._id);
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
      const _header = await getHeaders();
      const res = await axios.put(url, _body, { headers: _header });
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryType = async (id) => {
    try {
      const res = await axios({
        method: "GET",
        url: END_POINT_SEVER + `/v3/category-type?storeId=${id}`,
      });
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
      setFilteredCategories(filteredCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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
    const data = value.filter(
      (e) => e?.status === "SERVED" && e?.status !== "DOING"
    );

    const _sumTotal = _.sumBy(data, (o) => o?.price * o?.quantity);
    const _sumOptionPrice = data.reduce((sum, item) => {
      const optionSum = _.sumBy(
        item.options,
        (option) => option.price * option?.quantity ?? 1
      );
      return sum + optionSum;
    }, 0);
    setTotal(_sumTotal + _sumOptionPrice);
    setDiscount(dataBill?.discount);
  }, [open]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId !== "All") {
      const filteredCategoriesType = filteredCategories.filter(
        (category) => category?.categoryTypeId === selectedCategoryId
      );

      const checked = value.filter(
        (e) => e?.status === "SERVED" && e?.status !== "DOING"
      );

      const filteredOrders = checked.filter((order) =>
        filteredCategoriesType.some(
          (category) => category?._id === order?.categoryId
        )
      );

      setFilteredOrders(filteredOrders);
      const totalForSelectedCategory = _.sumBy(
        filteredOrders,
        (o) => o.price * o.quantity
      );

      const _sumOptionPrice = filteredOrders.reduce((sum, item) => {
        const optionSum = _.sumBy(
          item.options,
          (option) => option.price * option?.quantity ?? 1
        );
        return sum + optionSum;
      }, 0);

      const totalDiscount =
        ((totalForSelectedCategory + _sumOptionPrice) * discountCategory) / 100;
      setCategoryTotal(totalForSelectedCategory + _sumOptionPrice);
      setDiscountOrder(totalDiscount);
    } else {
      const data = value.filter(
        (e) => e?.status !== "CANCEL" && e?.status !== "DOING"
      );
      const _sumTotal = _.sumBy(data, (o) => o.price * o.quantity);
      const _sumOptionPrice = data.reduce((sum, item) => {
        const optionSum = _.sumBy(
          item.options,
          (option) => option.price * option?.quantity ?? 1
        );
        return sum + optionSum;
      }, 0);
      setCategoryTotal(_sumTotal + _sumOptionPrice);
      setDiscountOrder(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="text-start sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("discount")}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 font-medium">{t("no")}</TableHead>
                <TableHead className="font-medium">{t("menu_name")}</TableHead>
                <TableHead className="w-16 font-medium">{t("qty")}</TableHead>
                <TableHead className="font-medium">{t("status")}</TableHead>
                <TableHead className="font-medium">{t("who_order")}</TableHead>
                <TableHead className="font-medium">{t("time")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {value
                ? value?.map((orderItem, index) => (
                    <TableRow
                      key={"order" + index}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{orderItem?.name}</TableCell>
                      <TableCell>{orderItem?.quantity}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            orderItem?.status === "SERVED"
                              ? "bg-green-100 text-green-800"
                              : orderItem?.status === "DOING"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {orderItem?.status
                            ? orderStatus(orderItem?.status)
                            : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>{orderItem?.createdBy?.firstname}</TableCell>
                      <TableCell>
                        {orderItem?.createdAt
                          ? moment(orderItem?.createdAt).format("HH:mm")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                : ""}
            </TableBody>
          </Table>

          <div className="py-2 text-right">
            <p className="font-semibold text-lg">
              {t("total")}: {moneyCurrency(total)} {storeDetail?.firstCurrency}
            </p>
          </div>
          <hr />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>{t("discount")}</div>
            <div className="flex border border-gray-300 rounded-md">
              <CustomButton
                onClick={() => setSelectedButton("%")}
                className={`w-10 h-10 flex items-center justify-center ${
                  selectedButton === "%"
                    ? "bg-color-app text-white"
                    : "bg-white"
                }`}
              >
                %
              </CustomButton>
              <CustomButton
                onClick={() => setSelectedButton(storeDetail?.firstCurrency)}
                className={`w-10 h-10 flex items-center justify-center ${
                  selectedButton === storeDetail?.firstCurrency
                    ? "bg-color-app text-white"
                    : "bg-white"
                }`}
              >
                {storeDetail?.firstCurrency}
              </CustomButton>
            </div>
            <Input
              onKeyDown={preventNegativeValues}
              type="number"
              value={discount}
              min="0"
              className="w-32 h-10"
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
            <div className="flex border border-gray-300 rounded-md">
              <CustomButton
                onClick={() => setSelectedButtonCategory("%")}
                className={`w-10 h-10 flex items-center justify-center ${
                  selectedButtonCategory === "%"
                    ? "bg-color-app text-white"
                    : "bg-white"
                }`}
              >
                %
              </CustomButton>
              <CustomButton
                onClick={() =>
                  setSelectedButtonCategory(storeDetail?.firstCurrency)
                }
                className={`w-10 h-10 flex items-center justify-center ${
                  selectedButtonCategory === storeDetail?.firstCurrency
                    ? "bg-color-app text-white"
                    : "bg-white"
                }`}
              >
                {storeDetail?.firstCurrency}
              </CustomButton>
            </div>

            <div style={{ display: "flex", border: "1px solid #ccc" }}></div>
            <Input
              type="number"
              onKeyDown={preventNegativeValues}
              value={discountCategory}
              min="0"
              className="w-32 h-10"
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
        </div>
        <hr />
        <div className="flex justify-end">
          <CustomButton
            disabled={buttonDisabled}
            className="bg-color-app text-white rounded-md text-lg"
            // style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
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
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
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
