import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { updateMember } from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

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
  const [createdAt, setCreatedAt] = useState();

  const { t } = useTranslation();

  useEffect(() => {
    if (memberData) {
      setName(memberData.name);
      setPhone(memberData.phone);
      setPoint(memberData.point);
      setBill(memberData.bill);
      setNote(memberData.note);
      setCreatedAt(memberData.createdAt);
    }
  }, [memberData]);

  console.log("memberData", memberData);

  const handleSave = async () => {
    try {
      const { TOKEN } = await getLocalData(); // Assuming you have this function to get the token
      const updatedData = {
        name,
        phone,
        point,
        bill,
        note,
      };

      const response = await updateMember(memberData._id, updatedData, TOKEN);

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

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ເລືອກໝວດໝູ່</Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Label>ຊື່ສະມາຊິກ</Form.Label>
          <Form.Control
            placeholder="ຊື່ສະມາຊິກ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Label>ເບີໂທ</Form.Label>
          <InputGroup>
            <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
            <Form.Control
              placeholder="XXXX-XXXX"
              aria-describedby="phone-addon1"
              maxLength={8}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="mb-3">
          <Form.Label>ຄະແນນສະສົມ</Form.Label>
          <Form.Control
            placeholder="ຄະແນນສະສົມ"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            placeholder={`${t("note")}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
          ປິດ
        </Button>
        <Button variant="primary" onClick={handleSave}>
          ອັບເດດສະມາຊີກ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
