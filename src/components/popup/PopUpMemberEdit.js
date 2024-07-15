import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { updateMember } from "../../services/member.service";
import { getLocalData } from "../../constants/api";

export default function PopUpMemberEdit({
  open,
  onClose,
  memberData,
  onUpdate
}) {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [point, setPoint] = useState();
  const [bill, setBill] = useState();
  const [createdAt, setCreatedAt] = useState();

  useEffect(() => {
    if (memberData) {
      setName(memberData.name);
      setPhone(memberData.phone);
      setPoint(memberData.point);
      setBill(memberData.bill);
      setCreatedAt(memberData.createdAt);
    }
  }, [memberData]);

  const handleSave = async () => {
    try {
      const { TOKEN } = await getLocalData(); // Assuming you have this function to get the token
      const updatedData = {
        name,
        phone,
        point,
        bill
      };

      const response = await updateMember(memberData._id, updatedData, TOKEN);
      if (response.error) throw new Error("Cannot update member");
      onUpdate();
      onClose();
    } catch (error) {
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
