import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { renderOptions } from "./orderHelpers"; // Import renderOptions function
import { orderStatus } from "../../helpers";
import moment from "moment";
import { fontMap } from "../../utils/font-map";
import styled from "styled-components"; // Import styled-components

const OrderList = ({ 
  onTabStatusName, 
  orders, 
  handleCheckbox, 
  handleCheckAll, 
  language, 
  t, 
  hideCheckbox = false // Add hideCheckbox prop with default value of false
}) => {
  const allChecked = orders?.every((order) => order.isChecked); // Check if all items are checked

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
                      onChange={(e) => handleCheckAll(e.target.checked, onTabStatusName)} // Handle "check all" toggle
                    />
                  }
                  style={{ marginLeft: 2, visibility: hideCheckbox ? 'hidden' : 'visible' }} // Make checkbox invisible but keep space
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
              <tr key={index}>
                <td>
                  <Checkbox
                    checked={order?.isChecked || false}
                    onChange={() => handleCheckbox(order, onTabStatusName)} // Handle checkbox toggle
                    color="primary"
                    style={{ visibility: hideCheckbox ? 'hidden' : 'visible' }} // Make checkbox invisible but keep space
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
                <td>{order?.createdAt ? moment(order?.createdAt).format("HH:mm") : "-"}</td>
                <td>{order?.note ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </TableCustom>
      </div>
    </RootStyle>
  );
};

// Styled-components for styling
const RootStyle = styled("div")({
  padding: 10,
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
    backgroundColor: "#ffe9d8",
  },
  thead: {
    backgroundColor: "#ffd6b8",
  },
});

export default OrderList; // Ensure it's a default export
