import React from "react";
import { COLOR_APP } from "../../constants";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function NumberKeyboard({
  totalBill,
  selectInput,
  payType,
  setSelectInput,
  onClickButtonDrawer,
  onClickMember,
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

  const { t } = useTranslation();

  // function
  async function clickButton(text) {
    console.log("object", text);
    if (!setSelectInput) return;

    if (text === "Delete") {
      if (!selectInput) return setSelectInput("");
      if (selectInput.length <= 0) return setSelectInput("");
      const _prev = selectInput || "";
      const _text = _prev.substr(0, _prev.length - 1);
      setSelectInput(_text);
    } else {
      const _text = (selectInput || "") + text;
      setSelectInput(_text);
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
          <Button
            onClick={() => {
              onClickMember();
            }}
          >
            {t("member")}
          </Button>
          <Button
            disabled={payType != "cash"}
            onClick={() => {
              // console.log(totalBill);
              setSelectInput(totalBill + "");
            }}
          >
            {t("quantity_full")}
          </Button>
          <Button onClick={onClickButtonDrawer}>{t("Drawer")}</Button>
          <Button
            onClick={() => setSelectInput("")}
            disabled={payType === "transfer"}
          >
            {t("delete_all")}
          </Button>
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
                disabled={payType === "transfer"}
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
