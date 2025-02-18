import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, Button } from "react-bootstrap";

function PopUpIsOpenMenu({
  showSetting,
  handleClose,
  detailMenu,
  _handOpenMenu,
  _handOpenMenuCounterApp,
  _handOpenMenuCustomerApp,
  _handOpenMenuShowStaff,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <Modal show={showSetting} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>
            {t("define_show_menu")}:{" "}
            <q>{detailMenu && detailMenu?.data?.name}</q>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* แสดงที่เคาน์เตอร์ */}
          <div className="menuSttingShow">
            <label>{t("show_at_counter")}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={detailMenu?.data?.isShowCounterApp === "true"}
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
          <Button variant="secondary" onClick={handleClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopUpIsOpenMenu;
