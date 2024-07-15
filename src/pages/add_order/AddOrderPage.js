import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";

import { GoDash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store";
import { moneyCurrency } from "../../helpers";
import { useTranslation } from "react-i18next";

export default function AddOrderPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { codeId } = useParams();
  // state
  const [selectCategory, setSelectCategory] = useState();
  const [selectMenu, setSelectMenu] = useState();

  const { storeDetail } = useStore();

  // provider
  const { menuCategorys, menus, staffCart, setStaffCart } = useStore();
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        maxHeight: "100%",
        flexDirection: "column",
      }}
    >
      <NavContainer
        codeId={codeId}
        onBack={() => navigate(`/staff/tableDetail/${codeId}`)}
      />

      <div style={{ display: "flex", overflow: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 100,
            minWidth: 100,
            boxShadow: "4px 0px 2px -2px rgba(0,0,0,0.2)",
            height: "100%",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: 10,
              background: !selectCategory ? COLOR_APP : "none",
              boxShadow: "0px 2px 2px -2px rgba(0,0,0,0.2)",
            }}
            onClick={() => setSelectCategory()}
          >
            ALL
          </div>
          {menuCategorys?.map((e) => (
            <div
              style={{
                width: "100%",
                padding: 10,
                background: selectCategory == e?._id ? COLOR_APP : "none",
                boxShadow: "0px 2px 2px -2px rgba(0,0,0,0.2)",
              }}
              onClick={() => setSelectCategory(e?._id)}
            >
              {e?.name}
            </div>
          ))}
        </div>
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              backgroudColor: "pink",
              padding: 4,
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
              gridGap: 2,
              width: "100%",
              maxWidth: "100%",
              overflowY: "auto",
              fontSize: 12,
            }}
          >
            {menus
              ?.filter((e) => {
                if (selectCategory) {
                  if (selectCategory == e?.categoryId?._id) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              })
              ?.map((e) => (
                <div
                  style={{
                    border: `1px solid #F2E3DB`,
                    backgroundColor: "#F2E3DB",
                    borderRadius: 4,
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    height: 110,
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    setSelectMenu({ ...e, quantity: 1 });
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(246 180 156)",
                      width: "100%",
                      height: 70,
                    }}
                  >
                    {e?.images?.[0] && (
                      <img
                        src={URL_PHOTO_AW3 + e?.images?.[0]}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div>{e?.name}</div>
                  <div>
                    {moneyCurrency(e?.price)}
                    {storeDetail?.firstCurrency}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {selectMenu && (
        <div style={{ paddingBottom: 30 }}>
          <div
            style={{
              boxShadow: "0 -4px 2px -2px rgba(0,0,0,0.2)",
              padding: 10,
              // border: `5px solid ${COLOR_APP}`,
              // borderLeft: 0,
              // borderRight: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div>{selectMenu?.name}</div>
                <div>{selectMenu?.price}</div>
              </div>
              <div>
                <Button onClick={() => setSelectMenu()}>
                  <MdOutlineClose />
                </Button>
              </div>
            </div>
            <Form.Control
              type="text"
              placeholder={t('ask_chef')}
              value={selectMenu?.note}
              onChange={(e) =>
                setSelectMenu((prev) => ({ ...prev, note: e.target.value }))
              }
            />
          </div>
          <div
            style={{
              width: "100%",
              padding: 10,
              // boxShadow: "0 -4px 2px -2px rgba(0,0,0,0.2)",
              borderTop: "1px",
              borderColor: "rgba(0,0,0,0.2)",
              display: "flex",
              gap: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() =>
                  setSelectMenu((e) => {
                    if (e.quantity - 1 <= 0) {
                      return undefined;
                    }
                    return { ...e, quantity: e.quantity - 1 };
                  })
                }
              >
                <GoDash />
              </Button>
              <div>{selectMenu.quantity}</div>
              <Button
                onClick={() =>
                  setSelectMenu((e) => {
                    return { ...e, quantity: e.quantity + 1 };
                  })
                }
              >
                <FiPlus />
              </Button>
            </div>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                setStaffCart((prev) => [...prev, selectMenu]);
                setSelectMenu();
              }}
            >
              {t('add_to_cart')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
const NavContainer = ({ onBack, codeId, setPopup }) => {
  const { menuCategorys, menus, staffCart } = useStore();
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        padding: 10,
        boxShadow: "0 4px 2px -2px rgba(0,0,0,0.2)",
        borderBottom: "1px",
        borderColor: "rgba(0,0,0,0.2)",
        display: "flex",
      }}
    >
      <Button
        variant="outlined"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#909090",
        }}
        onClick={onBack}
      >
        <BsFillCaretLeftFill style={{ fontSize: "22px" }} />
      </Button>
      {/* <div style={{ fontWeight: "bold" }}>{codeData?.tableName}</div> */}
      <div style={{ flex: 1 }} />
      <Button
        variant="outlined"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#909090",
          position: "relative",
        }}
        onClick={() => navigate(`/staff/cart/${codeId}`, { replace: true })}
      //   onClick={getQrTokenForSelfOrdering}
      >
        <FaShoppingCart style={{ fontSize: "22px" }} />
        {staffCart?.length > 0 ? (
          <div
            style={{
              backgroundColor: COLOR_APP,
              padding: "1px 10px",
              borderRadius: 8,
              fontSize: 10,
              color: "#fff",
              position: "absolute",
              top: 0,
              right: "-20%",
              fontWeight: "bold",
            }}
          >
            {staffCart?.length}
          </div>
        ) : (
          ""
        )}
      </Button>
    </div>
  );
};
