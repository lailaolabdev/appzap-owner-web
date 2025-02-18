import React from "react";
import { COLOR_APP } from "../../constants";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function NumberKeyboard({
  totalBill,
  selectInput,
  payType,
  setSelectInput,
  selectedTable,
  onClickButtonDrawer,
  setCanCheckOut,
  onClickMember,
}) {
  const { storeDetail } = useStoreStore();

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
    <div className="flex-1">
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
        style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          gap: 10,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1,1fr)",
            gap: 10,
            gridAutoRows: "1fr",
            height: 240,
          }}
        >
          <Button
            disabled={payType === "point" || payType === "cash_transfer_point"}
            onClick={() => {
              onClickMember();
            }}
          >
            {t("member")}
          </Button>
          <Button
            disabled={
              selectedTable !== "undefined"
                ? selectedTable ||
                  (payType !== "cash" && payType !== "delivery")
                : payType !== "cash" && payType !== "delivery"
            }
            onClick={() => {
              // console.log(totalBill);
              setSelectInput(`${totalBill}`);
            }}
          >
            {t("quantity_full")}
          </Button>
          <Button onClick={onClickButtonDrawer}>{t("Drawer")}</Button>
          <Button
            onClick={() => {
              setSelectInput("");
              setCanCheckOut(false);
            }}
            disabled={
              selectedTable !== "undefined"
                ? selectedTable || payType === "transfer"
                : payType === "transfer"
            }
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
            height: 240,
          }}
        >
          {_num?.map((e, i) => {
            return (
              <Button
                key={i}
                onClick={() => {
                  clickButton(e.key);
                }}
                disabled={
                  selectedTable !== "undefined"
                    ? selectedTable || payType === "transfer"
                    : payType === "transfer"
                }
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
