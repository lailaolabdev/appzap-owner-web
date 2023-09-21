import React, { useEffect } from "react";
import { useStore } from "../../../store";
import { run as runHolder } from "holderjs/holder";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GoContainer } from "react-icons/go";
import { COLOR_APP } from "../../../constants";

//
import { Button, Form, Image } from "react-bootstrap";

export default function ColorTool({ open }) {
  const { menuItemSet, themeColors } = useStore();
  useEffect(() => {
    runHolder("image-class-name");
  });
  return (
    <div style={{ display: open ? "block" : "none" }}>
      {themeColors?.map((e) => (
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
                backgroundColor: e?.color,
                borderRadius: 4,
              }}
            ></div>
            <div>{e?.name}</div>
            <Button variant="outline-primary" size="sm">
              ແກ້ໄຂ
            </Button>
          </div>
        </div>
      ))}
      <Button style={{ width: "100%" }} className="mb-2">
        ເພີ່ມສີ
      </Button>
    </div>
  );
}
