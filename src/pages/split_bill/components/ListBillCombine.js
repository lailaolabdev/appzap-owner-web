import React from "react";
import { SiAirtable } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
import styled from "styled-components";
import Box from "../../../components/Box";
import { COLOR_APP } from "../../../constants/index";
import { moneyCurrency } from "../../../helpers";
import { useStore } from "../../../store";
import { orderStatusTranslate } from "../../../helpers";

const ListBillCombine = ({
  combine,
  billOrderItems,
  totalBill,
  _goToAddOrder,
  _onCheckOutCombine,
}) => {
  const { t } = useTranslation();
  const { storeDetail } = useStore();
  return (
    <>
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          minWidth: "100%",
          width: "100%",
          maxWidth: "100%",
          boxShadow: "-1px 0px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {combine === undefined ? (
          <div className="text-center">
            <div style={{ marginTop: 50, fontSize: 50 }}>
              <h4>{t("avaliable")}</h4>
              <FontAwesomeIcon
                icon={faListAlt}
                style={{
                  width: "calc(50%)",
                  height: "calc(50%)",
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        ) : (
          combine && (
            <div
            //   style={{
            //     width: "100%",
            //     backgroundColor: "#FFF",
            //     maxHeight: "90vh",
            //     overflowY: "scroll",
            //   }}
            >
              {
                <div>
                  <div style={{ backgroundColor: "#fff", padding: 10 }}>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      <SiAirtable /> {combine?.mergedTableNames}
                    </div>
                    {/* <div
                              style={{
                                fontSize: 16,
                              }}
                            >
                              {t("tableNumber2")}:{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: COLOR_APP,
                                }}
                              >
                                {combine?.code}
                              </span>
                            </div> */}
                    <div
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {t("timeOfTableOpening")}:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: COLOR_APP,
                        }}
                      >
                        {moment(combine?.createdAt).format("HH:mm A")}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {t("respon")}:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: COLOR_APP,
                        }}
                      >
                        {`${billOrderItems[0]?.createdBy?.firstname}  ${billOrderItems[0]?.createdBy?.firstname}`}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {t("discount")}:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: COLOR_APP,
                        }}
                      >
                        {moneyCurrency(combine?.discount)}{" "}
                        {combine?.discountType === "PERCENT"
                          ? "%"
                          : combine?.firstCurrency}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {t("total")}:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: COLOR_APP,
                        }}
                      >
                        {moneyCurrency(totalBill)} {storeDetail?.firstCurrency}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {t("aPriceHasToPay")}:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color: COLOR_APP,
                        }}
                      >
                        {moneyCurrency(totalBill)} {storeDetail?.firstCurrency}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      borderBottom: "1px dashed #ccc",
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    <ButtonCustom
                      //   disabled={!canCheckOut}
                      onClick={() => _onCheckOutCombine()}
                    >
                      {t("checkout")}
                    </ButtonCustom>
                    {/* <ButtonCustom
                      onClick={() =>
                        _goToAddOrder(
                          billOrderItems[0]?.tableId?._id,
                          billOrderItems[0]?.code,
                          billOrderItems?.isBillSplit
                        )
                      }
                    >
                  +{" "}
                      {t("addOrder")}
                    </ButtonCustom> */}
                  </div>
                  <div
                    style={{
                      borderBottom: "1px dashed #ccc",
                      margin: "10px 0",
                    }}
                  />
                  {/* <div
                    style={{
                      display: "flex",
                      padding: "0 10px",
                      marginBottom: 10,
                    }}
                    hidden={checkedBox}
                  >
                    <ButtonCustom
                      onClick={() => {
                        setWorkAfterPin("cancle_order_and_print");
                        setPopup({ PopUpPin: true });
                      }}
                      disabled={checkedBox || onPrinting}
                    >
                      {onPrinting && <Spinner animation="border" size="sm" />}
                      {t("cancel_and_send_to_kitchen")}
                    </ButtonCustom>
                    <ButtonCustom
                      onClick={() => {
                        setWorkAfterPin("cancle_order");
                        setPopup({ PopUpPin: true });
                      }}
                      disabled={checkedBox}
                    >
                      {t("cancel")}
                    </ButtonCustom>
                    <ButtonCustom
                      onClick={() => {
                        handleUpdateOrderStatusAndCallback(
                          "DOING",
                          async () => {
                            // const data = await onPrintForCher();
                            const data = await onPrintToKitchen();
                            return data;
                          }
                        ).then();
                      }}
                      disabled={checkedBox || onPrinting}
                    >
                      {onPrinting && <Spinner animation="border" size="sm" />}
                      {t("update_and_send_to_kitchen")}
                    </ButtonCustom>
                    <ButtonCustom
                      onClick={() => handleUpdateOrderStatusgo("DOING")}
                      disabled={checkedBox}
                    >
                      {t("sendToKitchen")}
                    </ButtonCustom>
                    <ButtonCustom
                      onClick={() => handleUpdateOrderStatus("SERVED")}
                      disabled={checkedBox}
                    >
                      {t("servedBy")}
                    </ButtonCustom>
                  </div> */}

                  <TableCustom>
                    <thead>
                      <tr>
                        {/* <th>
                              <Checkbox
                                name="checked"
                                onChange={(e) => {
                                  checkAllOrders(e);
                                  setCheckedBox(!e.target.checked);
                                }}
                              />
                            </th> */}
                        <th>{t("no")}</th>
                        <th>{t("menuname")}</th>
                        <th>{t("quantity")}</th>
                        <th>{t("status")}</th>
                        <th>{t("customer")}</th>
                        <th>{t("time")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combine
                        ? combine?.items?.map((orderItem, index) => {
                            const options =
                              orderItem?.options
                                ?.map((option) =>
                                  option.quantity > 1
                                    ? `[${option.quantity} x ${option.name}]`
                                    : `[${option.name}]`
                                )
                                .join(" ") || "";
                            return (
                              <tr
                                // onClick={() => handleShowQuantity(orderItem)}
                                key={"order" + index}
                                style={{
                                  borderBottom: "1px solid #eee",
                                }}
                              >
                                {/* <td onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                          disabled={
                                            orderItem?.status === "CANCELED"
                                          }
                                          name="checked"
                                          checked={
                                            orderItem?.isChecked || false
                                          }
                                          onChange={(e) => {
                                            onSelect({
                                              ...orderItem,
                                              isChecked: e.target.checked,
                                            });
                                          }}
                                        />
                                      </td> */}
                                <td>{index + 1}</td>
                                <td>
                                  {orderItem?.name} {options}
                                </td>
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
                                  {orderItem?.status
                                    ? t(orderStatusTranslate(orderItem?.status))
                                    : "-"}
                                </td>
                                <td>{orderItem?.createdBy?.firstname}</td>
                                <td>
                                  {orderItem?.createdAt
                                    ? moment(orderItem?.createdAt).format(
                                        "HH:mm A"
                                      )
                                    : "-"}
                                </td>
                              </tr>
                            );
                          })
                        : ""}
                    </tbody>
                  </TableCustom>
                  <div style={{ marginBottom: 100 }} />
                </div>
              }
            </div>
          )
        )}
      </Box>
    </>
  );
};

export default ListBillCombine;

const ButtonCustom = ({ children, ...etc }) => {
  return (
    <Button
      variant="light"
      className="hover-me"
      style={{
        backgroundColor: "#FB6E3B",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 10,
      }}
      {...etc}
    >
      {children}
    </Button>
  );
};

const TableCustom = styled("table")({
  margin: 10,
  width: "100%",
  fontSize: 15,
  "th,td": {
    padding: 5,
  },
  "th:first-child": {
    maxWidth: 40,
    width: 40,
  },
  "td:first-child": {
    maxWidth: 40,
    width: 40,
  },
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
