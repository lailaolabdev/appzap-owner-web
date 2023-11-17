import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";

export default function PopUpEditTax({ open, onClose,onSubmit,prevTax }) {
  // state
  const [tax, setTax] = useState(0);

  // useEffect
useEffect(()=>{
  setTax(prevTax)
},[prevTax])
  // functions


  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        ແກ້ໄຂພາສີ
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Form.Control type="number" value={tax} onChange={(e)=>setTax(e.target.value)}/>
       
      </Modal.Body>
      <Modal.Footer>
      <Button onClick={()=>onSubmit(tax)}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
