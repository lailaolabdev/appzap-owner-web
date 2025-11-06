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
      <div style={{ padding: 20, height: "100vh", overflowY: "auto" }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("add_member")}</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 40 }}>
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
            <Card.Body style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                  <Form.Label>{t("tel")}(Whatapps)</Form.Label>
                  <InputGroup>
                    {/* <InputGroup.Text id="phone-addon1">020</InputGroup.Text> */}
                    <Form.Control
                      placeholder="XXXX-XXXX"
                      aria-describedby="phone-addon1"
                      maxLength={20}
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
                  <Form.Label>{t("email")}</Form.Label>
                  <InputGroup>
                    {/* <InputGroup.Text id="phone-addon1">020</InputGroup.Text> */}
                    <Form.Control
                      placeholder="example@gmail.com"
                      aria-describedby="email-addon1"
                      // maxLength={8}
                      value={formData?.email}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                      }}
                    />
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <Form.Label>ກິດຈະກໍາທີ່ມັກ (Activity you like)*</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData?.activity}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        activity: e.target.value,
                      }));
                    }}
                  >
                    <option value="">-- {t("select")} --</option>
                    <option value="ຍ່າງ/ແລ່ນ">ຍ່າງ/ແລ່ນ (Walking/Running)</option>
                    <option value="ເຕະບານ">ເຕະບານ (Football)</option>
                    <option value="ຕີດອກ">ຕີດອກ (Badminton)</option>
                    <option value="ລອຍນ້ຳ">ລອຍນ້ຳ (Swimming)</option>
                    <option value="ຂີ່ລົດຖີບ">ຂີ່ລົດຖີບ (Cycling)</option>
                    <option value="ໂຍຄະ/ນັ່ງສະມາທິ">ໂຍຄະ/ນັ່ງສະມາທິ (Yoga/Meditation)</option>
                    <option value="ອ່ານຫນັງສື">ອ່ານຫນັງສື (Reading)</option>
                    <option value="ເພງ/ຄອນເສີດ">ເພງ/ຄອນເສີດ (Music/Concerts)</option>
                    <option value="ປຸງອາຫານ/ອົບເຂົ້າໝົມ">ປຸງອາຫານ/ອົບເຂົ້າໝົມ (Cooking/Baking)</option>
                    <option value="ທ່ອງທ່ຽວ">ທ່ອງທ່ຽວ (Traveling)</option>
                  </Form.Control>
                </div>
                <div className="mb-3">
                  <Form.Label>ເຄື່ອງດື່ມປະເພດທີ່ທ່ານມັກ? (what is your favorite drink?)*</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData?.favoriteDrinkSelect || formData?.favoriteDrink}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteDrinkSelect: "Other",
                          favoriteDrink: "",
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteDrinkSelect: e.target.value,
                          favoriteDrink: e.target.value,
                        }));
                      }
                    }}
                  >
                    <option value="">-- {t("select")} --</option>
                    <option value="ລາເຕຮ້ອນ">ລາເຕຮ້ອນ (Hot Latte)</option>
                    <option value="ລາເຕເຢັນ">ລາເຕເຢັນ (Iced Latte)</option>
                    <option value="ອາເມຣິກາໂນ">ອາເມຣິກາໂນ (ຮ້ອນ/ເຢັນ) (Americano (Hot/Iced))</option>
                    <option value="ກາປູຊີໂນ">ກາປູຊີໂນ (Cappuccino)</option>
                    <option value="ຊານົມໄທ">ຊານົມໄທ (Thai Milk Tea)</option>
                    <option value="ຊາຂຽວ">ຊາຂຽວ (Green Tea)</option>
                    <option value="ຊາມະນາວ">ຊາມະນາວ (Lemon Tea)</option>
                    <option value="ສມູດຕີ">ສມູດຕີ (ມ່ວງ/ສະເບີຮີ) - Smoothie (Mango/Strawberry)</option>
                    <option value="ນ້ຳສົ້ມ/ນ້ຳແຕງໂມໃໝ່">ນ້ຳສົ້ມ/ນ້ຳແຕງໂມໃໝ່ (Fresh Juice, Orange/Watermelon)</option>
                    <option value="ໂຊດາ">ໂຊດາ (Soda)</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </div>
                {formData?.favoriteDrinkSelect === "Other" && (
                  <div className="mb-3">
                    <Form.Control
                      placeholder={t("please_specify")}
                      value={formData?.favoriteDrink}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteDrink: e.target.value,
                        }));
                      }}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <Form.Label>ອາຫານປະເພດໃດທີ່ທ່ານມັກ ? (what is your favorite food?)*</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData?.favoriteFoodSelect || formData?.favoriteFood}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteFoodSelect: "Other",
                          favoriteFood: "",
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteFoodSelect: e.target.value,
                          favoriteFood: e.target.value,
                        }));
                      }
                    }}
                  >
                    <option value="">-- {t("select")} --</option>
                    <option value="ເຂົ້າຜັດ">ເຂົ້າຜັດ (Fried Rice)</option>
                    <option value="ຜັດໄທ">ຜັດໄທ (Pad Thai)</option>
                    <option value="ກະເພົາ">ກະເພົາ (Stir-fried Basil (Kaprao))</option>
                    <option value="ເຝີ">ເຝີ (Pho)</option>
                    <option value="ສະປາກັດຕີ">ສະປາກັດຕີ (Spaghetti)</option>
                    <option value="ສະເຕັກ">ສະເຕັກ (Steak)</option>
                    <option value="ຕຳ/ຍຳ">ຕຳ/ຍຳ (Salad)</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </div>
                {formData?.favoriteFoodSelect === "Other" && (
                  <div className="mb-3">
                    <Form.Control
                      placeholder={t("please_specify")}
                      value={formData?.favoriteFood}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          favoriteFood: e.target.value,
                        }));
                      }}
                    />
                  </div>
                )}
                {storeDetail?.isStatusCafe && (
                  <div className="mb-3">
                    <Form.Label>{t("percenDiscount")}</Form.Label>
                    <Form.Control
                      placeholder={t("percenDiscount")}
                      value={formData?.discountPercentage}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          discountPercentage: e.target.value,
                        }));
                      }}
                    />
                  </div>
                )}
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
