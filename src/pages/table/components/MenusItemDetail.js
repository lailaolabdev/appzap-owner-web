import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { moneyCurrency } from "../../../helpers/index";
import { END_POINT, USER_KEY } from '../../../constants'
import { getLocalData } from '../../../constants/api'
import { getHeaders } from "../../../services/auth";
import { errorAdd, successAdd } from "../../../helpers/sweetalert";
import socketIOClient from "socket.io-client";

import useReactRouter from "use-react-router";
const MenusItemDetail = (props) => {
  const { history, location, match } = useReactRouter()
  const [getTokken, setgetTokken] = useState()
  const [NewData, setNewData] = useState()
  const { data } = props;
  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData()
      if (_localData) {
        setgetTokken(_localData)
      }
    }
    fetchData();
    Getdata()
  }, [data])

  const Getdata = async () => {
    let getId = []
    for (let i = 0; i < data?.length; i++) {
      getId.push(data[i]?._id)
    }
    if(getId.length == 0)return;
    const resData =await axios({
      method: 'GET',
      url: END_POINT + `/orderItemArray/?id=${getId}`,
    })
    setNewData(resData?.data)
  }

  let total = 0;
  if (NewData && NewData.length > 0) {
    for (let orderItem of NewData) {
      total += orderItem?.quantity * orderItem?.price;
    }
  }
  const socket = socketIOClient(END_POINT);
  socket.on(`checkoutSuccess${getTokken?.DATA?.storeId}`, data => {
    if (data) {
      successAdd('ສຳເລັດການຮັບເງີນ')
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });
  const _checkBill = async () => {
    if (data) {
      await axios.put(END_POINT + `/orders/${props.data[0]?.orderId?._id}`, {
        status: "CHECKOUT",
        checkout: "true",
        code: props.data[0]?.orderId?.code
      },
        {
          headers: await getHeaders(),
        }).then(async function (response) {
        }).catch(function (error) {
          errorAdd('ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ')
        });
    } else {
      errorAdd('ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ')
    }
  }
  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      centered
      arialabelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>ລາຍລະອຽດເມນູອໍເດີ້</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ລາຄາ</th>
              <th>ເບີຕູບ</th>
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
                        ? moneyCurrency(
                          orderItem?.price * orderItem?.quantity
                        )
                        : "-"}
                    </td>
                    <td>{orderItem?.orderId?.table_id}</td>

                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end">
          <div className="p-2 col-example text-center">ລາຄາລວມ:</div>
          <div
            className="p-2 col-example text-center"
            style={{
              backgroundColor: "#F1F1F1",
              width: 140,
              height: 40,
            }}
          >
            <span><b>{moneyCurrency(total)}</b></span>
            <span style={{ justifyContent: "flex-end", display: "row" }}>
              {" "}
              <b>ກີບ</b>
            </span>
          </div>
          <Button className="ml-2 pl-4 pr-4" onClick={props.hide} style={{ backgroundColor: '#FB6E3B', color: "#ffff", border: "solid 1px #FB6E3B" }} onClick={() => _checkBill()}>ອອກ</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
MenusItemDetail.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func,
  data: PropTypes.array,
};
export default MenusItemDetail;
