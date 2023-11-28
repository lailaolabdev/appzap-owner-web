import React, { useEffect } from "react";
import { useStore } from "../../../store";
import { run as runHolder } from "holderjs/holder";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GoContainer } from "react-icons/go";
import { COLOR_APP } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPaste,
  faQrcode,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";

//
import { Button, Form, Image, Card, InputGroup } from "react-bootstrap";
import PopUpIconsFontawesome from "../../../components/popup/PopUpIconsFontawesome";

export default function BottomBarTool({ handleChangeIcon, open }) {
  const { menuItemSet, themeColors } = useStore();
  useEffect(() => {
    runHolder("image-class-name");
  });
  return (
    <div style={{ display: open ? "block" : "none" }}>
      <Card
        border="primary"
        style={{
          width: "100%",
          display: "flex",
          marginBottom: 10,
        }}
      >
        <input type="color" id="head" name="head" value="#e66465" />
        <div>ສີພື້ນຫຼັງ</div>
        <input type="color" id="head" name="head" value="#e66465" />
        <div>ສີຟ້ອນ</div>

      </Card>
      {[
        {
          icon: faHome,
          title: "home",
        },
        {
          icon: faPaste,
          title: "sdfdfdf",
        },
        {
          icon: faQrcode,
          title: "sdfdfdf",
        },
        {
          icon: faCartPlus,
          title: "sdfdfdf",
        },
      ].map((e) => (
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <Button
            onClick={handleChangeIcon}
            style={{ width: 50, overflow: "hidden" }}
          >
            <FontAwesomeIcon icon={e.icon} />
          </Button>
          <Card
            border="primary"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {e?.title}
          </Card>
        </div>
      ))}
      <Button style={{ width: "100%" }} className="mb-2">
        ບັນທຶກການແກ້ໄຂ
      </Button>
    </div>
  );
}
