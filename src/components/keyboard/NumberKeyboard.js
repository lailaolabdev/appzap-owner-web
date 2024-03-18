import React from "react";
import { COLOR_APP } from "../../constants";
import { Button } from "react-bootstrap";

export default function NumberKeyboard({ selectInput, setSelectInput }) {
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
      key: "Delete",
      name: "Delete",
    },
    {
      key: "0",
      name: "0",
    },
    {
      key: "000",
      name: "000",
    },
  ];

  // function
  async function clickButton(text) {
    if (!setSelectInput) return;

    if (text === "Delete") {
      setSelectInput((prev) => {
        if (prev.length <= 0) return "";
        let _text = prev.substr(0, prev.length - 1);
        return _text;
      });
    } else {
      setSelectInput((prev) => {
        let _text = (prev || "") + text;
        return _text;
      });
    }
  }

  return (
    <div>
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 10,
          gridAutoRows: "40px",
          marginBottom: 30,
        }}
      >
        <Button>500</Button>
        <Button>1K</Button>
        <Button>2K</Button>
        <Button>5K</Button>
        <Button>10K</Button>
        <Button>20K</Button>
        <Button>50K</Button>
        <Button>100K</Button>
      </div> */}
      <div
        style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1,1fr)",
            gap: 10,
            gridAutoRows: "1fr",
            height: 250,
          }}
        >
          <Button>ສະມາຊິກ</Button>
          <Button>ເຕັມຈຳນວນ</Button>
          <Button>Drawer</Button>
          <Button>ລົບທັງໝົດ</Button>
        </div>
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
              >
                {e.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
