import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Nav, Tab } from "react-bootstrap";
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
import { useMenuStore } from "../../zustand/menuStore";

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
  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();
  const [selectedButton, setSelectedButton] = useState("%");
  const [categorysType, setCategorysType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [discountCategory, setDiscountCategory] = useState(0);
  const [discountOrder, setDiscountOrder] = useState(0);
  const [selectedButtonCategory, setSelectedButtonCategory] = useState("%");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedCategoryButton, setSelectedCategoryButton] = useState(null);
  const [filteredMenus, setFilteredMenus] = useState([]);

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
      setDiscountOrder(parseFloat(discountCategory) || 0);
    }
  }, [discountCategory, selectedButtonCategory, categoryTotal]);

  useEffect(() => {
    const fetchData = async () => {
      getCategoryType(storeDetail?._id);
      if (!menus.length || !menuCategories.length) {
        // If menus or categories are not found, fetch them
        if (!menus.length) {
          const fetchedMenus = await getMenus(storeDetail?._id);
          setMenus(fetchedMenus); // Save to zustand store
        }
        if (!menuCategories.length) {
          const fetchedCategories = await getMenuCategories(storeDetail?._id);
          setMenuCategories(fetchedCategories); // Save to zustand store
        }
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const setDiscountBill = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-discount";

      // Determine discount amount and type based on active tab
      let discountAmount, discountType;

      if (activeTab === "general") {
        discountAmount = discount;
        discountType = selectedButton === "%" ? "PERCENT" : "LAK";
      } else {
        // Category discount
        discountAmount = selectedCategory !== "All" ? discountOrder : 0;
        discountType =
          selectedCategory !== "All"
            ? selectedButtonCategory === "%"
              ? "PERCENT"
              : "LAK"
            : "LAK";
      }

      const _body = {
        id: dataBill?._id,
        data: {
          discount: discountAmount,
          discountType: discountType,
          // Optional: Add category info if it's a category discount
          ...(activeTab === "category" &&
            selectedCategory !== "All" && {
              categoryTypeId: selectedCategory,
              discountScope: "CATEGORY",
            }),
        },
      };

      const _header = await getHeaders();
      const res = await axios.put(url, _body, { headers: _header });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to send menuId to API when category button is selected
  const sendCategoryDiscountToAPI = async (categoryData) => {
    try {
      const _header = await getHeaders();
      // const menuIds = filteredMenus.map((item) => item.menuId);
      const menuId = filteredMenus.map((item) => {
        return {
          menuId: item.menuId,
          quantity: item.quantity,
        }
      });
      const _body = {
        id: dataBill?._id,
        data: {
          discount: discountCategory.toString(),
          discountType: selectedButtonCategory === "%" ? "PERCENT" : "LAK",
          // menuId: categoryData.menuId || []
          menuId: menuId,
          
        },
      };
      // console.log("body", _body);
      const url = END_POINT_SEVER + "/v3/bill-discount-category";
      const res = await axios.put(url, _body, { headers: _header });

      return res.data;
    } catch (error) {
      console.log("Error sending category discount:", error);
      throw error;
    }
  };

  console.log("filteredMenus", filteredMenus);

  // Handle category button selection (without immediate API call)
  const handleCategoryButtonSelect = (categoryData) => {
    try {
      setSelectedCategoryButton(categoryData._id);
      setSelectedCategory(categoryData._id);

      // Filter menus based on categoryData.menuId array
      if (categoryData.menuId && Array.isArray(categoryData.menuId)) {
        const filteredMenusFromCategory = value.filter((menu) =>
          categoryData.menuId.includes(menu?.menuId)
        );
        setFilteredMenus(filteredMenusFromCategory);
      } else {
        setFilteredMenus([]);
      }

      if (categoryData._id !== "All") {
        const filteredCategoriesType = filteredCategories.filter(
          (category) => category?.categoryTypeId?._id === categoryData._id
        );

        const checked = value.filter(
          (e) => e?.status === "SERVED" && e?.status !== "DOING"
        );

        const filteredOrders = checked.filter((order) =>
          filteredCategoriesType.some(
            (category) => category?._id === order?.categoryId?._id
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
          ((totalForSelectedCategory + _sumOptionPrice) * discountCategory) /
          100;
        setCategoryTotal(totalForSelectedCategory + _sumOptionPrice);
        setDiscountOrder(totalDiscount);
      } else {
        // Reset filtered menus when "All" is selected
        setFilteredMenus([]);
      }
    } catch (error) {
      console.log("Error in category button selection:", error);
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

      const orderCategoryIds = value.map((order) => order.categoryId?._id);
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
    setCategoryTotal(_sumTotal + _sumOptionPrice); // Initialize category total
    setDiscount(dataBill?.discount);

    // Reset category-related states when modal opens
    setSelectedCategory("All");
    setDiscountCategory(0);
    setDiscountOrder(0);
    setSelectedButtonCategory("%");
    setFilteredOrders([]);
    setSelectedCategoryButton("All");
    setFilteredMenus([]);
  }, [open]);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId !== "All") {
      const filteredCategoriesType = filteredCategories.filter(
        (category) => category?.categoryTypeId?._id === selectedCategoryId
      );

      const checked = value.filter(
        (e) => e?.status === "SERVED" && e?.status !== "DOING"
      );

      const filteredOrders = checked.filter((order) =>
        filteredCategoriesType.some(
          (category) => category?._id === order?.categoryId?._id
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

  const handleClose = () => {
    // Reset all states when closing
    setSelectedCategory("All");
    setDiscountCategory(0);
    setDiscountOrder(0);
    setSelectedButtonCategory("%");
    setCategoryTotal(0);
    setFilteredOrders([]);
    setFilteredCategories([]);
    setDiscount(0);
    setActiveTab("general");
    setSelectedCategoryButton("All");
    setFilteredMenus([]);
    onClose();
  };

  return (
    <Modal show={open} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("discount")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="overflow-x-auto h-[300px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">{t("no")}</TableHead>
                <TableHead className="font-medium text-center">
                  {t("menu_name")}
                </TableHead>
                <TableHead className="font-medium text-center">
                  {t("qty")}
                </TableHead>
                <TableHead className="font-medium text-center">
                  {t("status")}
                </TableHead>
                <TableHead className="font-medium text-center">
                  {t("who_order")}
                </TableHead>
                <TableHead className="font-medium text-end">
                  {t("time")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {value
                ? value?.map((orderItem, index) => (
                    <TableRow
                      key={"order" + index}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {orderItem?.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {orderItem?.quantity}
                      </TableCell>
                      <TableCell className="text-center">
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
                      <TableCell className="text-right">
                        {orderItem?.createdAt
                          ? moment(orderItem?.createdAt).format("HH:mm A")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                : ""}
            </TableBody>
          </Table>
        </div>

        {/* Total Section */}
        <div className="py-2 text-right">
          <p className="font-semibold text-lg">
            {t("total")}: {moneyCurrency(total)} {storeDetail?.firstCurrency}
          </p>
        </div>
        <hr />

        {/* Tabs for Discount Types */}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="general">{t("general_discount")}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="category">{t("category_discount")}</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* General Discount Tab */}
            <Tab.Pane eventKey="general">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "20px",
                }}
              >
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
                    onClick={() =>
                      setSelectedButton(storeDetail?.firstCurrency)
                    }
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
                />
                <div>{selectedButton}</div>
              </div>

              {/* General Discount Summary */}
              {discount > 0 && (
                <div
                  style={{
                    backgroundColor: "#e8f5e8",
                    border: "1px solid #c3e6c3",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#2e7d32",
                    }}
                  >
                    {t("discount_applied")}: {discount}
                    {selectedButton}
                  </div>
                </div>
              )}
            </Tab.Pane>

            {/* Category Discount Tab */}
            <Tab.Pane eventKey="category">
              <div>
                <h6 className="mb-3">{t("discount_for_food")}</h6>
              </div>

              {/* Category Type Buttons */}
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                <label
                  style={{
                    marginBottom: "10px",
                    display: "block",
                    fontWeight: "600",
                  }}
                >
                  {t("select_category_type")}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {/* <CustomButton
                     onClick={() => {
                       setSelectedCategoryButton("All");
                       setSelectedCategory("All");
                       setDiscountOrder(0);
                       setFilteredOrders([]);
                       setFilteredMenus([]);
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
                     }}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      selectedCategoryButton === "All"
                        ? "bg-color-app text-white border-color-app"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t("all_categories")}
                  </CustomButton> */}

                  {categorysType &&
                    categorysType
                      .filter((data) => data.menuId) // Only show categories with menuId
                      .map((data, index) => (
                        <CustomButton
                          key={"categoryTypeBtn" + index}
                          onClick={() => handleCategoryButtonSelect(data)}
                          className={`px-4 py-2 rounded-md border transition-colors ${
                            selectedCategoryButton === data._id
                              ? "bg-color-app text-white border-color-app"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                          style={{ position: "relative" }}
                        >
                          {data.name}

                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-5px",
                              width: "10px",
                              height: "10px",
                              backgroundColor: "#10b981",
                              borderRadius: "50%",
                              fontSize: "8px",
                            }}
                            title="Has MenuID"
                          ></span>
                        </CustomButton>
                      ))}
                </div>

                {/* Show regular dropdown for categories without menuId if any exist */}
                {categorysType &&
                  categorysType.filter((data) => !data.menuId).length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <label
                        style={{
                          marginBottom: "8px",
                          display: "block",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {t("other_categories")}:
                      </label>
                      <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        style={{
                          display: "inline-block",
                          width: "auto",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                        }}
                      >
                        <option value="All">{t("chose_type")}</option>
                        {categorysType
                          .filter((data) => !data.menuId) // Only show categories without menuId
                          .map((data, index) => (
                            <option
                              key={"categoryTypeSelect" + index}
                              value={data?._id}
                            >
                              {data?.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
              </div>

              {/* Show filtered menus when category is selected */}
              {selectedCategoryButton !== "All" && filteredMenus.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#fff8e1",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "15px",
                    border: "1px solid #ffcc02",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#f57c00",
                    }}
                  >
                    {t("filtered_menus")} ({filteredMenus.length}):
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {filteredMenus.map((menu, index) => (
                      <Badge
                        key={index}
                        className="bg-orange-100 text-orange-800"
                        style={{ fontSize: "12px", padding: "4px 8px" }}
                      >
                        {menu.name} ({menu.price} {storeDetail?.firstCurrency})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Show API status when category with menuId is selected */}
              {/* {selectedCategoryButton !== "All" && categorysType.find(cat => cat._id === selectedCategoryButton)?.menuId && (
                <div style={{
                  backgroundColor: "#e8f5e8",
                  border: "1px solid #c3e6c3",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%"
                  }}></span>
                  <div style={{ fontSize: "13px", color: "#2e7d32", fontWeight: "500" }}>
                    {t("category_with_menu_selected")} - {t("will_send_to_api_on_submit")}
                  </div>
                </div>
              )} */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "15px",
                }}
              >
                <div>{t("discount")}</div>
                <div className="flex border border-gray-300 rounded-md">
                  <CustomButton
                    onClick={() => setSelectedButtonCategory("%")}
                    className={`w-10 h-10 flex items-center justify-center ${
                      selectedButtonCategory === "%"
                        ? "bg-color-app text-white"
                        : "bg-white"
                    }`}
                    disabled={selectedCategoryButton === "All"}
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
                    disabled={selectedCategoryButton === "All"}
                  >
                    {storeDetail?.firstCurrency}
                  </CustomButton>
                </div>

                <Input
                  type="number"
                  onKeyDown={preventNegativeValues}
                  value={discountCategory}
                  min="0"
                  className="w-32 h-10"
                  onChange={(e) => {
                    setDiscountCategory(e.target.value);
                  }}
                  disabled={selectedCategoryButton === "All"}
                  placeholder={
                    selectedCategoryButton === "All"
                      ? t("select_category_first")
                      : "0"
                  }
                />
                <div>{selectedButtonCategory}</div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Discount Summary */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#856404",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {t("discount_summary")}:
            <Badge
              className={`${
                activeTab === "general"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
              style={{ fontSize: "10px" }}
            >
              {activeTab === "general" ? t("general") : t("category")}
            </Badge>
          </div>
          <div style={{ fontSize: "13px", color: "#856404" }}>
            {activeTab === "general"
              ? discount > 0
                ? `${t("general_discount")}: ${discount}${selectedButton}`
                : t("no_discount_applied")
              : selectedCategoryButton !== "All" && discountCategory > 0
              ? `${t(
                  "category_discount"
                )}: ${discountCategory}${selectedButtonCategory} ${t(
                  "for_category"
                )} "${
                  categorysType.find(
                    (cat) => cat._id === selectedCategoryButton
                  )?.name || ""
                }"`
              : t("no_category_discount_applied")}
          </div>
        </div>

        <div className="flex justify-end">
          <CustomButton
            // disabled={
            //   buttonDisabled ||
            //   (activeTab === "general" ?
            //     !discount || discount <= 0 :
            //     selectedCategoryButton === "All" || !discountCategory || discountCategory <= 0
            //   )
            // }
            className={`rounded-md text-lg bg-color-app text-white`}
            onClick={async () => {
              setButtonDisabled(true);

              // If category tab is active and a category with value.menuId is selected, call the category API
              if (
                activeTab === "category" &&
                selectedCategoryButton !== "All"
              ) {
                const selectedCategoryData = categorysType.find(
                  (cat) => cat._id === selectedCategoryButton
                );
                if (selectedCategoryData && selectedCategoryData.menuId) {
                  try {
                    await sendCategoryDiscountToAPI(selectedCategoryData);
                  } catch (error) {
                    console.log(
                      "Error sending category discount to API:",
                      error
                    );
                  }
                }
              }

              if (activeTab === "general") {
                await setDiscountBill();
              }
              
              onSubmit().then(() => {
                handleClose(); // Use handleClose instead of onClose to reset states
              });
              setButtonDisabled(false);
            }}
          >
            {buttonDisabled ? t("processing...") : t("append_discount")}
          </CustomButton>
        </div>
      </Modal.Body>
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
