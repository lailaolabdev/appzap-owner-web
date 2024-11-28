import React, { useState, useEffect } from "react";
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
}) => {
  const { t } = useTranslation();
  const {
    storeDetail,
    setStoreDetail,
    orderPayBefore,
    setOrderPayBefore,
    profile,
    audioSetting,
    setAudioSetting,
  } = useStore();
  const [total, setTotal] = useState(0); // Initialize total to 0
  const [isServiceChargeEnabled, setIsServiceChargeEnabled] = useState(false);
  const [serviceAmount, setServiceAmount] = useState(0);

  useEffect(() => {
    _calculateTotal();
  }, [totalBillOrderCheckOut, isServiceChargeEnabled, orderPayBefore]);
  useEffect(() => {
    setIsServiceChargeEnabled(false);
  }, []);

  const calculateDiscountedTotal = (
    total,
    serviceAmount,
    taxPercent,
    discount,
    discountType
  ) => {
    const totalWithServiceAndTax =
      (total + serviceAmount) * (taxPercent * 0.01 + 1);

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
    serviceAmount,
    taxPercent,
    data?.discount,
    data?.discountType
  );

  const orderItem = (orders) => {
    return orders?.map((e, index) => {
      const options =
        e?.options
          ?.map((option) =>
            option.quantity > 1
              ? `[${option.quantity} x ${option.name}]`
              : `[${option.name}]`
          )
          .join(" ") || "";

      const itemPrice = e?.price + (e?.totalOptionPrice ?? 0);
      const itemTotal = e?.price ? moneyCurrency(itemPrice * e?.quantity) : "-";

      return (
        <tr key={getOrderItemKey(e)}>
          <td>{index + 1}</td>
          <td>
            {e?.name ?? "-"} {options}
          </td>
          <td>{e?.quantity}</td>
          <td>{moneyCurrency(itemPrice)}</td>
          <td>{itemTotal}</td>
        </tr>
      );
    });
  };

  const _calculateTotal = () => {
    const serviceChargeAmount = isServiceChargeEnabled
      ? totalBillOrderCheckOut * (serviceCharge / 100)
      : 0; // 10% if enabled
    const paidData = _.sumBy(orderPayBefore, (e) => {
      const mainPrice = (e?.price || 0) * (e?.quantity || 1);

      const menuOptionPrice = _.sumBy(
        e?.options || [],
        (opt) => (opt?.price || 0) * (opt?.quantity || 1)
      );

      return mainPrice + menuOptionPrice;
    });
    setServiceAmount(serviceChargeAmount);
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
    setStoreDetail({
      ...storeDetail,
      serviceChargePer: isServiceChargeEnabled ? 0 : serviceCharge,
      isServiceCharge: e.target.checked,
    });
  };
  const calculateTotalWithDiscount = (
    total,
    taxPercent,
    serviceAmount,
    discount,
    discountType
  ) => {
    if (discountType === "LAK") {
      const discountedTotal = Math.floor(
        total * (taxPercent * 0.01 + 1) + serviceAmount - discount
      );
      return discountedTotal > 0 ? discountedTotal : 0;
    } else {
      const discountInPercent =
        (total + serviceAmount) * (taxPercent * 0.01 + 1) * (discount / 100);
      const discountedTotal = Math.floor(
        total * (taxPercent * 0.01 + 1) + serviceAmount - discountInPercent
      );
      return discountedTotal > 0 ? discountedTotal : 0;
    }
  };
  useEffect(() => {
    const calculatedTotal = calculateTotalWithDiscount(
      total,
      taxPercent,
      serviceAmount,
      data?.discount,
      data?.discountType
    );
    setTotalMustPay(calculatedTotal);
  }, [total, taxPercent, serviceAmount, data]);

  setCreatedAt(tableData?.createdAt);

  return (
    <>
      <Modal
        show={show}
        size={"lg"}
        onHide={hide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("order_detial")} Yoo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}>
            {t("table")}: {tableData?.tableName}
          </div>
          <div style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("code")}: {tableData?.code}
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
              checked={storeDetail?.isServiceCharge}
              id={"switch-audio"}
              onChange={(e) => getToggleServiceCharge(e)}
            />
          </Row>
          <div style={{ margin: 8 }} />
          <div className="h-fit max-h-[280px] overflow-y-auto relative">
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
            {storeDetail?.isServiceCharge && (
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
                  Math.floor(total * (taxPercent * 0.01 + 1) + serviceAmount)
                )}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </div>
          </div>
        </Modal.Body>
        <CardFooterModal>
          <Modal.Footer>
            <Button
              className="ml-2 pl-4 pr-4"
              style={{
                backgroundColor: "#FB6E3B",
                color: "#ffff",
                border: "solid 1px #FB6E3B",
                fontSize: 22,
              }}
              disabled={billDataLoading || printBillLoading || printBillCalulate}
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
              className="p-2 col-example text-center"
              style={{ fontSize: 22 }}
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
                  fontSize: 22,
                }}
              >
                <span style={{ justifyContent: "flex-end", display: "row" }}>
                  <b>
                    {data && data?.discountType === "LAK"
                      ? moneyCurrency(
                          Math.floor(
                            total * (taxPercent * 0.01 + 1) +
                              serviceAmount -
                              data?.discount >
                              0
                              ? (total + serviceAmount) *
                                  (taxPercent * 0.01 + 1) -
                                  data?.discount
                              : 0
                          )
                        )
                      : moneyCurrency(
                          Math.floor(
                            total * (taxPercent * 0.01 + 1) +
                              serviceAmount -
                              ((total + serviceAmount) *
                                (taxPercent * 0.01 + 1) *
                                data?.discount) /
                                100 >
                              0
                              ? total * (taxPercent * 0.01 + 1) +
                                  serviceAmount -
                                  ((total + serviceAmount) *
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
            <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
              <Button
                className="ml-2 pl-4 pr-4"
                disabled={billDataLoading || printBillLoading || printBillCalulate}
                style={{
                  backgroundColor: "#FB6E3B",
                  color: "#ffff",
                  border: "solid 1px #FB6E3B",
                  fontSize: 22,
                }}
                // disabled={billDataLoading}
                onClick={() => onSubmit()}
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
