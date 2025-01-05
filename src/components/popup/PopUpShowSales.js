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

  const checkTimeRange = (salesData, storeId) => {
    if (!salesData || !salesData.isAllAvailables) return false;
  
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const store = salesData.selectedStores.find(s => s.storeId === storeId);
    
    if (!store) return false;
  
    // ถ้าถูกปิดโดยผู้ใช้ในวันนี้
    if (store.lastDisabledDate) {
      const lastDisabled = new Date(store.lastDisabledDate);
      lastDisabled.setHours(0, 0, 0, 0);
      if (lastDisabled.getTime() === now.getTime()) {
        return false;
      }
    }
  
    // ตรวจสอบว่าอยู่ในช่วงเวลาที่ควรแสดงหรือไม่
    if (store.periodStart && store.periodEnd) {
      const periodStart = new Date(store.periodStart);
      const periodEnd = new Date(store.periodEnd);
      
      // ถ้าอยู่ในช่วงเวลาที่กำหนด
      const isWithinPeriod = now >= periodStart && now <= periodEnd;
      
      if (!isWithinPeriod) {
        return false;
      }
  
      // แสดงทุกวันสำหรับทุกความถี่ (DAILY, WEEKLY, MONTHLY)
      return true;
    }
  
    return false;
  };
  
  // ฟังก์ชั่นรีเซ็ตสถานะรายวัน
  
  

  

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

      const timeRangeResult = checkTimeRange(salesData, selectedStore.storeId);
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
      await handleUpdateAvailableStoreId(
        selectId, 
        false, 
        salesData.selectedStores.find(store => store._id === selectId)?.storeId,
        salesData.repeatFrequency,
        salesData.eventDate,
      );
      onClose();
    } catch (error) {
      console.error('Error closing popup:', error);
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