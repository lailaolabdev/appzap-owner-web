import React, { useEffect } from "react";
import { useStore } from "../../../store";
import { run as runHolder } from "holderjs/holder";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GoContainer } from "react-icons/go";
import { COLOR_APP } from "../../../constants";

//
import { Button, Form, Image } from "react-bootstrap";

export default function MenuItemThemeTool() {
  const { menuItemSet } = useStore();
  useEffect(() => {
    runHolder("image-class-name");
  });
  return (
    <div>
      <Form.Check
        id="test"
        type="switch"
        label="ເປີດການໃຊ້ງານ"
        className="mb-2"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          padding: "10px 0",
        }}
      >
        <div
          style={{
            border: `2px solid ${COLOR_APP}`,
            height: 80,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: COLOR_APP,
            fontWeight: "bold",
            flexDirection: "column",
          }}
        >
          <TfiLayoutGrid4Alt />
          ຮູບພາບ
        </div>
        <div
          style={{
            border: `2px solid ${COLOR_APP}`,
            height: 80,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: COLOR_APP,
            fontWeight: "bold",
            flexDirection: "column",
          }}
        >
          <GoContainer />
          ສີ
        </div>
        <div
          style={{
            border: `2px solid ${COLOR_APP}`,
            height: 80,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: COLOR_APP,
            fontWeight: "bold",
            flexDirection: "column",
          }}
        >
          ວິດີໂອ
        </div>
      </div>
     
      <div className="mb-2">
        <Image src="holder.js/100px100" rounded />
      </div>
      <Button style={{ width: "100%" }} className="mb-2">
        ອັບໂຫຼດຮູບພາບ
      </Button>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>ຄວາມໂປ່ງແສງ (Opacity)</Form.Label>
        <Form.Control type="number" min={0} max={1} placeholder="opacity 0-1" />
      </Form.Group>
    </div>
  );
}
