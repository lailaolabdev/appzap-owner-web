import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Form, Row, Spinner } from "react-bootstrap";
import { moneyCurrency } from "../../../helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useStore } from "../../../store";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import _ from "lodash";
import { SettingsApplications } from "@material-ui/icons";

import { useStoreStore } from "../../../zustand/storeStore";
import { usePaymentStore } from "../../../zustand/paymentStore";

const OrderCheckOut = ({
  data = { orderId: [] },
  serviceCharge = 0,
  tableData = {},
  show = false,
  hide,
  taxPercent = 0,
  onPrintBill = () => {},
  onSubmit = () => {},
  staffData,
  selectedTable,
  setServiceChangeAmount,
  setTotalMustPay,
  totalMustPay,
  setCreatedAt,
  createdAt,
  totalBillOrderCheckOut,
  printBillLoading,
  billDataLoading,
  printBillCalulate,
  setEnableServiceChange,
}) => {
  const { t } = useTranslation();
  const {
    orderPayBefore,
    setOrderPayBefore,
    profile,
    audioSetting,
    setAudioSetting,
  } = useStore();

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

  const [total, setTotal] = useState(0); // Initialize total to 0
  const [isServiceChargeEnabled, setIsServiceChargeEnabled] = useState(false);
  const { setSelectedDataBill } = usePaymentStore();
  const serviceChargeRef = useRef(serviceCharge);

  useEffect(() => {
    if (serviceCharge > 0) {
      serviceChargeRef.current = serviceCharge;
    }
  }, [serviceCharge]);
  const TotalServiceChange = storeDetail?.isServiceChange
    ? serviceChargeRef.current
    : storeDetail?.serviceChargePer;

  const serviceChargeAmount = () => {
    return (total * TotalServiceChange) / 100;
  };

  useEffect(() => {
    _calculateTotal();
  }, [totalBillOrderCheckOut, isServiceChargeEnabled, orderPayBefore]);
  useEffect(() => {
    setIsServiceChargeEnabled(false);
  }, []);

  const calculateDiscountedTotal = (
    total,
    serviceChargeAmount,
    taxPercent,
    discount,
    discountType
  ) => {
    const totalWithServiceAndTax =
      (total + serviceChargeAmount()) * (taxPercent * 0.01 + 1);

    if (discountType === "LAK" || discountType === "MONEY") {
      return totalWithServiceAndTax - discount > 0
        ? totalWithServiceAndTax - discount
        : 0;
    } else {
      const percentageDiscount = (totalWithServiceAndTax * discount) / 100;
      return totalWithServiceAndTax - percentageDiscount > 0
        ? totalWithServiceAndTax - percentageDiscount
        : 0;
    }
  };

  const discountedTotal = calculateDiscountedTotal(
    total,
    serviceChargeAmount,
    taxPercent,
    data?.discount,
    data?.discountType
  );

  const orderItem = (orders) => {
    return orders?.map((e, index) => {
      // Handle options with proper fallback and join them if needed
      const options =
        e?.options
          ?.map((option) =>
            option?.quantity > 1
              ? `[${option.quantity} x ${option.name}]`
              : `[${option.name}]`
          )
          .join(" ") || ""; // Fallback to empty string if options is undefined

      // Ensure price and totalOptionPrice are numbers, default to 0 if undefined or null
      const itemPrice =
        Number(e?.price || 0) + Number(e?.totalOptionPrice || 0);
      const itemTotal = itemPrice * (e?.quantity || 0); // Ensure quantity defaults to 0 if undefined

      // Use moneyCurrency for formatting, and fall back to "-" if itemTotal is not calculable (e.g., 0)
      const formattedItemTotal = itemTotal > 0 ? moneyCurrency(itemTotal) : "-";

      return (
        <tr key={getOrderItemKey(e)}>
          <td>{index + 1}</td>
          <td>
            {e?.name ?? "-"} {options}
          </td>
          <td>{e?.quantity ?? "-"}</td>{" "}
          {/* Fallback to "-" if quantity is undefined */}
          <td>{moneyCurrency(itemPrice) || "-"}</td>{" "}
          {/* Fallback to "-" if price is not calculable */}
          <td>{formattedItemTotal}</td>
        </tr>
      );
    });
  };

  const _calculateTotal = () => {
    // 10% if enabled
    const paidData = _.sumBy(orderPayBefore, (e) => {
      const mainPrice = (e?.price || 0) * (e?.quantity || 1);

      const menuOptionPrice = _.sumBy(
        e?.options || [],
        (opt) => (opt?.price || 0) * (opt?.quantity || 1)
      );

      return mainPrice + menuOptionPrice;
    });

    orderPayBefore && orderPayBefore.length > 0
      ? setTotal(paidData)
      : setTotal(totalBillOrderCheckOut);
  };

  const getOrderItemKey = (orderItem) => {
    const options =
      orderItem?.options
        ?.map((option) => `${option.name}:${option.value}`)
        .join(",") || "";
    return `${orderItem?.id}-${options}`;
  };

  const getToggleServiceCharge = (e) => {
    setIsServiceChargeEnabled(e.target.checked);
    setEnableServiceChange(e.target.checked);
    setStoreDetail({
      serviceChargePer: isServiceChargeEnabled ? 0 : serviceCharge,
      isServiceCharge: e.target.checked,
    });
  };
  const calculateTotalWithDiscount = (
    total,
    taxPercent,
    serviceChargeAmount,
    discount,
    discountType
  ) => {
    if (discountType === "LAK") {
      const discountedTotal = Math.floor(
        total * (taxPercent * 0.01 + 1) + serviceChargeAmount() - discount
      );
      return discountedTotal > 0 ? discountedTotal : 0;
    } else {
      const discountInPercent =
        (total + serviceChargeAmount()) *
        (taxPercent * 0.01 + 1) *
        (discount / 100);
      const discountedTotal = Math.floor(
        total * (taxPercent * 0.01 + 1) +
          serviceChargeAmount() -
          discountInPercent
      );
      return discountedTotal > 0 ? discountedTotal : 0;
    }
  };
  useEffect(() => {
    const calculatedTotal = calculateTotalWithDiscount(
      total,
      taxPercent,
      serviceChargeAmount,
      data?.discount,
      data?.discountType
    );
    setTotalMustPay(calculatedTotal);
  }, [total, taxPercent, serviceChargeAmount, data]);

  setCreatedAt(tableData?.createdAt);

  return (
    <>
      <Modal
        show={show}
        size={"lg"}
        onHide={hide}
        aria-labelledby="contained-modal-title-vcenter"
        style={{
          margin: 0,
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("order_detial")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>
            {t("table")}: {tableData?.tableName} {`(${tableData?.code})`}
          </div>
          <div style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("open_at")}: {moment(createdAt).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
          <Row>
            <div
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 16,
                marginRight: 8,
              }}
            >
              {t("service_charge")}
            </div>
            <Form.Check
              style={{ margin: 2 }}
              type="switch"
              disabled={storeDetail?.isServiceChange}
              checked={
                storeDetail?.isServiceCharge || storeDetail?.isServiceChange
              }
              id={"switch-audio"}
              onChange={(e) => getToggleServiceCharge(e)}
            />
          </Row>
          <div style={{ margin: 8 }} />
          <div className="h-fit max-h-[260px] overflow-y-auto relative">
            <Table responsive className="staff-table-list table-hover">
              <thead className="sticky top-0 z-10 bg-[#F1F1F1]">
                <tr>
                  <th>{t("no")}</th>
                  <th>{t("menu_name")}</th>
                  <th>{t("qty")}</th>
                  <th>{t("price")}</th>
                  <th>{t("total_price")}</th>
                </tr>
              </thead>
              <tbody>
                {billDataLoading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : (
                  <>
                    {orderPayBefore && orderPayBefore.length > 0
                      ? orderItem(orderPayBefore)
                      : data?.orderId
                      ? orderItem(data?.orderId)
                      : null}
                  </>
                )}
              </tbody>
            </Table>
          </div>
          <div className="flex flex-col gap-1 mt-3 font-medium px-2">
            <div className="w-full flex justify-end">
              <div className="text-end">{t("discount")}:</div>
              <div className="w-60 text-end">
                {moneyCurrency(data?.discount)}{" "}
                {data?.discountType !== "LAK"
                  ? "%"
                  : storeDetail?.firstCurrency}
              </div>
            </div>
            {storeDetail?.isServiceChange && (
              <div className="w-full flex justify-end items-center">
                <div className="text-end">{t("service_charge")}:</div>
                <div className="w-60 text-end">{`${serviceCharge} %`}</div>
              </div>
            )}
            {(storeDetail?.serviceChargePer || isServiceChargeEnabled) && (
              <div className="w-full flex justify-end items-center">
                <div className="text-end">{t("service_charge")}:</div>
                <div className="w-60 text-end">{`${serviceCharge} %`}</div>
              </div>
            )}
            <div className="w-full flex justify-end items-center">
              <div className="text-end">{t("total_price")}:</div>
              <div className="w-60 text-end">
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </div>
            <div className="w-full flex justify-end items-center">
              <div className="text-end">
                {t("total_price")} + {t("tax")} {taxPercent}%:
              </div>
              <div className="w-60 text-end">
                {moneyCurrency(
                  Math.floor(
                    total * (taxPercent * 0.01 + 1) + serviceChargeAmount()
                  )
                )}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </div>
          </div>
        </Modal.Body>
        <CardFooterModal>
          <Modal.Footer className="flex flex-wrap w-full flex-row">
            <div className="flex flex-1 whitespace-nowrap">
              <div
                className="p-2 col-example text-center"
                style={{ fontSize: 20 }}
              >
                {t("total_must_pay")}:
              </div>
              {billDataLoading ? (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8 }}
                />
              ) : (
                <div
                  className="p-2 col-example text-center"
                  style={{
                    backgroundColor: "#F1F1F1",
                    fontSize: 20,
                  }}
                >
                  <span style={{ justifyContent: "flex-end", display: "row" }}>
                    <b>
                      {data && data?.discountType === "LAK"
                        ? moneyCurrency(
                            Math.floor(
                              total * (taxPercent * 0.01 + 1) +
                                serviceChargeAmount() -
                                data?.discount >
                                0
                                ? (total + serviceChargeAmount()) *
                                    (taxPercent * 0.01 + 1) -
                                    data?.discount
                                : 0
                            )
                          )
                        : moneyCurrency(
                            Math.floor(
                              total * (taxPercent * 0.01 + 1) +
                                serviceChargeAmount() -
                                ((total + serviceChargeAmount()) *
                                  (taxPercent * 0.01 + 1) *
                                  data?.discount) /
                                  100 >
                                0
                                ? total * (taxPercent * 0.01 + 1) +
                                    serviceChargeAmount() -
                                    ((total + serviceChargeAmount()) *
                                      (taxPercent * 0.01 + 1) *
                                      data?.discount) /
                                      100
                                : 0
                            )
                          )}
                    </b>
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col dmd:flex-row gap-1.5 dmd:gap-1">
              <Button
                className="ml-2 pl-4 pr-4"
                style={{
                  backgroundColor: "#FB6E3B",
                  color: "#ffff",
                  border: "solid 1px #FB6E3B",
                  fontSize: 18,
                  height: 40,
                }}
                disabled={
                  billDataLoading || printBillLoading || printBillCalulate
                }
                onClick={() => onPrintBill(false)}
              >
                {billDataLoading && (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ marginRight: 8 }}
                  />
                )}
                <FontAwesomeIcon
                  icon={faCashRegister}
                  style={{ color: "#fff", marginRight: 8 }}
                />
                {t("print_bill")}
              </Button>

              <div
                style={{ display: "flex", gap: 20, flexDirection: "column" }}
              >
                <Button
                  className="ml-2 pl-4 pr-4"
                  disabled={
                    billDataLoading || printBillLoading || printBillCalulate
                  }
                  style={{
                    backgroundColor: "#FB6E3B",
                    color: "#ffff",
                    border: "solid 1px #FB6E3B",
                    fontSize: 18,
                    height: 40,
                  }}
                  // disabled={billDataLoading}
                  onClick={() => {
                    onSubmit();
                    setSelectedDataBill((prev) => ({
                      ...prev,
                      paymentMethod: "CASH",
                    }));
                  }}
                >
                  {billDataLoading && (
                    <Spinner
                      animation="border"
                      size="sm"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <FontAwesomeIcon
                    icon={faCashRegister}
                    style={{ color: "#fff", marginRight: 8 }}
                  />
                  {t("check_bill")}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </CardFooterModal>
      </Modal>
    </>
  );
};

OrderCheckOut.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.array,
};

const CardFooterModal = styled.div`
  display: flex;
  justify-content: center !important;
  align-items: center;
  margin-bottom: 20px;
`;

export default OrderCheckOut;
