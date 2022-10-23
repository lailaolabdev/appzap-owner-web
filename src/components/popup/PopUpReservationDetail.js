import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";

const PopUpReservationDetail = ({ open, data, onClose, onSubmit }) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ລາຍລະອຽດການຈອງ</Modal.Header>
      <Modal.Body>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ຊື່ຜູ້ຈອງ :</span>
          <span>{data?.clientNames?.[0]}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ເບີໂທຜູ້ຈອງ :</span>
          <span>{data?.clientPhone}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ວັນ - ເວລາທີ່ຈອງ :</span>
          <span style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {data?.startTime &&
                moment.parseZone(data?.startTime).format("DD / MM / YYYY")}
            </span>
            <span>
              {data?.startTime &&
                moment.parseZone(data?.startTime).format("LT")}
            </span>
          </span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ຈຳນວນຄົນທີ່ຈະມາ :</span>
          <span>{data?.clientNumber}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ລາຍລະອຽດເພີ່ມເຕີມ :</span>
          <span>{data?.clientComment}</span>
        </CustomCart>
      </Modal.Body>
    </Modal>
  );
};

export default PopUpReservationDetail;

const CustomCart = styled("div")({
  backgroundColor: "#F8F8F8",
  padding: 10,
  borderRadius: 8,
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gridGap: 10,
  marginBottom: 10,
});
