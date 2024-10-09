import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Table,
  Button,
  Form,
  Row,
  Card,
  Spinner,
} from "react-bootstrap";
import { moneyCurrency } from "../../../helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useStore } from "../../../store";
import { useTranslation } from "react-i18next";
import BillForCheckOut80 from "../../../components/bill/BillForCheckOut80";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";

import { URL_PHOTO_AW3, COLOR_APP } from "../../../constants";
import styled from "styled-components";

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
  printBillLoading,
  billDataLoading,
}) => {
  const { t } = useTranslation();
  const {
    storeDetail,
    setStoreDetail,
    orderPayBefore,
    profile,
    audioSetting,
    setAudioSetting,
  } = useStore();
  const [total, setTotal] = useState(0); // Initialize total to 0
  const [isBill, setIsBill] = useState(false);
  const [isConfirmStaff, setIsConFirmStaff] = useState(false);
  const [defualtRoleUser, setDefualtRoleUser] = useState("APPZAP_COUNTER");
  const [isServiceChargeEnabled, setIsServiceChargeEnabled] = useState(false);
  const [serviceAmount, setServiceAmount] = useState(0);

  useEffect(() => {
    _calculateTotal();
  }, [data, isServiceChargeEnabled]);

  useEffect(() => {
    if (orderPayBefore) {
      console.log("DATA: ", data);
      console.log("Updated orderPayBefore: ", orderPayBefore);
    }
  }, [orderPayBefore]);

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
    return orders.map((e, index) => {
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
    let _total = 0;

    // Check for orderPayBefore; if available, use it, otherwise fall back to data?.orderId
    const orders =
      orderPayBefore && orderPayBefore.length > 0
        ? orderPayBefore
        : data?.orderId;

    // Loop through the orders and calculate total for 'SERVED' status
    if (orders) {
      for (let i = 0; i < orders.length; i++) {
        if (orders[i]?.status === "SERVED") {
          _total +=
            orders[i]?.quantity *
            (orders[i]?.price + (orders[i]?.totalOptionPrice ?? 0));
        }
      }
    }

    console.log("DATATOTAL: ", orderPayBefore);

    // Calculate service charge
    const serviceChargeAmount = isServiceChargeEnabled
      ? _total * (serviceCharge / 100)
      : 0; // Apply service charge if enabled

    setServiceAmount(serviceChargeAmount);
    setTotal(_total);
  };

  const onConfirmStaffToCheckBill = () => {
    setIsConFirmStaff(true);
    hide();
  };

  const onCancelConfirmStaff = () => {
    setIsConFirmStaff(false);
  };

  const onConfirmToCheckOut = async (data) => {
    let _staffConfirm = {
      id: data?._id,
      firstname: data?.firstname,
      lastname: data?.lastname,
      phone: data?.phone,
    };
    await localStorage.setItem(
      "STAFFCONFIRM_DATA",
      JSON.stringify(_staffConfirm)
    );
    onSubmit();
    setIsConFirmStaff(false);
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

  return (
    <>
      <Modal
        show={show}
        size={"lg"}
        onHide={hide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("order_detial")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>
            {t("table")}: {tableData?.tableName}
          </div>
          <div style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("code")}: {tableData?.code}
          </div>
          <div style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("open_at")}:{" "}
            {moment(tableData?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}
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
          <div style={{ margin: 8 }}></div>
          <Table responsive className="staff-table-list borderless table-hover">
            <thead style={{ backgroundColor: "#F1F1F1" }}>
              <tr>
                <th>{t("no")}</th>
                <th>{t("menu_name")}</th>
                <th>{t("qty")}</th>
                <th>{t("price")}</th>
                <th>{t("total_price")}</th>
              </tr>
            </thead>
            {billDataLoading ? (
              <td colSpan={9} style={{ textAlign: "center" }}>
                <Spinner animation="border" variant="primary" />
              </td>
            ) : (
              <tbody>
                {orderPayBefore && orderPayBefore.length > 0
                  ? orderItem(orderPayBefore)
                  : data?.orderId
                  ? orderItem(data?.orderId)
                  : null}
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    {t("discount")}:
                  </td>
                  <td colSpan="1">
                    {moneyCurrency(data?.discount)}{" "}
                    {data?.discountType !== "LAK"
                      ? "%"
                      : storeDetail?.firstCurrency}
                  </td>
                </tr>
                {storeDetail?.isServiceCharge && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      {t("service_charge")}:
                    </td>
                    <td colSpan="1">{serviceCharge}%</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    {t("total_price")}:
                  </td>
                  <td colSpan="1">
                    {moneyCurrency(total)} {storeDetail?.firstCurrency}
                  </td>
                </tr>

                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    {t("total_price")} + {t("tax")} {taxPercent}%:
                  </td>
                  <td colSpan="1">
                    {moneyCurrency(
                      Math.floor(
                        total * (taxPercent * 0.01 + 1) + serviceAmount
                      )
                    )}{" "}
                    {storeDetail?.firstCurrency}
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </Modal.Body>
        <CardFooterModal>
          <Modal.Footer>
            <Button
              className="ml-2 pl-4 pr-4"
              style={{
                backgroundColor: "#FB6E3B",
                color: "#ffff",
                border: "solid 1px #FB6E3B",
                fontSize: 26,
              }}
              disabled={printBillLoading}
              onClick={() => onPrintBill(false)}
            >
              {printBillLoading && (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8 }}
                />
              )}
              <FontAwesomeIcon
                icon={faCashRegister}
                style={{ color: "#fff" }}
              />
              {t("print_bill")}
            </Button>
            <div
              className="p-2 col-example text-center"
              style={{ fontSize: 26 }}
            >
              {t("total_must_pay")}:
            </div>
            <div
              className="p-2 col-example text-center"
              style={{
                backgroundColor: "#F1F1F1",
                fontSize: 26,
              }}
            >
              <span style={{ justifyContent: "flex-end", display: "flex" }}>
                <b>{moneyCurrency(Math.floor(discountedTotal))}</b>
              </span>
            </div>
            <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
              <Button
                className="ml-2 pl-4 pr-4"
                style={{
                  backgroundColor: "#FB6E3B",
                  color: "#ffff",
                  border: "solid 1px #FB6E3B",
                  fontSize: 26,
                }}
                onClick={() => onSubmit()}
              >
                <FontAwesomeIcon
                  icon={faCashRegister}
                  style={{ color: "#fff" }}
                />{" "}
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
