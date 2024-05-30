import React from "react";
import { COLOR_APP } from "../../constants";
import { Button } from "react-bootstrap";

export default function PinKeyboard({
  totalBill,
  selectInput,
  setSelectInput,
  disabled,
}) {
  const _num = [
    {
      key: "1",
      name: "1",
    },
    {
      key: "2",
      name: "2",
    },
    {
      key: "3",
      name: "3",
    },
    {
      key: "4",
      name: "4",
    },
    {
      key: "5",
      name: "5",
    },
    {
      key: "6",
      name: "6",
    },
    {
      key: "7",
      name: "7",
    },
    {
      key: "8",
      name: "8",
    },
    {
      key: "9",
      name: "9",
    },
    {
      key: "",
      name: "",
    },
    {
      key: "0",
      name: "0",
    },
    {
      key: "Delete",
      name: "Delete",
    },
  ];

  // function
  async function clickButton(text) {
    console.log("object", text);
    if (!setSelectInput) return;

    if (text === "Delete") {
      if (!selectInput) return setSelectInput("");
      if (selectInput.length <= 0) return setSelectInput("");
      let _prev = selectInput || "";
      let _text = _prev.substr(0, _prev.length - 1);
      setSelectInput(_text);
    } else {
      if (selectInput.length >= 6) return;
      let _text = (selectInput || "") + text;
      setSelectInput(_text);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          gridAutoRows: "1fr",
          height: 250,
        }}
      >
        {_num?.map((e, i) => {
          return (
            <Button
              key={i}
              onClick={() => {
                clickButton(e.key);
              }}
              disabled={disabled}
            >
              {e.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
