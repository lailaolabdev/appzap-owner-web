import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";

export default function PopUpShowSales({
  open,
  onClose,
  salesData,
  updateAvailableStoreId,
  updateSales,
  selectId,
}) {
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(false);

  const checkTimeRange = () => {
    if (!salesData || !salesData.isAvailables) return false;

    const now = new Date();
    const eventDate = new Date(salesData.eventDate);

    let shouldShowBasedOnFrequency = false;
    switch (salesData.repeatFrequency) {
      case "none":
        shouldShowBasedOnFrequency =
          now.toDateString() === eventDate.toDateString();
        break;
      case "daily":
        shouldShowBasedOnFrequency = true;
        break;
      case "weekly":
        shouldShowBasedOnFrequency = now.getDay() === eventDate.getDay();
        break;
      case "monthly":
        shouldShowBasedOnFrequency = now.getDate() === eventDate.getDate();
        break;
      default:
        shouldShowBasedOnFrequency = false;
    }

    if (salesData.isAllDay) {
      return shouldShowBasedOnFrequency;
    }

    if (salesData.startTime && salesData.endTime) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMinute] = salesData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = salesData.endTime.split(":").map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      return (
        shouldShowBasedOnFrequency &&
        currentTime >= startTimeInMinutes &&
        currentTime <= endTimeInMinutes
      );
    }

    return shouldShowBasedOnFrequency;
  };

  useEffect(() => {
    const timeCheck = () => {
      const shouldShow = checkTimeRange();
      setIsWithinTimeRange(shouldShow);

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const currentTimeFormatted = `${hours}:${minutes}`;

      console.log("Time check result:", {
        isAvailables: salesData?.isAvailables,
        repeatFrequency: salesData?.repeatFrequency,
        isAllDay: salesData?.isAllDay,
        currentTime: currentTimeFormatted,
        startTime: salesData?.startTime,
        endTime: salesData?.endTime,
        shouldShow: shouldShow,
      });
    };

    console.log("salesData:",salesData)

    timeCheck();
    const interval = setInterval(timeCheck, 60000);
    return () => clearInterval(interval);
  }, [salesData]);

  if (!isWithinTimeRange) return null;

  return (
    <Modal
      size="md"
      show={open}
      onHide={() => {
        updateAvailableStoreId(selectId, false);
        onClose();
      }}
      centered
    >
      <div>
        <Modal.Header
          closeButton
          className="d-flex justify-content-center"
          style={{ border: "none" }}
        >
          <Modal.Title
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {salesData?.salesName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            border: "none",
            paddingBottom: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              margin: "0 auto",
              paddingTop: "80%",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <img
              src={`${URL_PHOTO_AW3}${salesData?.previewImage}`}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </Modal.Body>
      </div>
      <Modal.Footer
        className="d-flex justify-content-center"
        style={{ borderTop: "none" }}
      >
        <Button
          style={{
            width: "300px",
            textAlign: "center",
            backgroundColor: COLOR_APP,
            border: 0,
          }}
          onClick={() => {
            updateSales(salesData._id, salesData.clicks);
            updateAvailableStoreId(salesData._id, false);
            onClose();
            if (salesData?.link) {
              window.open(salesData.link, "_blank");
            }
          }}
        >
          ສັ່ງຊື້
        </Button>
      </Modal.Footer>
    </Modal>
  );
}