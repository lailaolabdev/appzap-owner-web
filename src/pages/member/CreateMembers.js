import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button, InputGroup, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import {
  addMember,
  // getMemberCount,
  // getMembers,
} from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import DateTimeComponent from "../../components/DateTimeComponent";
import { useTranslation } from "react-i18next";
import { errorAdd, successAdd } from "../../helpers/sweetalert";

import { useStoreStore } from "../../zustand/storeStore";

export default function CreateMembers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState();
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

  // function
  const createMember = async () => {
    try {
      if (disabledButton) return;
      setDisabledButton(true);
      const { TOKEN } = await getLocalData();
      const _data = await addMember(formData, TOKEN);
      if (_data.error) throw new Error("can not create member");
      successAdd("ເພີ່ມສະມາຊີກສຳເລັດ");
      setStoreDetail({ actions: true });
      const timer = setTimeout(() => {
        // window.location.reload("/table");
        navigate(`/tables`, { state: { key: "table" } });
        window.close();
      }, 2000);

      return () => clearTimeout(timer);
    } catch (err) {
      errorAdd(`${t("add_fail")}`);
      setDisabledButton(false);
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("add_member")}</Breadcrumb.Item>
        </Breadcrumb>
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
              {t("add_member_form")}
            </Card.Header>
            <Card.Body>
              <div>
                <div className="mb-3">
                  <Form.Label>{t("member_name")}</Form.Label>
                  <Form.Control
                    placeholder={t("member_name")}
                    value={formData?.name}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label>{t("tel")}</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
                    <Form.Control
                      placeholder="XXXX-XXXX"
                      aria-describedby="phone-addon1"
                      maxLength={8}
                      value={formData?.phone}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }));
                      }}
                    />
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <Form.Label>{t("birth_date")}</Form.Label>
                  <DateTimeComponent
                    value={formData?.birthday}
                    onChange={(birthday) => {
                      setFormData((prev) => ({
                        ...prev,
                        birthday: birthday,
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
                    {t("add")}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* popup */}
    </>
  );
}
