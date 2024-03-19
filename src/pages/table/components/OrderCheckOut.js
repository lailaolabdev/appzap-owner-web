import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { moneyCurrency } from "../../../helpers/index";
// import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useStore } from "../../../store";
// import { useStore } from "../../../store";

const OrderCheckOut = ({
  data = { orderId: [] },
  tableData = {},
  show = false,
  hide,
  taxPercent = 0,
  onPrintBill = () => {},
  onSubmit = () => {},
}) => {
  const { storeDetail } = useStore();
  const [total, setTotal] = useState();

  useEffect(() => {
    // for (let i = 0; i < data?.orderId.length; i++) {
    _calculateTotal();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, data?.orderId]);

  const _calculateTotal = () => {
    setTotal();
    let _total = 0;
    if (data?.orderId) {
      for (let i = 0; i < data?.orderId?.length; i++) {
        if (data?.orderId[i]?.status === "SERVED") {
          _total += data?.orderId[i]?.quantity * data?.orderId[i]?.price;
        }
      }
    }
    // alert(_total);
    setTotal(_total);
  };

  return (
    <Modal
      show={show}
      size={"lg"}
      onHide={hide}
      arialabelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>ລາຍລະອຽດເມນູອໍເດີ້</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>
          ໂຕະ:{tableData?.tableName}
        </pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
          ລະຫັດ:{tableData?.code}
        </pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>
          ເປີດເມື່ອ:
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
            {data &&
              data?.orderId?.map((orderItem, index) => {
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
                ສ່ວນຫຼຸດ:
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
                ລາຄາລວມ:
              </td>
              <td colspan="1">
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </td>
            </tr>
            <tr>
              <td colspan="4" style={{ textAlign: "center" }}>
                ລາຄາລວມ + ພາສີ {taxPercent}%:
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            className="ml-2 pl-4 pr-4"
            // onClick={hide}
            style={{
              backgroundColor: "#FB6E3B",
              color: "#ffff",
              border: "solid 1px #FB6E3B",
              fontSize: 30,
            }}
            onClick={() => onPrintBill()}
          >
            <FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} />
            ພິມບິນ
          </Button>
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
                            (total * (taxPercent * 0.01 + 1) * data?.discount) /
                              100
                        : 0
                    )}
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
            onClick={() => onSubmit()}
          >
            <FontAwesomeIcon icon={faCashRegister} style={{ color: "#fff" }} />{" "}
            ເຊັກບິນ
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
OrderCheckOut.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.array,
};
export default OrderCheckOut;
