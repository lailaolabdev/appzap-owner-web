import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { useTranslation } from "react-i18next";

export default function PopUpShowSales({
  open,
  onClose,
  salesData,
  handleUpdateAvailableStoreId,
  handleUpdateSalesClick,
  selectId,
}) {
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const { t } = useTranslation();

  const checkTimeRange = () => {
    if (!salesData || !salesData.isAllAvailables) return false;
  
    const now = new Date();
    const eventDate = new Date(salesData.eventDate);
  
    if (isNaN(eventDate)) return false; // ตรวจสอบ eventDate
  
    let shouldShowBasedOnFrequency = false;
  
    switch (salesData.repeatFrequency) {
      case "NONE":
        shouldShowBasedOnFrequency =
          now.toDateString() === eventDate.toDateString();
        break;
      case "DAILY":
        shouldShowBasedOnFrequency = true;
        break;
      case "WEEKLY":
        shouldShowBasedOnFrequency =
          now.getDay() === eventDate.getDay(); // ตรวจสอบว่าวันตรงกัน (เช่น วันจันทร์ตรงกัน)
        break;
      case "MONTHLY":
        shouldShowBasedOnFrequency =
          now.getFullYear() === eventDate.getFullYear() &&
          now.getMonth() === eventDate.getMonth();
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
  
      if (startTimeInMinutes <= endTimeInMinutes) {
        // กรณีเวลาไม่ข้ามวัน
        return (
          shouldShowBasedOnFrequency &&
          currentTime >= startTimeInMinutes &&
          currentTime <= endTimeInMinutes
        );
      } else {
        // กรณีเวลา "ข้ามวัน"
        return (
          shouldShowBasedOnFrequency &&
          (currentTime >= startTimeInMinutes || currentTime <= endTimeInMinutes)
        );
      }
    }
  
    return shouldShowBasedOnFrequency;
};

  

  useEffect(() => {
    const checkAvailability = () => {
      if (!salesData?.isAllAvailables) {
        setShouldShow(false);
        return;
      }

      const selectedStore = salesData?.selectedStores?.find(
        (store) => store._id === selectId
      );

      if (!selectedStore?.isAvailable) {
        setShouldShow(false);
        return;
      }

      const timeRangeResult = checkTimeRange();
      setIsWithinTimeRange(timeRangeResult);
      setShouldShow(timeRangeResult);
    };

    if (salesData && selectId) {
      checkAvailability();
      const interval = setInterval(checkAvailability, 60000);
      return () => clearInterval(interval);
    }
  }, [salesData, selectId]);




  const handleClose = async () => {
    try {
      // First update the availability
      await handleUpdateAvailableStoreId(
        selectId, 
        false, 
        salesData._id, 
        salesData.selectedStores.find(store => store._id === selectId)?.storeId
      );
      // Then close the modal
      onClose();
    } catch (error) {
      console.error('Error closing popup:', error);
      // Still close the modal even if the update fails
      onClose();
    }
  };

  const handleOrder = async () => {
    try {
      // อัปเดต clicks
      await handleUpdateSalesClick(salesData._id);
      
      // อัปเดตความพร้อมใช้งาน
      await handleUpdateAvailableStoreId(
        selectId,
        false,
        salesData._id,
        salesData.selectedStores.find(store => store._id === selectId)?.storeId
      );
  
      onClose();
  
      if (salesData?.link) {
        window.open(salesData.link, "_blank");
      }
    } catch (error) {
      console.error('Error handling order:', error);
      onClose();
      if (salesData?.link) {
        window.open(salesData.link, "_blank");
      }
    }
  };
  

  return (
    <Modal
      size="md"
      show={open}
      onHide={handleClose}
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
          onClick={handleOrder}
        >
          {t("order_")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}