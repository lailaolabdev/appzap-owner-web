import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { Button, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import { moneyCurrency } from "../../../helpers/index";
import { END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import { errorAdd } from "../../../helpers/sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Swal from "sweetalert2";
import { t } from "i18next";
import { useStore } from "../../../store";

const UpdateDiscountOrder = ({
  data,
  tableData,
  show,
  hide,
  resetTableOrder,
}) => {
  const [NewData, setNewData] = useState();
  const [total, setTotal] = useState();
  const [discount, setDiscount] = useState(0);
  const [radioValue, setRadioValue] = useState("1");

  const { storeDetail } = useStore();

  useEffect(() => {
    setNewData(data);
  }, [data]);
  useEffect(() => {
    _calculateTotal();
    if (NewData && NewData[0]?.orderId?.discount)
      setDiscount(NewData[0]?.orderId?.discount);
    if (NewData && NewData[0]?.orderId?.discountType)
      setRadioValue(NewData[0]?.orderId?.discountType === "LAK" ? "2" : "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NewData]);

  const _calculateTotal = () => {
    let _total = 0;
    if (NewData && NewData.length > 0) {
      for (let orderItem of NewData) {
        _total += orderItem?.quantity * orderItem?.price;
      }
    }
    setTotal(_total);
  };

  const radios = [
    { name: "%", value: "1" },
    { name: storeDetail?.firstCurrency, value: "2" },
  ];

  const _UpdateDiscount = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const updateTable = await axios({
        method: "put",
        url: END_POINT + `/v3/bill-discount`,
        data: {
          id: data[0]?.billId,
          data: {
            discount: discount,
            discountType: radioValue === "1" ? "PERCENT" : "LAK",
          },
        },
        headers: headers,
      });
      if (updateTable?.data) {
        Swal.fire({
          icon: "success",
          title: "ການເພີ່ມສ່ວນຫຼຸດສໍາເລັດ",
          showConfirmButton: false,
          timer: 1800,
        });
        resetTableOrder();
        hide();
      }
    } catch (err) {
      errorAdd("ການເພີ່ມສ່ວນຫຼຸດບໍ່ສໍາເລັດ");
    }
  };
  return (
    <Modal
      show={show}
      size={"lg"}
      onHide={hide}
      centered
      arialabelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>ເພີ່ມສ່ວນຫຼຸດ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>
          ໂຕະ:{tableData?.tableName}
        </pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
          ລະຫັດ:{tableData?.code}
        </pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
          {t("open_time")}:
          {moment(tableData?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}
        </pre>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ລາຄາ</th>
              <th>ລາຄາລວມ</th>
            </tr>
          </thead>
          <tbody>
            {NewData &&
              NewData?.map((orderItem, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{orderItem?.name ?? "-"}</td>
                    <td>{orderItem?.quantity}</td>
                    <td>{moneyCurrency(orderItem?.price)}</td>
                    <td>
                      {orderItem?.price
                        ? moneyCurrency(orderItem?.price * orderItem?.quantity)
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colspan="4" style={{ textAlign: "center" }}>
                ລາຄາລວມ:
              </td>
              <td colspan="1">
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </td>
            </tr>
          </tbody>
        </Table>
        <hr />
        <div
          className="p-2 col-example text-center"
          style={{
            backgroundColor: "#F1F1F1",
            fontSize: 26,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div className="p-2 col-example text-center" style={{ fontSize: 26 }}>
            ສ່ວນຫຼຸດ:
          </div>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <Button
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={radioValue === radio.value ? "info" : "outline-info"}
                name="radio"
                value={radio.value}
                // checked={radioValue === radio.value}
                onClick={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </Button>
            ))}
          </ButtonGroup>
          <input
            type="number"
            defaultValue={discount}
            onChange={(e) => setDiscount(e?.target.value)}
            style={{ marginLeft: 10 }}
          />
          <span style={{ justifyContent: "flex-end", display: "row" }}>
            {" "}
            <b style={{ marginLeft: 10 }}>
              {radioValue === "1" ? "%" : storeDetail?.firstCurrency}
            </b>
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="p-2 col-example text-center" style={{ fontSize: 26 }}>
            ຕ້ອງຈ່າຍທັງໝົດ:
          </div>
          <div
            className="p-2 col-example text-center"
            style={{
              backgroundColor: "#F1F1F1",
              fontSize: 26,
            }}
          >
            <span style={{ justifyContent: "flex-end", display: "row" }}>
              {" "}
              <b>
                {" "}
                {moneyCurrency(
                  radioValue === "1"
                    ? total - (total * discount) / 100
                    : total - discount
                )}{" "}
                {storeDetail?.firstCurrency}
              </b>
            </span>
          </div>
          <Button
            className="ml-2 pl-4 pr-4"
            // onClick={hide}
            style={{
              backgroundColor: "#FB6E3B",
              color: "#ffff",
              border: "solid 1px #FB6E3B",
              fontSize: 30,
            }}
            onClick={() => _UpdateDiscount()}
          >
            <FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} />{" "}
            ເພີ່ມສ່ວນຫຼຸດ
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
UpdateDiscountOrder.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.array,
};
export default UpdateDiscountOrder;
