import React, { useEffect } from "react";
import { useStore } from "../../../store";
import { run as runHolder } from "holderjs/holder";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GoContainer } from "react-icons/go";
import { COLOR_APP } from "../../../constants";

//
import { Button, Form, Image } from "react-bootstrap";

export default function ColorTool({ open }) {
  const { menuItemSet } = useStore();
  useEffect(() => {
    runHolder("image-class-name");
  });
  return (
    <div style={{ display: open ? "block" : "none" }}>
      <div className="mb-2">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "orange",
              borderRadius: 4,
            }}
          ></div>
          <div>Primary</div>
          <Button variant="outline-primary" size="sm" >ແກ້ໄຂ</Button>
        </div>
      </div>
      <Button style={{ width: "100%" }} className="mb-2">
        ເພີ່ມສີ
      </Button>
    </div>
  );
}
