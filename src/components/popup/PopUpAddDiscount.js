import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import moment from "moment";
import styled from "styled-components";
import { moneyCurrency, orderStatus } from "../../helpers";
import * as _ from "lodash";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";
export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
export default function PopUpAddDiscount({
  open,
  value,
  onClose,
  onSubmit,
  dataBill,
}) {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const { storeDetail } = useStore();
  // const [persand, setPersand] = useState('noneActive');
  // const [kip, setKip] = useState('noneActive');
  // const [active, setActive] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  const setDiscountBill = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-discount";
      const _body = {
        id: dataBill?._id,
        data: {
          discount: discount,
          discountType: selectedButton === "%" ? "PERCENT" : "LAK",
        },
      };
      const _header = await getHeaders();
      const res = await axios.put(url, _body, { headers: _header });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const data = value.filter((e) => e?.status !== "CANCEL");
    const _sumTotal = _.sumBy(data, function (o) {
      return o?.price * o?.quantity;
    });
    setTotal(_sumTotal);
    setDiscount(dataBill?.discount);
  }, [value, dataBill]);

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t("discount")}</Modal.Header>
      <Modal.Body>
        <TableCustom>
          <thead>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ສະຖານະ</th>
              <th>ຜູ້ສັ່ງ</th>
              <th>ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            {value
              ? value?.map((orderItem, index) => (
                  <tr
                    key={"order" + index}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td>{index + 1}</td>
                    <td>{orderItem?.name}</td>
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
                      {orderItem?.status ? orderStatus(orderItem?.status) : "-"}
                    </td>
                    <td>{orderItem?.createdBy?.firstname}</td>
                    <td>
                      {orderItem?.createdAt
                        ? moment(orderItem?.createdAt).format("HH:mm A")
                        : "-"}
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </TableCustom>
        <div
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>
            ລວມ: {moneyCurrency(total)} {storeDetail?.firstCurrency}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>ສ່ວນຫຼຸດ</div>
          <div style={{ display: "flex", border: "1px solid #ccc" }}>
            <div
              // onClick={handleClick}
              onClick={() => setSelectedButton("%")}
              style={
                selectedButton !== ""
                  ? {
                      backgroundColor:
                        selectedButton === "%" ? COLOR_APP : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
              // style={{
              //   // backgroundColor: (persand == 'noneActive' && kip == 'active') ? COLOR_APP : "white",
              //   width: 40,
              //   height: 40,
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            >
              %
            </div>

            <div
              // onClick={() => handleClick1()}
              onClick={() => setSelectedButton(storeDetail?.firstCurrency)}
              style={
                selectedButton !== ""
                  ? {
                      backgroundColor:
                        selectedButton === storeDetail?.firstCurrency ? COLOR_APP : "white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: COLOR_APP,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
              // style={{
              //   // backgroundColor: (kip == 'noneActive' && persand == 'active') ? COLOR_APP : "white",
              //   width: 40,
              //   height: 40,
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              // }}
            >
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <input
            onKeyDown={preventNegativeValues}
            type="number"
            value={discount}
            min="0"
            style={{ height: 40 }}
            onChange={(e) => {
              setDiscount(e.target.value);
            }}
          />
          <div>{selectedButton}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button> */}
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={async () => {
            setButtonDisabled(true);
            await setDiscountBill();
            onSubmit().then(() => {
              onClose();
              setButtonDisabled(false);
            });
          }}
        >
          ເພີ່ມສ່ວນຫຼຸດ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 12,
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
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
