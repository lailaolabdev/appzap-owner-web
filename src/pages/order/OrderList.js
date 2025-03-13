import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, FormControlLabel, FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";
import { renderOptions } from "./orderHelpers"; // Import renderOptions function
import { orderStatus } from "../../helpers";
import moment from "moment";
import { fontMap } from "../../utils/font-map";
import styled from "styled-components"; // Import styled-components
import { COLOR_APP } from "../../constants";

//  orders ຕາມ categoryTypeId ແລະ categoryId
const groupOrdersByCategories = (orders) => {
  // ສ້າງ object  orders ທີແຍກຕາມ categoryTypeId
  const groupedByCategoryType = {};

  orders?.forEach(order => {
    // ຖ້າ categoryId ບໍ່ ໄຫ້ຂ້າມໄປ
    if (!order.categoryId) {
      const categoryTypeName = 'ໝວດໝູ່ອື່ນໆ';
      const categoryName = 'ປະເພດອື່ນໆ';

      if (!groupedByCategoryType[categoryTypeName]) {
        groupedByCategoryType[categoryTypeName] = {};
      }

      if (!groupedByCategoryType[categoryTypeName][categoryName]) {
        groupedByCategoryType[categoryTypeName][categoryName] = [];
      }

      groupedByCategoryType[categoryTypeName][categoryName].push(order);
      return;
    }

    const categoryTypeName = order.categoryId.categoryTypeId?.name || '';
    const categoryName = order.categoryId.name || '';

    if (!groupedByCategoryType[categoryTypeName]) {
      groupedByCategoryType[categoryTypeName] = {};
    }

    if (!groupedByCategoryType[categoryTypeName][categoryName]) {
      groupedByCategoryType[categoryTypeName][categoryName] = [];
    }

    // ເພີ່ມ order ລົງໄປໃນ array ຂອງ categoryName
    groupedByCategoryType[categoryTypeName][categoryName].push(order);
  });
  return groupedByCategoryType;
};

const OrderList = ({
  onTabStatusName,
  orders,
  handleCheckbox,
  handleCheckAll,
  language,
  t,
  hideCheckbox = false, 
  dingStatus
}) => {
  const allChecked = orders?.every((order) => order.isChecked); 
  const groupedOrders = dingStatus ? groupOrdersByCategories(orders) : null;
  const [selectedCategoryType, setSelectedCategoryType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState({});
  const [allCategories, setAllCategories] = useState([]);  
  const [filteredGroupedOrders, setFilteredGroupedOrders] = useState({});

  // ໃຊ້ useMemo ເພີ່ອຄັດແລະເລືອກຂໍ້ມູນສະເພາະເມື່ອປ່ຽໜ
  const { categoryTypeOptions, categoryOptions } = useMemo(() => {
    if (!groupedOrders) {
      return { categoryTypeOptions: [], categoryOptions: [] };
    }

    // create options of dropdown onetime
    const types = Object.keys(groupedOrders).map(type => ({
      value: type ,
      label: type || "ໝວດໝູ່ອື່ນໆ"
    }));

    // Different category options based on selectedCategoryType
    let categories = [];
    if (selectedCategoryType === 'all') {
      // Show all categories when "all" is selected
      categories = allCategories.map(category => ({
        value: category,
        label: category || "ປະເພດອື່ນໆ"
      }));
    } else if (availableCategories[selectedCategoryType]) {
      // Show only categories for the selected type
      categories = availableCategories[selectedCategoryType].map(category => ({
        value: category,
        label: category || "ປະເພດອື່ນໆ"
      }));
    }

    return { 
      categoryTypeOptions: types,
      categoryOptions: categories 
    };
  }, [groupedOrders, selectedCategoryType, availableCategories, allCategories]);

  // ເກັບລາຍການ category types ແລະ categories ທັງຫມົດເພື່ອໃຊ້ໃນ dropdown
  useEffect(() => {
    if (groupedOrders) {
      // ສ້າງ object ເກັບ categories ທີມີຢູ່ໃນແຕ່ລະ category type
      const categories = {};
      const allCategoriesList = new Set();
      
      Object.keys(groupedOrders).forEach(type => {
        categories[type] = Object.keys(groupedOrders[type]);
        
        // Add all categories to the set to avoid duplicates
        Object.keys(groupedOrders[type]).forEach(category => {
          allCategoriesList.add(category);
        });
      });
      
      setAvailableCategories(categories);
      setAllCategories([...allCategoriesList]); 
      filterOrders();
    }
  }, [groupedOrders]);

  useEffect(() => {
    filterOrders();
  }, [selectedCategoryType, selectedCategory]);

  const filterOrders = () => {
    if (!groupedOrders) return;

    let filtered = {};

    if (selectedCategoryType === 'all') {
      if (selectedCategory === 'all') {
        // Show all category types and all categories
        filtered = { ...groupedOrders };
      } else {
        // Show only the selected category across all category types
        Object.keys(groupedOrders).forEach(type => {
          if (groupedOrders[type][selectedCategory]) {
            if (!filtered[type]) filtered[type] = {};
            filtered[type][selectedCategory] = groupedOrders[type][selectedCategory];
          }
        });
      }
    } else {
      // ສະແດງ category type ທີເລືອກ
      if (groupedOrders[selectedCategoryType]) {
        filtered[selectedCategoryType] = {};

        if (selectedCategory === 'all') {
          // ສະແດງທຸກ category ໃນປະເພດທີເລື່ອກ
          filtered[selectedCategoryType] = { ...groupedOrders[selectedCategoryType] };
        } else {
          // ສະແດງສະເພາະ category ທີເລືອກ
          if (groupedOrders[selectedCategoryType][selectedCategory]) {
            filtered[selectedCategoryType][selectedCategory] = groupedOrders[selectedCategoryType][selectedCategory];
          }
        }
      }
    }
    setFilteredGroupedOrders(filtered);
  };


  // Handle ການປ່ຽນ category type
  const handleCategoryTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedCategoryType(newType);
    setSelectedCategory('all'); 
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle row click to toggle checkbox
  const handleRowClick = (order, e) => {
    if (e.target.type !== "checkbox") {
      handleCheckbox(order, onTabStatusName);
    }
  };

  // Function to check if all orders in a category are checked
  const areAllCheckedInCategory = (categoryOrders) => {
    return categoryOrders.every((order) => order.isChecked);
  };

  // Handle "check all" for a specific category
  const handleCheckAllInCategory = (checked, categoryOrders) => {
    categoryOrders.forEach(order => {
      // Only update if the checked state is different
      if (!!order.isChecked !== checked) {
        handleCheckbox(order, onTabStatusName);
      }
    });
  };
  
  // ໃນສວນຂອງການ render dropdowns:
  const renderFilters = () => {
    if (!dingStatus || !groupedOrders || Object.keys(groupedOrders).length === 0) {
      return null;
    }

    return (
      <div className=" absolute right-5 -top-[3.8rem]">
        {/* CategoryType Dropdown */}
        {categoryTypeOptions.length > 0 && (
          <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 16 }}>
            <InputLabel id="category-type-label">{t("ໝວດໝູ່") || "ໝວດໝູ່"}</InputLabel>
            <Select
              labelId="category-type-label"
              value={selectedCategoryType }
              onChange={handleCategoryTypeChange}
              label={t("ໝວດໝູ່") || "ໝວດໝູ່"}
            >
              <MenuItem value="all">{t("all") || "all"}</MenuItem>
              {categoryTypeOptions.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Category Dropdown - Always enabled now, regardless of selectedCategoryType */}
        {categoryTypeOptions.length > 0 && (
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="category-label">{t("category") || "category"}</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label={t("category") || "category"}
              // No longer disabled when selectedCategoryType is 'all'
            >
              <MenuItem value="all">{t("all") || "all"}</MenuItem>
              {categoryOptions.map(category => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    );
  };

  if (!dingStatus) {
    return (
      <RootStyle>
        <div style={{ overflowX: "auto" }}>
          <TableCustom responsive>
            <thead>
              <tr>
                <th>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allChecked} // Check if all items are checked
                        color="primary"
                        onChange={(e) =>
                          handleCheckAll(e.target.checked, onTabStatusName)
                        } // Handle "check all" toggle
                      />
                    }
                    style={{
                      marginLeft: 2,
                      visibility: hideCheckbox ? "hidden" : "visible",
                    }} // Make checkbox invisible but keep space
                  />
                </th>
                <th className={fontMap[language]}>{t("no")}</th>
                <th className={fontMap[language]}>{t("menu_name")}</th>
                <th className={fontMap[language]}>{t("amount")}</th>
                <th className={fontMap[language]}>{t("from_table")}</th>
                <th className={fontMap[language]}>{t("table_code")}</th>
                <th className={fontMap[language]}>{t("status")}</th>
                <th className={fontMap[language]}>{t("status")}</th>
                <th className={fontMap[language]}>{t("commend")}</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr key={order._id || index} onClick={(e) => handleRowClick(order, e)}>
                  {" "}
                  {/* Handle row click */}
                  <td>
                    <Checkbox
                      checked={order?.isChecked || false}
                      onChange={() => handleCheckbox(order, onTabStatusName)} // Handle checkbox toggle
                      color="primary"
                      style={{ visibility: hideCheckbox ? "hidden" : "visible" }} // Make checkbox invisible but keep space
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    {order?.name ?? "-"} {renderOptions(order?.options)}
                  </td>
                  <td>{order?.quantity ?? "-"}</td>
                  <td>{order?.tableId?.name ?? "-"}</td>
                  <td>{order?.code ?? "-"}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {order?.status ? orderStatus(order?.status) : "-"}
                  </td>
                  <td>
                    {order?.createdAt
                      ? moment(order?.createdAt).format("HH:mm")
                      : "-"}
                  </td>
                  <td>{order?.note ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </TableCustom>
        </div>
      </RootStyle>
    );
  }

  return (
    <div className="relative mt-3">
      {renderFilters()}

      {Object.keys(filteredGroupedOrders).map(categoryTypeName => (
        <div key={categoryTypeName}>
          {categoryTypeName.length > 0 && <TypeHeader>ໝວດໝູ່: {categoryTypeName}</TypeHeader>}

          {Object.keys(filteredGroupedOrders[categoryTypeName]).map(categoryName => {
            const categoryOrders = filteredGroupedOrders[categoryTypeName][categoryName];
            const allCheckedInCategory = areAllCheckedInCategory(categoryOrders);

            return (
              <div key={categoryName}>
                <CategoryHeader>
                  <span className="text-color-app text-xl font-bold">ປະເພດ: {categoryName}</span>
                  <span className="count">({categoryOrders.length} ລາຍການ)</span>
                </CategoryHeader>

                <RootStyle>
                  <div style={{ overflowX: "auto" }}>
                    <TableCustom responsive>
                      <thead>
                        <tr>
                          <th>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={allCheckedInCategory}
                                  color="primary"
                                  onChange={(e) =>
                                    handleCheckAllInCategory(e.target.checked, categoryOrders)
                                  }
                                />
                              }
                              style={{
                                marginLeft: 2,
                                visibility: hideCheckbox ? "hidden" : "visible",
                              }}
                            />
                          </th>
                          <th className={fontMap[language]}>{t("no")}</th>
                          <th className={fontMap[language]}>{t("menu_name")}</th>
                          <th className={fontMap[language]}>{t("amount")}</th>
                          <th className={fontMap[language]}>{t("from_table")}</th>
                          <th className={fontMap[language]}>{t("table_code")}</th>
                          <th className={fontMap[language]}>{t("status")}</th>
                          <th className={fontMap[language]}>{t("status")}</th>
                          <th className={fontMap[language]}>{t("commend")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryOrders.map((order, index) => (
                          <tr key={order._id || index} onClick={(e) => handleRowClick(order, e)}>
                            <td>
                              <Checkbox
                                checked={order?.isChecked || false}
                                onChange={() => handleCheckbox(order, onTabStatusName)}
                                color="primary"
                                style={{ visibility: hideCheckbox ? "hidden" : "visible" }}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                              {order?.name ?? "-"} {renderOptions(order?.options)}
                            </td>
                            <td>{order?.quantity ?? "-"}</td>
                            <td>{order?.tableId?.name ?? "-"}</td>
                            <td>{order?.code ?? "-"}</td>
                            <td style={{ color: "red", fontWeight: "bold" }}>
                              {order?.status ? orderStatus(order?.status) : "-"}
                            </td>
                            <td>
                              {order?.createdAt
                                ? moment(order?.createdAt).format("HH:mm")
                                : "-"}
                            </td>
                            <td>{order?.note ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </TableCustom>
                  </div>
                </RootStyle>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Styled-components for styling
const RootStyle = styled("div")({
  padding: 10,
  marginBottom: 20,
});

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 18,
  ["th, td"]: {
    padding: 0,
  },
  ["th:first-child, td:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  ["tr:nth-child(2n+0)"]: {
    backgroundColor: "#f3f4f6",
  },
  thead: {
    backgroundColor: "#f3f4f6",
  },
});

const TypeHeader = styled("h2")({
  backgroundColor: COLOR_APP,
  color: "white",
  padding: "10px 15px",
  borderRadius: "5px 5px 0 0",
  margin: "20px 0 0 0",
  fontSize: "1.2rem",
});

const CategoryHeader = styled("h3")({
  backgroundColor: "#e2e8f0",
  padding: "8px 15px",
  margin: "0",
  fontSize: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #cbd5e0",
  "& .count": {
    fontSize: "0.8rem",
    color: "#4a5568",
    fontWeight: "normal",
  },
});

export default OrderList;