import React from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import { moneyCurrency } from "../../../helpers/index";
const MenusItemDetail = (props) => {
  const { data } = props;
  let total = 0;
  if (data && data.length > 0) {
    for (let orderItem of data) {
      total += orderItem?.quantity * orderItem?.menu?.price;
    }
    //   setTotalMoney(total);
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
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end">
          <div className="p-2 col-example text-left">ລາຄາລວມ:</div>
          <div
            className="p-2 col-example text-left"
            style={{
              backgroundColor: "#F1F1F1",
              width: 140,
              height: 40,
            }}
          >
            <span>{moneyCurrency(total)}</span>
            <span style={{ justifyContent: "flex-end", display: "row" }}>
              {" "}
              ກີບ
            </span>
          </div>
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
