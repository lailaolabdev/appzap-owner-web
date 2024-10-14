import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { updateMember } from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import DateTimeComponent from "../DateTimeComponent";

export default function PopUpMemberEdit({
  open,
  onClose,
  memberData,
  onUpdate,
}) {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [point, setPoint] = useState();
  const [bill, setBill] = useState();
  const [note, setNote] = useState();
  const [birthday, setBirthday] = useState();
  const [formData, setFormData] = useState();

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
        icon: "success",
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
      <Modal.Header closeButton>{t("chose_type")} </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Label> {t("member_name")} </Form.Label>
          <Form.Control
            placeholder={t("member_name")}
            value={formData?.name}
            onChange={handleChange}
            name="name"
          />
        </div>
        <div className="mb-3">
          <Form.Label> {t("phonenumber")}</Form.Label>
          <InputGroup>
            <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
            <Form.Control
              placeholder="XXXX-XXXX"
              aria-describedby="phone-addon1"
              maxLength={8}
              value={formData?.phone}
              onChange={handleChange}
              name="phone"
            />
          </InputGroup>
        </div>
        <div className="mb-3">
          <Form.Label> {t("point")}</Form.Label>
          <Form.Control
            placeholder={t("point")}
            value={formData?.point}
            onChange={handleChange}
            name="point"
          />
        </div>
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
