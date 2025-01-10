import React from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { useTranslation } from "react-i18next";

export default function PopUpShowSales({
  open,
  onClose,
  salesData,
  handleaddStoreId,
  handleUpdateSalesClick,
  selectId,
}) {
  const { t } = useTranslation();

  const handleClose = async () => {
    try {
      // First update the availability
      await handleaddStoreId(
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
      await handleaddStoreId(
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