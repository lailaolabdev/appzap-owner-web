import React from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";
import { COLOR_APP } from "../../constants";

const PopUpReservationDetail = ({
  open,
  data,
  onClose,
  buttonEdit,
  buttonCancel,
  buttonConfirm,
}) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ລາຍລະອຽດການຈອງ</Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
            gap: 10,
          }}
        >
          <Button
            onClick={buttonEdit}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            ແກ້ໄຂ
          </Button>
          <Button
            onClick={buttonConfirm}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            ຍືນຍັນການຈອງ
          </Button>
          <Button
            onClick={buttonCancel}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            ຍົກເລີກ
          </Button>
        </div>
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
                moment(data?.startTime).format("DD / MM / YYYY")}
            </span>
            <span>
              {data?.startTime &&
                moment(data?.startTime).format("LT")}
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
        <CustomCart>
          <span style={{ textAlign: "right" }}>ສະຖານທີ່ :</span>
          <span>{data?.note}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>ວັນທີສ້າງ ແລະ ອັບເດດ :</span>
          <span>
            {data?.createdAt &&
              moment
                (data?.createdAt)
                .format("DD / MM / YYYY LT")}{" "}
            -{" "}
            {data?.updatedAt &&
              moment(data?.updatedAt).format("DD / MM / YYYY LT")}
          </span>
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
