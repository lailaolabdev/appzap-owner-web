import React, { useMemo } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { renderOptions } from "./orderHelpers";
import { orderStatus } from "../../helpers";
import moment from "moment";
import { fontMap } from "../../utils/font-map";
import styled from "styled-components";
import { COLOR_APP } from "../../constants";

const CategorizedOrderList = ({
  onTabStatusName,
  orders,
  handleCheckbox,
  handleCheckAll,
  language,
  t,
  hideCheckbox = false,
}) => {
  // Group orders by category name
  const categorizedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return {};
    
    const grouped = {};
    
    orders.forEach(order => {
      const categoryName = order.categoryId?.name || t("....");
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(order);
    });
    
    return grouped;
  }, [orders, t]);
  
  // Check if all items are checked for "Check All" functionality
  const allChecked = orders?.every((order) => order.isChecked);

  // Handle row click to toggle checkbox
  const handleRowClick = (order, e) => {
    if (e.target.type !== "checkbox") {
      // Toggle checkbox if the user clicks anywhere in the row except on the checkbox itself
      handleCheckbox(order, onTabStatusName);
    }
  };
  
  // Check if a specific category has all its orders checked
  const isCategoryAllChecked = (categoryOrders) => {
    return categoryOrders.every(order => order.isChecked);
  };
  
  // Handle checking all orders in a specific category
  const handleCategoryCheckAll = (checked, categoryName) => {
    const categoryOrders = categorizedOrders[categoryName];
    categoryOrders.forEach(order => {
      handleCheckbox({...order, isChecked: !checked}, onTabStatusName);
    });
  };


  return (
    <RootStyle>
      <div style={{ overflowX: "auto" }}>
        {Object.keys(categorizedOrders).length > 0 ? (
          Object.keys(categorizedOrders).map((categoryName, catIndex) => (
            <CategoryContainer key={catIndex}>
              <CategoryHeader className={fontMap[language]}>
                {t("menu")}{t("type")}: {categoryName}
              </CategoryHeader>
              <TableCustom responsive>
                <thead>
                  <tr>
                    <th>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isCategoryAllChecked(categorizedOrders[categoryName])}
                            color="primary"
                            onChange={(e) => handleCategoryCheckAll(
                              isCategoryAllChecked(categorizedOrders[categoryName]), 
                              categoryName
                            )}
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
                    <th className={fontMap[language]}>{t("time")}</th>
                    <th className={fontMap[language]}>{t("commend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {categorizedOrders[categoryName].map((order, index) => (
                    <tr key={index} onClick={(e) => handleRowClick(order, e)}>
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
            </CategoryContainer>
          ))
        ) : (
          <div className="text-center p-4">{t("no_orders")}</div>
        )}
      </div>
    </RootStyle>
  );
};

// Styled-components for styling
const RootStyle = styled("div")({
  padding: 10,
});

const CategoryContainer = styled("div")({
  marginBottom: 40,
});

const CategoryHeader = styled("h2")({
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
  padding: 5,
  backgroundColor: "#e5e7eb",
  borderRadius: 4,
  color:COLOR_APP,
});

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 18,
  marginBottom: 20,
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

export default CategorizedOrderList;