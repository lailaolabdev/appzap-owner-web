import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import ReactAudioPlayer from "react-audio-player";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";
import { useOrderStore } from "../../zustand/orderStore";
import { orderStatus } from "../../helpers";
import Notification from "../../vioceNotification/ding.mp3";
import { fontMap } from "../../utils/font-map";
import styled from "styled-components";

/**
 * This component renders the waiting orders tab
 */
export default function WaitingOrderTab() {
  const { t, i18n: { language } } = useTranslation();
  const { orderItems, handleCheckbox } = useOrderStore();
  const { checkAllOrders } = useStore();

  // Function to render options
  const renderOptions = (options) => {
    return options && options.length > 0
      ? options.map((option, index) => (
          <span key={index}>[{option.name}]</span>
        ))
      : null;
  };

  return (
    <RootStyle>
      <div>
        <ReactAudioPlayer src={Notification} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <TableCustom responsive>
          <thead>
            <tr>
              <th>
                <FormControlLabel
                  control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />}
                  style={{ marginLeft: 2 }}
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
            {orderItems?.map((order, index) => (
              <tr key={index}>
                <td>
                  <Checkbox
                    checked={order?.isChecked || false}
                    onChange={(e) => handleCheckbox(order)}
                    color="primary"
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
}

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
