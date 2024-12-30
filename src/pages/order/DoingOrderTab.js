import React, { useState, useMemo, useRef, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import moment from "moment";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as _ from "lodash";
import empty from "../../image/empty.png";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

/**
 * import components
 */

import { orderStatus } from "../../helpers";
import { SERVE_STATUS, END_POINT, DOING_STATUS } from "../../constants";
import { fontMap } from "../../utils/font-map";

import { useOrderStore } from "../../zustand/orderStore";

const DoingOrderTab = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();


  const { doingOrders, handleCheckbox, handleCheckAll } = useOrderStore();

  return (
    <div>
      {/* <OrderNavbar /> */}
      {doingOrders?.length > 0 ? (
        <div>
          <div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              display: "flex",
              paddingTop: 15,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <div
              style={{
                alignItems: "end",
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }} >ເລືອກທັງໝົດ</div>} /> */}
            </div>
          </div>
          
          <Container
            style={{
              overflowX: "auto",
            }}
            fluid
            className="mt-3"
          >
            <TableCustom
              responsive
              className="staff-table-list borderless table-hover"
            >
              <thead>
                <tr>
                  <th>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedC"
                          onChange={(e) => handleCheckAll(e.target.checked, "DOING")}
                          style={{ marginLeft: 10 }}
                        />
                      }
                    />
                  </th>

                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("no")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("menu_name")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("amount")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("from_table")}
                  </th>
                  {/* <th>ລະຫັດໂຕະ</th> */}
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("status")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("time")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                    className={fontMap[language]}
                  >
                    {t("commend")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {doingOrders?.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <Checkbox
                        checked={order?.isChecked ? true : false}
                        onChange={(e) => handleCheckbox(order, "DOING")}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>{index + 1}</p>
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>{order?.name ?? "-"}</p>
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p>
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>{order?.tableId?.name ?? "-"}</p>
                    </td>
                    {/* <td>
                        <p style={{ margin: 0 }}>{order?.code ?? "-"}</p>
                      </td> */}
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {order?.status ? orderStatus(order?.status) : "-"}
                      </p>
                    </td>

                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {order?.createdAt
                          ? moment(order?.createdAt).format("HH:mm a")
                          : "-"}
                      </p>
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                      }}
                    >
                      <p style={{ margin: 0 }}>{order?.note ?? "-"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableCustom>
          </Container>
        </div>
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
};

export default DoingOrderTab;

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 18,
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
  ["tr:nth-child(2n+0)"]: {
    backgroundColor: "#ffe9d8",
  },
  thead: {
    backgroundColor: "#ffd6b8",
  },
});
