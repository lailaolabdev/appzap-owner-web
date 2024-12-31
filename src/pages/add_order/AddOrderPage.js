import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsFillCaretLeftFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";

import { GoDash } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { BsBagPlus, BsBox, BsXCircle } from "react-icons/bs";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store";
import { moneyCurrency } from "../../helpers";
import { useTranslation } from "react-i18next";
import PopUpOption from "../cart/component/PopUpOption";
import { t } from "i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function AddOrderPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { codeId } = useParams();
  const [popup, setPopup] = useState();
  const [selectCategory, setSelectCategory] = useState();
  const [selectMenu, setSelectMenu] = useState();
  const [searchMenu, setSearchMenu] = useState("");

  // Provider state for menu categories, menus, and cart
  const { menuCategorys, menus, staffCart, setStaffCart } =
    useStore();

  const { storeDetail } = useStoreStore()

  // Handler to add customized orders to the cart
  const handleAddToCart = (order) => {
    setStaffCart((prevCart) => [...prevCart, order]);
    setSelectMenu(); // Clear the selected menu
    setPopup(); // Close the popup
  };

  const filteredMenus = menus?.filter((menu) => {
    const matchesCategory = selectCategory
      ? menu?.categoryId?._id === selectCategory
      : true;
    const matchesSearch = searchMenu
      ? menu?.name?.toLowerCase().includes(searchMenu.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          maxHeight: "100%",
          flexDirection: "column",
        }}
      >
        {/* Navigation */}
        <NavContainer
          codeId={codeId}
          onBack={() => navigate(`/staff/tableDetail/${codeId}`)}
          setSearchMenu={setSearchMenu}
        />

        {/* Category List */}
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
                background: !selectCategory ? "#FFA500" : "none",
                boxShadow: "0px 2px 2px -2px rgba(0,0,0,0.2)",
              }}
              onClick={() => setSelectCategory()}
            >
              ALL
            </div>
            {menuCategorys?.map((e) => (
              <div
                key={e?._id}
                style={{
                  width: "100%",
                  padding: 10,
                  background: selectCategory === e?._id ? "#FFA500" : "none",
                  boxShadow: "0px 2px 2px -2px rgba(0,0,0,0.2)",
                }}
                onClick={() => setSelectCategory(e?._id)}
              >
                {e?.name}
              </div>
            ))}
          </div>

          {/* Menu List */}
          <div style={{ height: "100%", overflow: "auto" }}>
            <div
              style={{
                backgroundColor: "pink",
                padding: 4,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 2,
                fontSize: 12,
              }}
            >
              {filteredMenus?.map((e) => (
                <div
                  key={e?._id}
                  style={{
                    border: `1px solid #F2E3DB`,
                    backgroundColor: "#F2E3DB",
                    borderRadius: 4,
                    height: 110,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectMenu({ ...e, quantity: 1 })}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(246 180 156)",
                      height: 70,
                    }}
                  >
                    {e?.images?.[0] && (
                      <img
                        src={`${URL_PHOTO_AW3}${e?.images?.[0]}`}
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

        {/* Selected Menu Section */}
        {selectMenu && (
          <div style={{ paddingBottom: 30 }}>
            <div
              style={{
                boxShadow: "0 -4px 2px -2px rgba(0,0,0,0.2)",
                padding: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div>{selectMenu?.name}</div>
                  <div>{moneyCurrency(selectMenu?.price)}</div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {selectMenu?.menuOptions?.length > 0 && (
                    <Button onClick={() => setPopup({ popUpOption: true })}>
                      <BsBox />
                    </Button>
                  )}
                  <Button onClick={() => setSelectMenu()}>
                    <BsXCircle />
                  </Button>
                </div>
              </div>
              <Form.Control
                type="text"
                placeholder={t("ask_chef")}
                value={selectMenu?.note}
                onChange={(e) =>
                  setSelectMenu((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </div>

            {/* Quantity Controls and Add to Cart Button */}
            <div
              style={{
                display: "flex",
                gap: 40,
                padding: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() =>
                    setSelectMenu((e) =>
                      e.quantity > 1
                        ? { ...e, quantity: e.quantity - 1 }
                        : undefined
                    )
                  }
                >
                  <GoDash />
                </Button>
                <div>{selectMenu.quantity}</div>
                <Button
                  onClick={() =>
                    setSelectMenu((e) => ({ ...e, quantity: e.quantity + 1 }))
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
                {t("add_to_cart")}
              </Button>
            </div>
          </div>
        )}

        {/* PopUpOption Component */}
        <PopUpOption
          open={popup?.popUpOption}
          onClose={() => setPopup()}
          data={selectMenu}
          onAddToCart={handleAddToCart} // Pass handler to PopUpOption
        />
      </div>
    </>
  );
}

const NavContainer = ({ onBack, codeId, searchMenu, setSearchMenu }) => {
  const { staffCart } = useStore();
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
        alignItems: "center",
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

      <div style={{ flex: 1 }} />

      <Form.Control
        type="text"
        value={searchMenu}
        onChange={(e) => setSearchMenu(e.target.value)}
        placeholder={t("search_food_name")}
        style={{
          flex: 1,
          minWidth: "200px",
          maxWidth: "300px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "8px",
          margin: "0 10px",
        }}
      />

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
      >
        <FaShoppingCart style={{ fontSize: "22px" }} />
        {staffCart?.length > 0 ? (
          <div
            style={{
              backgroundColor: "#FF6347",
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
        ) : null}
      </Button>
    </div>
  );
};
