import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Form } from "react-bootstrap";
import { moneyCurrency } from "../../../helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useStore } from "../../../store";
import { useTranslation } from "react-i18next";
import BillForCheckOut80 from "../../../components/bill/BillForCheckOut80";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { URL_PHOTO_AW3 } from "../../../constants";

const OrderCheckOut = ({
  data = { orderId: [] },
  tableData = {},
  show = false,
  hide,
  taxPercent = 0,
  onPrintBill = () => {},
  onSubmit = () => {},
  staffData,
}) => {
  const { t } = useTranslation();
  const { storeDetail, profile } = useStore();
  const [total, setTotal] = useState();
  const [isBill, setIsBill] = useState(false);
  const [isConfirmStaff, setIsConFirmStaff] = useState(false);
  const [defualtRoleUser, setDefualtRoleUser] = useState("APPZAP_COUNTER");

  // console.log("storeDetail:---->", storeDetail, staffData?.users);

  // console.log("data.orderId: ", data.orderId)

  useEffect(() => {
    _calculateTotal();
  }, [data, data?.orderId]);

  const _calculateTotal = () => {
    setTotal();
    let _total = 0;
    if (data?.orderId) {
      for (let i = 0; i < data?.orderId?.length; i++) {
        if (data?.orderId[i]?.status === "SERVED") {
          _total +=
            data?.orderId[i]?.quantity *
            (data?.orderId[i]?.price +
              (data?.orderId[i]?.totalOptionPrice ?? 0));
        }
      }
    }
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

  return (
    <>
      <Modal
        show={show}
        size={"lg"}
        onHide={hide}
        arialabelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("order_detial")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>
            {t("table")}:{tableData?.tableName}
          </pre>
          <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("code")}:{tableData?.code}
          </pre>
          <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
            {t("open_at")}:
            {moment(tableData?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}
          </pre>
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
            <tbody>
              {data &&
                data?.orderId?.map((orderItem, index) => {
                  const options =
                    orderItem?.options
                      ?.map((option) =>
                        option.quantity > 1
                          ? `[${option.quantity} x ${option.name}]`
                          : `[${option.name}]`
                      )
                      .join(" ") || "";
                  return (
                    <tr key={getOrderItemKey(orderItem)}>
                      <td>{index + 1}</td>
                      <td>
                        {orderItem?.name ?? "-"} {options}
                      </td>
                      <td>{orderItem?.quantity}</td>
                      <td>
                        {moneyCurrency(
                          orderItem?.price + (orderItem?.totalOptionPrice ?? 0)
                        )}
                      </td>
                      <td>
                        {orderItem?.price
                          ? moneyCurrency(
                              (orderItem?.price +
                                (orderItem?.totalOptionPrice ?? 0)) *
                                orderItem?.quantity
                            )
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td colspan="4" style={{ textAlign: "center" }}>
                  {t("discount")}:
                </td>
                <td colspan="1">
                  {moneyCurrency(data?.discount)}{" "}
                  {data?.discountType !== "LAK"
                    ? "%"
                    : storeDetail?.firstCurrency}
                </td>
              </tr>
              <tr>
                <td colspan="4" style={{ textAlign: "center" }}>
                  {t("total_price")}:
                </td>
                <td colspan="1">
                  {moneyCurrency(total)} {storeDetail?.firstCurrency}
                </td>
              </tr>
              <tr>
                <td colspan="4" style={{ textAlign: "center" }}>
                  {t("total_price")} + {t("tax")} {taxPercent}%:
                </td>
                <td colspan="1">
                  {moneyCurrency(total * (taxPercent * 0.01 + 1))}{" "}
                  {storeDetail?.firstCurrency}
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Button
              className="ml-2 pl-4 pr-4"
              style={{
                backgroundColor: "#FB6E3B",
                color: "#ffff",
                border: "solid 1px #FB6E3B",
                fontSize: 26,
              }}
              onClick={() => onPrintBill()}
            >
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
              <span style={{ justifyContent: "flex-end", display: "row" }}>
                <b>
                  {data && data?.discountType === "LAK"
                    ? moneyCurrency(
                        total * (taxPercent * 0.01 + 1) - data?.discount > 0
                          ? total * (taxPercent * 0.01 + 1) - data?.discount
                          : 0
                      )
                    : moneyCurrency(
                        total * (taxPercent * 0.01 + 1) -
                          (total * (taxPercent * 0.01 + 1) * data?.discount) /
                            100 >
                          0
                          ? total * (taxPercent * 0.01 + 1) -
                              (total *
                                (taxPercent * 0.01 + 1) *
                                data?.discount) /
                                100
                          : 0
                      )}
                </b>
              </span>
            </div>
            <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
              {/* <Button
                  className="ml-2 pl-4 pr-4"
                  style={{
                    backgroundColor: "#FB6E3B",
                    color: "#ffff",
                    border: "solid 1px #FB6E3B",
                    fontSize: 26,
                  }}
                  onClick={onConfirmStaffToCheckBill}
                >
                  <FontAwesomeIcon
                    icon={faCashRegister}
                    style={{ color: "#fff" }}
                  />{" "}
                  {t("change_who_check_bill")}
                </Button> */}
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
          </div>
        </Modal.Footer>
      </Modal>

      {/* <Modal
        size="lg"
        centered
        show={isConfirmStaff}
        onHide={onCancelConfirmStaff}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{t("chose_staff_check_bill")}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", gap: 20 }}>
            <Button onClick={() => setDefualtRoleUser("APPZAP_COUNTER")}>
              {t("counter")}
            </Button>
            <Button onClick={() => setDefualtRoleUser("APPZAP_STAFF")}>
              {t("server")}
            </Button>
            <Button
              disabled={profile?.data?.role != "APPZAP_ADMIN"}
              onClick={() => setDefualtRoleUser("APPZAP_ADMIN")}
            >
              {t("ceo")}
            </Button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 15,
              padding: "1em 0",
            }}
          >
            {staffData?.users
              ?.filter((e) => e?.role == defualtRoleUser)
              ?.map((data, index) => {
                return (
                  <Button
                    onClick={() => onConfirmToCheckOut(data)}
                    variant="outline-danger"
                    key={index}
                    style={{ width: "100%", padding: "1em 0" }}
                  >
                    {data?.image ? (
                      <img
                        style={{
                          width: 35,
                          height: 35,
                          background: "#ffffff",
                          borderRadius: "50em",
                          border: "1px solid #ddd",
                        }}
                        src={URL_PHOTO_AW3 + data?.image}
                        alt=""
                      />
                    ) : (
                      <FaUserCircle style={{ fontSize: 35 }} />
                    )}
                    <p>
                      {data?.firstname ?? "-"} {data?.lastname ?? "-"}
                    </p>
                  </Button>
                );
              })}
          </div>
        </Modal.Body>
      </Modal> */}
    </>
  );
};

OrderCheckOut.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.array,
};

export default OrderCheckOut;
