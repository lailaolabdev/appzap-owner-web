import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, Button, Spinner } from "react-bootstrap";

function PopUpIsOpenMenu({
  showSetting,
  handleClose,
  detailMenu,
  _handOpenMenu,
  _handOpenMenuCounterApp,
  _handOpenMenuCustomerApp,
  _handOpenMenuShowStaff,
  loadingUpdateWeb,
  loadingUpdateApp,
  loadingUpdateStaff,
  loadingUpdateCounter,
}) {
  const { t } = useTranslation();
  
  // Check if any loading state is active
  const isAnyLoading = loadingUpdateWeb || loadingUpdateApp || loadingUpdateStaff || loadingUpdateCounter;
  
  return (
    <div>
      <Modal show={showSetting} onHide={isAnyLoading ? null : handleClose}>
        <Modal.Header>
          <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>
            {t("define_show_menu")}:{" "}
            <q>{detailMenu && detailMenu?.data?.name}</q>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: 'relative', minHeight: 200 }}>
          {isAnyLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Spinner animation="border" variant="primary" />
                <div style={{ marginTop: 10, color: '#666' }}>
                  {t("updating")}...
                </div>
              </div>
            </div>
          )}
                    {/* แสดงที่เคาน์เตอร์ */}
          <div className="menuSttingShow">
            <label>{t("show_at_counter")}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={detailMenu?.data?.isShowCounterApp === "true"}
                disabled={isAnyLoading}
                onChange={() =>
                  _handOpenMenuCounterApp(
                    detailMenu?.data?._id,
                    detailMenu?.data?.isShowCounterApp,
                    detailMenu?.index
                  )
                }
              />
              <span className="slider round"></span>
            </label>
          </div>
                    {/* แสดงให้ลูกค้า (แอป) */}
          <div className="menuSttingShow">
            <label>{t("show_to_app")}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={detailMenu?.data?.isShowCustomerApp === "true"}
                disabled={isAnyLoading}
                onChange={() =>
                  _handOpenMenuCustomerApp(
                    detailMenu?.data?._id,
                    detailMenu?.data?.isShowCustomerApp,
                    detailMenu?.index
                  )
                }
              />
              <span className="slider round"></span>
            </label>
          </div>
                    {/* แสดงให้ลูกค้า (เว็บ) */}
          <div className="menuSttingShow">
            <label>{t("show_to_web")}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={detailMenu?.data?.isShowCustomerWeb === "true"}
                disabled={isAnyLoading}
                onChange={() =>
                  _handOpenMenu(
                    detailMenu?.data?._id,
                    detailMenu?.data?.isShowCustomerWeb,
                    detailMenu?.index
                  )
                }
              />
              <span className="slider round"></span>
            </label>
          </div>
                    {/* แสดงให้พนักงาน */}
          <div className="menuSttingShow">
            <label>{t("show_to_staff")}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={detailMenu?.data?.isShowStaffApp === "true"}
                disabled={isAnyLoading}
                onChange={() =>
                  _handOpenMenuShowStaff(
                    detailMenu?.data?._id,
                    detailMenu?.data?.isShowStaffApp,
                    detailMenu?.index
                  )
                }
              />
              <span className="slider round"></span>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isAnyLoading}
          >
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopUpIsOpenMenu;
