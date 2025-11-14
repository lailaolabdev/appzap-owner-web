import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { updateMember } from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import DateTimeComponent from "../DateTimeComponent";
import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpMemberEdit({
  open,
  onClose,
  memberData,
  onUpdate,
}) {
  const [birthday, setBirthday] = useState();
  const [formData, setFormData] = useState();

  const { storeDetail } = useStoreStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (memberData) {
      const presetDrinks = ["ລາເຕຮ້ອນ", "ລາເຕເຢັນ", "ອາເມຣິກາໂນ", "ກາປູຊີໂນ", "ຊານົມໄທ", "ຊາຂຽວ", "ຊາມະນາວ", "ສມູດຕີ", "ນ້ຳສົ້ມ/ນ້ຳແຕງໂມໃໝ່", "Soda", ""];
      const presetFoods = ["ເຂົ້າຜັດ", "ຜັດໄທ", "ກະເພາ", "ເຝີ", "ສະປາກັດຕີ", "ສະເຕັກ", "ຕ້ຳ/ຍຳ", ""];
      
      const updatedData = { ...memberData };
      
      // Check if favorite drink is a custom value (not in preset list)
      if (memberData.favoriteDrink && !presetDrinks.includes(memberData.favoriteDrink)) {
        updatedData.favoriteDrinkSelect = "Other";
      }
      
      // Check if favorite food is a custom value (not in preset list)
      if (memberData.favoriteFood && !presetFoods.includes(memberData.favoriteFood)) {
        updatedData.favoriteFoodSelect = "Other";
      }
      
      setFormData(updatedData);
    }
  }, [memberData]);

  // console.log("birthdary", birthday);

  // console.log("memberData", memberData);

  const handleSave = async () => {
    try {
      const { TOKEN } = await getLocalData(); // Assuming you have this function to get the token
      // const updatedData = {
      //   name,
      //   phone,
      //   point,
      //   bill,
      //   note,
      //   birthday: formData,
      // };
      const finalData = { ...formData, ...birthday };

      // console.log("finalData", finalData);

      const response = await updateMember(memberData._id, finalData, TOKEN);

      if (response.error) throw new Error("Cannot update member");
      onUpdate();
      onClose();
      await Swal.fire({
        icon: "success",
        title: `${t("updated")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: `${t("not_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      console.error(error);
      // Handle error (show notification, etc.)
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // console.log("formData", formData);

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t("edit_member")}</Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <div className="mb-3">
          <Form.Label>{t("member_name")}</Form.Label>
          <Form.Control
            placeholder={t("member_name")}
            value={formData?.name}
            onChange={handleChange}
            name="name"
          />
        </div>
        {storeDetail?.isStatusCafe && (
          <div className="mb-3">
            <Form.Label>{t("percenDiscount")}</Form.Label>
            <Form.Control
              placeholder={t("percenDiscount")}
              value={formData?.discountPercentage}
              onChange={handleChange}
              name="discountPercentage"
            />
          </div>
        )}
        <div className="mb-3">
          <Form.Label>{t("tel")} (Whatapps, Wechat)</Form.Label>
          <InputGroup>
            {/* <InputGroup.Text id="phone-addon1">020</InputGroup.Text> */}
            <Form.Control
              placeholder="XXXX-XXXX"
              aria-describedby="phone-addon1"
              maxLength={20}
              value={formData?.phone}
              onChange={handleChange}
              name="phone"
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
              // maxLength={20}
              value={formData?.email}
              onChange={handleChange}
              name="email"
            />
          </InputGroup>
        </div>
        <div className="mb-3">
          <Form.Label>ກິດຈະກໍາທີ່ມັກ (Activity you like)*</Form.Label>
          <Form.Control
            as="select"
            value={formData?.activity}
            onChange={handleChange}
            name="activity"
          >
            <option value="">-- {t("select")} --</option>
            <option value="ບາງລະຕອນ">ບາງລະຕອນ (Walking/Running)</option>
            <option value="ເຕະບານ">ເຕະບານ (Football)</option>
            <option value="ຕີຫວດ">ຕີຫວດ (Badminton)</option>
            <option value="ລອນນ້ຳ">ລອນນ້ຳ (Swimming)</option>
            <option value="ຂີ່ຈັກຍານ">ຂີ່ຈັກຍານ (Cycling)</option>
            <option value="ໂຍຄະ/ນັ່ງສະມາທິ">ໂຍຄະ/ນັ່ງສະມາທິ (Yoga/Meditation)</option>
            <option value="ອ່ານຫນັງສື">ອ່ານຫນັງສື (Reading)</option>
            <option value="ເພງ/ຄອນເສີດ">ເພງ/ຄອນເສີດ (Music/Concerts)</option>
            <option value="ປຸງອາຫານ/ເຂັ້າເຕົ້າ">ປຸງອາຫານ/ເຂັ້າເຕົ້າ (Cooking/Baking)</option>
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
            <option value="Soda">Soda — (ໂຊດາ)</option>
            <option value="Other">Other</option>
          </Form.Control>
        </div>
        {formData?.favoriteDrinkSelect === "Other" && (
          <div className="mb-3">
            <Form.Control
              placeholder={t("please_specify")}
              value={formData?.favoriteDrink}
              onChange={handleChange}
              name="favoriteDrink"
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
            <option value="ກະເພາ">ກະເພາ (Stir-fried Basil (Kaprao))</option>
            <option value="ເຝີ">ເຝີ (Pho)</option>
            <option value="ສະປາກັດຕີ">ສະປາກັດຕີ (Spaghetti)</option>
            <option value="ສະເຕັກ">ສະເຕັກ (Steak)</option>
            <option value="ຕ້ຳ/ຍຳ">ຕ້ຳ/ຍຳ (Salad)</option>
            <option value="Other">Other</option>
          </Form.Control>
        </div>
        {formData?.favoriteFoodSelect === "Other" && (
          <div className="mb-3">
            <Form.Control
              placeholder={t("please_specify")}
              value={formData?.favoriteFood}
              onChange={handleChange}
              name="favoriteFood"
            />
          </div>
        )}
        <div className="mb-3">
          <Form.Label>ພ໋ອຍສະສົມ</Form.Label>
          <Form.Control
            placeholder="ພ໋ອຍສະສົມ"
            value={formData?.point}
            onChange={handleChange}
            name="point"
          />
        </div>

        {!storeDetail?.isStatusCafe && (
          <div className="mb-3">
            <Form.Label>{t("expirt_point")}</Form.Label>
            <Form.Control
              type="date"
              value={
                formData?.pointDateExpirt
                  ? moment(formData?.pointDateExpirt).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              name="pointDateExpirt"
            />
          </div>
        )}
        <div className="mb-3">
          <Form.Label>{t("birth_date")}</Form.Label>
          <DateTimeComponent
            value={formData?.birthday}
            name="birthday"
            onChange={(birthday) => {
              setBirthday((prev) => ({
                ...prev,
                birthday: birthday,
              }));
            }}
          />
        </div>
        <div className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            placeholder={`${t("note")}`}
            value={formData?.note}
            onChange={handleChange}
            name="note"
          />
        </div>
        {/* <div className="mb-3">
          <Form.Label>ໃຊ້ບໍລິການ</Form.Label>
          <Form.Control
            placeholder="ໃຊ້ບໍລິການ"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />
        </div> */}
        {/* `<div className="mb-3">
          <Form.Label>ວັນ/ເດືອນ/ປີ ເກີດ</Form.Label>
          <Form.Control
            type="text"
            value={moment(createdAt).format("DD/MM/YYYY")}
            // disabled
          />
        </div>` */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t("close")}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {t("update_member")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
