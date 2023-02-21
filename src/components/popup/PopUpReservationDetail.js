import React from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import { useTranslation } from "react-i18next";

const PopUpReservationDetail = ({
  open,
  data,
  onClose,
  buttonEdit,
  buttonCancel,
  buttonConfirm,
  buttonSuccess,
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t('bookingDetail')}</Modal.Header>
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
            onClick={buttonSuccess}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            {t('bookingSuccess')}
          </Button>
          <Button
            onClick={buttonEdit}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            {t('edit')}
          </Button>
          <Button
            onClick={buttonConfirm}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            {t('bookingConfirm')}
          </Button>
          <Button
            onClick={buttonCancel}
            style={{
              backgroundColor: "white",
              color: COLOR_APP,
              borderColor: COLOR_APP,
            }}
          >
            {t('cancel')}
          </Button>
        </div>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('bookedBy')} :</span>
          <span>{data?.clientNames?.[0]}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('phoneNumberOfBooked')} :</span>
          <span>{data?.clientPhone}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('date&&timeBooking')} :</span>
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
          <span style={{ textAlign: "right" }}>{t('numberOfPeopleBooking')} :</span>
          <span>{data?.clientNumber}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('moreDetail')} :</span>
          <span>{data?.clientComment}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('place')} :</span>
          <span>{data?.note}</span>
        </CustomCart>
        <CustomCart>
          <span style={{ textAlign: "right" }}>{t('createdAndUpdatedDate')} :</span>
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
