import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { moneyCurrency } from "../../../helpers/index";
import { COLOR_APP, END_POINT, USER_KEY } from "../../../constants";
import { getLocalData } from "../../../constants/api";
import { getHeaders } from "../../../services/auth";
import { errorAdd, successAdd } from "../../../helpers/sweetalert";
// import socketIOClient from "socket.io-client";
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Swal from 'sweetalert2'
import { useStore } from "../../../store";

const OrderCheckOut = ({ data, tableData, show, hide, resetTableOrder }) => {
  const [NewData, setNewData] = useState();
  const [total, setTotal] = useState();
  const [discount, setDiscount] = useState(0)
  const [radioValue, setRadioValue] = useState('1');
  const [resDataBill, setResDataBill] = useState({})

  const {
    callingCheckOut,
  } = useStore();

  useEffect(() => {
    setNewData(data)
    _bill(data[0]?.billId)
  }, [data]);

  useEffect(() => {
    _calculateTotal()
    if (NewData && NewData[0]?.orderId?.discount) setDiscount(NewData[0]?.orderId?.discount)
    if (NewData && NewData[0]?.orderId?.discountType) setRadioValue(NewData[0]?.orderId?.discountType === "LAK" ? "2" : "1")
  }, [NewData]);

  const _bill = async (billId) => {
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    const _resBill = await axios({
      method: 'get',
      url: END_POINT + `/v3/bill/` + billId,
      headers: headers
    })
    setDiscount(_resBill?.data?.discount)
    setResDataBill(_resBill?.data)
  }
  const _calculateTotal = () => {
    let _total = 0;
    if (NewData && NewData.length > 0) {
      for (let orderItem of NewData) {
        _total += orderItem?.quantity * orderItem?.price;
      }
    }
    setTotal(_total)
  }
  const _checkBill = async () => {
    if (!data[0]?.billId) {
        await axios
          .put(
            END_POINT + `/updateGenerates/${tableData?.code}`,
            {
              "isOpened": false,
              "staffConfirm": false
            },
            {
              headers: await getHeaders(),
            }
          )
          .then(async function (response) {
            Swal.fire({
              icon: 'success',
              title: "ສໍາເລັດການເຊັກບິນ",
              showConfirmButton: false,
              timer: 1800
            })
            resetTableOrder()
            hide()
          })
      } else {
        await axios
          .put(
            END_POINT + `/v3/bill-checkout`,
            {
              id: data[0]?.billId,
              data: {
                "isCheckout": "true",
                "status": "CHECKOUT"
             }
            },
            {
              headers: await getHeaders(),
            }
          )
          .then(async function (response) {
            callingCheckOut()
            Swal.fire({
              icon: 'success',
              title: "ສໍາເລັດການເຊັກບິນ",
              showConfirmButton: false,
              timer: 1800
            })
            resetTableOrder()
            hide()
          })
          .catch(function (error) {
            errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
          });
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
        <Modal.Title>ລາຍລະອຽດເມນູອໍເດີ້</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>ໂຕະ:{tableData?.tableName}</pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>ລະຫັດ:{tableData?.code}</pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>ເປີດເມື່ອ:{moment(tableData?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}</pre>
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
              data?.map((orderItem, index) => {
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
              <td colspan="4" style={{ textAlign: "center" }}>ລາຄາລວມ:</td>
              <td colspan="1">{moneyCurrency(total)} ກີບ</td>
            </tr>
            <tr>
              <td colspan="4" style={{ textAlign: "center" }}>ສ່ວນຫຼຸດ:</td>
              <td colspan="1">{moneyCurrency(discount)} {resDataBill?.discountType !== "LAK" ? "%":"ກີບ"}</td>
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
              <b> {moneyCurrency(resDataBill?.discountType !== "LAK" ? total - (total * discount) / 100 : total - discount)} ກີບ</b>
            </span>
          </div>
          <Button
            className="ml-2 pl-4 pr-4"
            onClick={hide}
            style={{
              backgroundColor: "#FB6E3B",
              color: "#ffff",
              border: "solid 1px #FB6E3B",
              fontSize: 30,
            }}
            onClick={() => _checkBill()}
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
