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
import socketIOClient from "socket.io-client";
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCashRegister, faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Swal from 'sweetalert2'

const OrderCheckOut = ({ data, tableData, show, hide, resetTableOrder }) => {
  const { history, location, match } = useReactRouter();
  const [NewData, setNewData] = useState();
  const [total, setTotal] = useState();

  // const socket = socketIOClient(END_POINT);
  // socket.on(`checkoutSuccess${getTokken?.DATA?.storeId}`, (data) => {
  //   if (data) {
  //     successAdd("ສຳເລັດການຮັບເງີນ");
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 2000);
  //   }
  // });

  useEffect(() => {
    Getdata();
  }, [data]);

  useEffect(() => {
    _calculateTotal()
  }, [NewData]);

  const Getdata = async () => {
    let getId = [];
    for (let i = 0; i < data?.length; i++) {
      getId.push(data[i]?._id);
    }
    if (getId.length == 0) return;
    const resData = await axios({
      method: "GET",
      url: END_POINT + `/orderItemArray/?id=${getId}`,
    });
    setNewData(resData?.data);
  };


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
    console.log({ data })
    if (data) {


      if (!data[0]?.orderId?._id) {
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
            END_POINT + `/orders/${data[0]?.orderId?._id}`,
            {
              status: "CHECKOUT",
              checkout: "true",
              code: data[0]?.orderId?.code,
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
          .catch(function (error) {
            errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
          });
      }

    } else {
      errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
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
        <pre style={{ fontSize: 30, fontWeight: "bold", margin: 0 }}>ໂຕະ:{tableData?.table_id}</pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>ລະຫັດ:{tableData?.code}</pre>
        <pre style={{ fontSize: 16, fontWeight: "bold", margin: 0 }}>ເປີດເມື່ອ:{moment(tableData?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}</pre>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ລາຄາ</th>
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
                    <td>
                      {orderItem?.price
                        ? moneyCurrency(orderItem?.price * orderItem?.quantity)
                        : "-"}
                    </td>
                  </tr>
                );
              })}
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
            ລາຄາລວມ:
          </div>
          <div
            className="p-2 col-example text-center"
            style={{
              backgroundColor: "#F1F1F1",
              fontSize: 26,
            }}
          >
            <span>
              <b>{moneyCurrency(total)}</b>
            </span>
            <span style={{ justifyContent: "flex-end", display: "row" }}>
              {" "}
              <b>ກີບ</b>
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
