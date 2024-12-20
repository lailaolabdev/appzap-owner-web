import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import axios from 'axios';

export default function PopUpShowSales({ open, onClose, salesData, END_POINT_SEVER }) {
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(false);

  const checkTimeRange = () => {
    if (!salesData || !salesData.isAvailable) return false;

    const now = new Date();
    const eventDate = new Date(salesData.eventDate);
    
    // ตรวจสอบความถี่การแสดงผล
    let shouldShowBasedOnFrequency = false;
    switch (salesData.repeatFrequency) {
      case 'none':
        // แสดงเฉพาะวันที่กำหนด
        shouldShowBasedOnFrequency = now.toDateString() === eventDate.toDateString();
        break;
      case 'daily':
        // แสดงทุกวัน
        shouldShowBasedOnFrequency = true;
        break;
      case 'weekly':
        // แสดงทุกสัปดาห์ในวันเดียวกัน
        shouldShowBasedOnFrequency = now.getDay() === eventDate.getDay();
        break;
      case 'monthly':
        // แสดงทุกเดือนในวันที่เดียวกัน
        shouldShowBasedOnFrequency = now.getDate() === eventDate.getDate();
        break;
      default:
        shouldShowBasedOnFrequency = false;
    }

    // ถ้าเป็น isAllDay ให้แสดงทั้งวัน
    if (salesData.isAllDay) {
      return shouldShowBasedOnFrequency;
    }

    // ตรวจสอบเวลา
    if (salesData.startTime && salesData.endTime) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMinute] = salesData.startTime.split(':').map(Number);
      const [endHour, endMinute] = salesData.endTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      // ตรวจสอบว่าอยู่ในช่วงเวลาที่กำหนด
      return shouldShowBasedOnFrequency && 
             currentTime >= startTimeInMinutes && 
             currentTime <= endTimeInMinutes;
    }

    return shouldShowBasedOnFrequency;
  };

  const updateClicks = async () => {
    try {
      const updatedClicks = (salesData?.clicks || 0) + 1;
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/${salesData._id}`, {
        clicks: updatedClicks,
      });
      console.log(`Updated clicks to: ${updatedClicks}`);
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  useEffect(() => {
    const timeCheck = () => {
      const shouldShow = checkTimeRange();
      setIsWithinTimeRange(shouldShow);
      
      // แยกการแสดงเวลาให้ชัดเจนขึ้น
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeFormatted = `${hours}:${minutes}`;
  
      console.log('Time check result:', {
        isAvailable: salesData?.isAvailable,
        repeatFrequency: salesData?.repeatFrequency,
        isAllDay: salesData?.isAllDay,
        currentTime: currentTimeFormatted,  // แสดงแค่ HH:mm
        startTime: salesData?.startTime,    // เพิ่มการแสดง startTime
        endTime: salesData?.endTime,        // เพิ่มการแสดง endTime
        shouldShow: shouldShow
      });
    };
  
    timeCheck();
    const interval = setInterval(timeCheck, 60000);
    return () => clearInterval(interval);
  }, [salesData]);
  // ไม่แสดง Modal ถ้าไม่อยู่ในช่วงเวลาที่กำหนด
  if (!isWithinTimeRange) return null;

  return (
    <Modal size="md" show={open} onHide={onClose} centered>
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
            updateClicks();
            onClose();
            if (salesData?.link) {
              window.open(salesData.link, '_blank');
            }
          }}
        >
          ສັ່ງຊື້
        </Button>
      </Modal.Footer>
    </Modal>
  );
}