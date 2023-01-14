import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { successAdd } from "../../../helpers/sweetalert";
import { updateManyOrderItemsFeedBack } from "../../../services/order";


const FeedbackOrder = ({ data, show, hide }) => {

  const [newDataItem, setNewDataItem] = useState([])
  const [saveDataItemQty, setsaveDataItemQty] = useState()


  useEffect(() => {
    let _data =[]
    for (let i = 0; i < data?.length; i++){
      _data.push({...data[i],newQty:0})
    }
    setNewDataItem(_data)
  }, [data])

  const _feedBackOrder = async ( newQty, index) => {
    let _newQty = parseInt(newQty)
    // let changeData = newDataItem[index].newQty =(_newQty ? _newQty : 0);
    setsaveDataItemQty({ data: newDataItem, storeId: newDataItem[0]?.storeId })
  }

  const _saveFeedBackOrder = async () => {
    try {
      const res = await updateManyOrderItemsFeedBack(saveDataItemQty?.data, saveDataItemQty?.storeId)
      if (res?.data) {
        hide();
        window.location.reload();
        successAdd("ສຳເລັດການສົ່ງຄືນ")
      }
    } catch (error) {
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
            {data && data?.map((item, index) => {
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
            // onClick={hide}
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
