import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { warningAlert, successAdd } from "../../../helpers/sweetalert";
import { updateOrderItem } from "../../../services/order";


const FeedbackOrder = ({ data, show, hide }) => {

  const [saveDataItemQty, setsaveDataItemQty] = useState()
  const _feedBackOrder = async (qty, newQty, index) => {
    const dataNew = [...data];
    if (qty < newQty) return warningAlert("ຈຳນວນເກີນ...!");
    let changeData = dataNew[index].quantity = qty - newQty;
    setsaveDataItemQty({ data: dataNew, storeId: dataNew[0]?.storeId })

  }
  const _saveFeedBackOrder = async () => {
    const res = await updateOrderItem(saveDataItemQty?.data, saveDataItemQty?.storeId)
    if (res?.data) {
      hide();
      window.location.reload();
      successAdd("ສຳເລັດການສົ່ງຄືນ")
    }
  }
  return (
    <Modal
      show={show}
      size={"lg"}
      onHide={hide}
      centered
      arialabelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>ສົ່ງອາຫານຄືນ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນທີ່ມີ</th>
              <th>ຈຳນວນສົ່ງຄືນ</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name ?? "-"}</td>
                  <td>{item?.quantity}</td>
                  <td><input
                    type="number"
                    onChange={(e) => _feedBackOrder(item?.quantity, e?.target?.value, index)} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div style={{ textAlign: "center" }}>
          <Button
            className="ml-2 pl-4 pr-4"
            onClick={hide}
            style={{
              backgroundColor: "#FB6E3B",
              color: "#ffff",
              border: "solid 1px #FB6E3B",
              fontSize: 25,
            }}
            onClick={() => _saveFeedBackOrder()}
          >
            ຢືນຢັ້ນການສົ່ງອາຫານຄືນ
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default FeedbackOrder;
