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
  doingStatus,
  showStatus
}) => {

  const ensureArray = (value) => {
    return Array.isArray(value) ? value : [];
  };

  // ກວດສອບວ່າ object ມີຄ່າຫລືບໍ່
  const ensureObject = (value) => {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  };


  // ກວດສອບວ່າ property ຂອງ object ມີຄ່າຫລືບໍ່
  const safeGet = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    
    return result !== undefined && result !== null ? result : defaultValue;
  };

  const safeOrders = ensureArray(orders);

  const categoryTypeOrder = useMemo(() => {
    if (!safeOrders.length) return {};
    
    // ສຳລັບ "TOGETER_SHOW" - ສະແດງອໍເດີທັງຫມົດໂດຍບໍ່ມີຫມວດໝູ່
    if (showStatus === "TOGETER_SHOW" || !doingStatus) {
      return { "AllOrders": safeOrders };
    }
    
    // ສຳລັບ "CATEGORY_SHOW_AND_CATEGORY_SHOW" - ຈັດກຸ່ມຊ້ອນກັນ
    if (showStatus === "CATEGORY_SHOW_AND_CATEGORY_SHOW") {
      const nestedGrouped = {};
      
      safeOrders.forEach(order => {
        const categoryTypeName = safeGet(order, 'categoryId.categoryTypeId.name', t("Unknown"));
        const categoryName = safeGet(order, 'categoryId.name', t("Unknown"));
        
        if (!nestedGrouped[categoryTypeName]) {
          nestedGrouped[categoryTypeName] = {};
        }
        
        if (!nestedGrouped[categoryTypeName][categoryName]) {
          nestedGrouped[categoryTypeName][categoryName] = [];
        }
        
        nestedGrouped[categoryTypeName][categoryName].push(order);
      });
      
      return nestedGrouped;
    }
    
    // ສຳລັບກໍລະນີ້ອື່ນໆ
    const grouped = {};
    
    safeOrders.forEach(order => {
      let categoryName = null;
      
      // ສຳລັບ "CATEGORY_SHOW" - ຈັດກຸ່ມຕາມ categoryId.name
      if (showStatus === "CATEGORY_SHOW") {
        categoryName = safeGet(order, 'categoryId.name', t("Unknown"));
      } 
      // ສຳລັບ "CATEGORY_TYPE_SHOW" - ຈັດກຸ່ມຕາມ categoryTypeId.name
      else if (showStatus === "CATEGORY_TYPE_SHOW") {
        categoryName = safeGet(order, 'categoryId.categoryTypeId.name', t("noCategory"));
      }
      
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      
      grouped[categoryName].push(order);
    });
    
    return grouped;
  }, [safeOrders, t, doingStatus, showStatus]);
  

  const allChecked = safeOrders.length > 0 && safeOrders.every((order) => order.isChecked);


  const handleRowClick = (order, e) => {
    if (e && e.target && e.target.type !== "checkbox") {
      handleCheckbox(order, onTabStatusName);
    }
  };

  const isTypeAllChecked = (ordersArr) => {
    if (!Array.isArray(ordersArr) || ordersArr.length === 0) {
      return false;
    }
    return ordersArr.every(order => order.isChecked);
  };

  // ຈັດການເລືອກ order ທັງຫມົດໃນ ຫວມດໝູ່ສະເພາະ
  const handleTypeCheckAll = (checked, orders) => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return;
    }
    
    orders.forEach(order => {
      if (order) {
        handleCheckbox({...order, isChecked: !checked}, onTabStatusName);
      }
    });
  };

  //  showStatus
  const getCategoryLabel = (showStatus) => {
    if (showStatus === "CATEGORY_SHOW") {
      return t("type");
    }
    return t("Category");
  };

  const OrderTable = ({ orders, title }) => {
    const orderArray = ensureArray(orders);
    
    return (
      <div>
        {title && <SubTypeHeader className={fontMap[language]}>{title}</SubTypeHeader>}
        <TableCustom responsive>
          <thead>
            <tr>
              <th>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTypeAllChecked(orderArray)}
                      color="primary"
                      onChange={(e) => handleTypeCheckAll(
                        isTypeAllChecked(orderArray), 
                        orderArray
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
            {orderArray.map((order, index) => (
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
                <td>{safeGet(order, 'tableId.name', '-')}</td>
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
    );
  };

  // ສຳລັບສະແດງຂໍ້ມູນແບບຊ້ອນ (nested)
  const renderNestedCategories = () => {
    const categoryTypes = Object.keys(categoryTypeOrder);
    
    if (!categoryTypes.length) {
      return <div className="text-center p-4">{t("no_orders")}</div>;
    }
    
    return categoryTypes.map((categoryTypeName, typeIndex) => {
      const categories = ensureObject(categoryTypeOrder[categoryTypeName]);
      const categoryNames = Object.keys(categories);
      
      if (!categoryNames.length) {
        return null;
      }
      
      return (
        <TypeContainer key={typeIndex}>
          <TypeHeader className={fontMap[language]}>
            {categoryTypeName !== "AllOrders" && categoryTypeName && categoryTypeName !== "null" && 
              `${t("Category")}: ${categoryTypeName}`
            }
          </TypeHeader>
          
          {categoryNames.map((categoryName, catIndex) => {
            const categoryOrders = ensureArray(categories[categoryName]);
            
            if (!categoryOrders.length) {
              return null;
            }
            
            return (
              <div key={catIndex} style={{ marginLeft: 20, marginBottom: 30 }}>
                <OrderTable 
                  orders={categoryOrders} 
                  title={`${t("type")}: ${categoryName}`}
                />
              </div>
            );
          })}
        </TypeContainer>
      );
    }).filter(Boolean); 
  };

  // ສຳລັບສະແດງຂໍ້ມູນທີບໍ່ຊ້ອນ
  const renderFlatCategories = () => {
    const categoryNames = Object.keys(categoryTypeOrder);
    
    if (!categoryNames.length) {
      return <div className="text-center p-4">{t("no_orders")}</div>;
    }
    
    return categoryNames.map((categoryName, typeIndex) => {
      const categoryOrders = ensureArray(categoryTypeOrder[categoryName]);
      
      if (!categoryOrders.length) {
        return null;
      }
      
      return (
        <TypeContainer key={typeIndex}>
          <TypeHeader className={fontMap[language]}>
            {doingStatus && categoryName !== "AllOrders" && categoryName && categoryName !== "null" && categoryName !== null && 
              `${getCategoryLabel(showStatus)}: ${categoryName}`
            }
          </TypeHeader>
          <OrderTable orders={categoryOrders} />
        </TypeContainer>
      );
    }).filter(Boolean);
  };

  return (
    <RootStyle>
      <div style={{ overflowX: "auto" }}>
        {Object.keys(categoryTypeOrder).length > 0 ? (
          showStatus === "CATEGORY_SHOW_AND_CATEGORY_SHOW" 
            ? renderNestedCategories() 
            : renderFlatCategories()
        ) : (
          <div className="text-center p-4">{t("no_orders")}</div>
        )}
      </div>
    </RootStyle>
  );
};

// Styled-components 
const RootStyle = styled("div")({
  padding: 10,
});

const TypeContainer = styled("div")({
  marginBottom: 40,
});

const TypeHeader = styled("h2")({
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
  padding: 5,
  backgroundColor: "#e5e7eb",
  borderRadius: 4,
  color: COLOR_APP,
});

const SubTypeHeader = styled("h3")({
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 5,
  padding: 3,
  backgroundColor: "#f3f4f6",
  borderRadius: 4,
  color: COLOR_APP,
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