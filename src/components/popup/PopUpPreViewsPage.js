import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { URL_PHOTO_AW3 } from "../../constants";

export default function PopUpPreViewsPage({ onClose, open, datas, storeData }) {
  //   console.log("checkData:--->", datas);
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <div>
            <img
              style={{
                height: 80,
                width: 80,
                borderRadius: "50%",
              }}
              src={URL_PHOTO_AW3 + storeData?.image}
            />
          </div>
          <h2>{storeData?.name}</h2>
          <p>ເບີໂທລະສັບ: {storeData?.phone}</p>
          {/* <p><b>ລາຍການສະຕ໋ອກທັງໝົດ</b></p> */}
        </div>

        <div>
          <Table>
            <thead>
              <tr>
                <th>ລ/ດ</th>
                <th>ປະເພດ</th>
                <th>ຊື່ສິນຄ້າ</th>
                <th>ຈຳນວນ (ຫົວໜ່ວຍ)</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "4px 2px"}}>{index + 1}</td>
                  <td style={{ padding: "4px 2px"}}>
                    {item?.stockCategoryId?.name}
                  </td>
                  <td style={{ padding: "4px 2px"}}>{item?.name}</td>
                  <td style={{ padding: "4px 2px"}}>
                    {item?.quantity} {item?.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div>
            <Button className="w-100" disabled >ປິ້ນບິນ</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
