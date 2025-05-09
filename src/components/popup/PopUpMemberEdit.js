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
      setFormData(memberData);
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
      <Modal.Header closeButton>{t("select_category")}</Modal.Header>
      <Modal.Body>
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
          <Form.Label>{t("tel")}</Form.Label>
          <InputGroup>
            <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
            <Form.Control
              placeholder="XXXX-XXXX"
              aria-describedby="phone-addon1"
              maxLength={15}
              value={formData?.phone}
              onChange={handleChange}
              name="phone"
            />
          </InputGroup>
        </div>
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
