import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button, InputGroup, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { addMember } from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { useStoreStore } from "../../zustand/storeStore";
import PopUpOpenShift from "../../components/popup/PopUpOpenShift";

export default function ShiftOpenPages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState();
  const [openPopUpShift, setOpenPopUpShift] = useState(false);

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

  useEffect(() => {
    setOpenPopUpShift(true);
  }, []);

  // function
  const createMember = async () => {
    try {
      if (disabledButton) return;
      setDisabledButton(true);
      const { TOKEN } = await getLocalData();
      const _data = await addMember(formData, TOKEN);
      if (_data.error) throw new Error("can not create member");
      successAdd("ເພີ່ມສະມາຊີກສຳເລັດ");
      navigate("/tables", { state: { key: "table" } });
    } catch (err) {
      errorAdd(`${t("add_fail")}`);
      setDisabledButton(false);
      console.error(err);
    }
  };

  return (
    <>
      {!openPopUpShift && (
        <div className="p-20 h-full">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card border="primary" style={{ width: 560 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {t("shift")}
              </Card.Header>
              <Card.Body>
                <div>
                  <div className="mb-3">
                    <Form.Label>{t("enter_amount_to_start")}</Form.Label>
                    <Form.Control
                      placeholder="0"
                      value={formData?.name}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      style={{ width: "100%" }}
                      disabled={disabledButton}
                      onClick={createMember}
                    >
                      {t("shift_open")}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      <PopUpOpenShift
        open={openPopUpShift}
        setOpenPopUpShift={setOpenPopUpShift}
      />
    </>
  );
}
