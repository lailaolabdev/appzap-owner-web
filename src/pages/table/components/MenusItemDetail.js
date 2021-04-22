import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { moneyCurrency } from "../../../helpers/index";
import { END_POINT } from '../../../constants'
import { getHeaders } from "../../../services/auth";
const MenusItemDetail = (props) => {
  const { data } = props;
  let total = 0;
  if (data && data.length > 0) {
    for (let orderItem of data) {
      total += orderItem?.quantity * orderItem?.menu?.price;
    }
  }
  let newData = []
  const _checkBill = async () => {
    for (let i = 0; i < data.length; i++) {
      newData.push(data[i]?.orderId)
      // await axios({
      //   method: 'PUT',
      //   url: END_POINT + `/orders/${data[i]?.orderId}`,
      //   headers: await getHeaders(),
      //   data: {
      //     status: "CHECKOUT",
      //     checkout: "true"
      //   },
      // })
    }
  }
  console.log("🚀 ~ file: MenusItemDetail.js ~ line 19 ~ MenusItemDetail ~ newData", newData)
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
              <th>ເບີໂຕະ</th>
            </tr>
          </thead>
          <tbody>
            {props &&
              props?.data?.map((orderItem, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{orderItem?.menu?.name ?? "-"}</td>
                    <td>{orderItem?.quantity}</td>
                    <td>
                      {orderItem?.menu?.price
                        ? moneyCurrency(
                          orderItem?.menu?.price * orderItem?.quantity
                        )
                        : "-"}
                    </td>
                    <td>{orderItem?.table_id}</td>

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
