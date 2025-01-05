import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { t } from "i18next";
import { moneyCurrency } from "../../../helpers";

import { useStoreStore } from "../../../zustand/storeStore";
import { useMenuStore } from "../../../zustand/menuStore";

export default function PopUpOption({ open, onClose, data, onAddToCart }) {
  const [quantities, setQuantities] = useState({});
  const { staffCart, setStaffCart } = useMenuStore();
  const { storeDetail } = useStoreStore()
  const [globalNote, setGlobalNote] = useState("");

  // Default fallback for missing data
  const defaultData = {
    name: "No Name Provided",
    price: 0,
    currency: "N/A",
    menuOptions: [],
  };

  const menuData = data || defaultData;

  const handleQuantityChange = (optionId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [optionId]: Math.max(0, (prev[optionId] || 0) + change),
    }));
  };

  // Calculate the total price
  const calculateTotal = () => {
    const optionTotal = menuData.menuOptions.reduce(
      (total, option) => total + (quantities[option._id] || 0) * option.price,
      0
    );
    return menuData.price + optionTotal;
  };

  const handleAddToCart = () => {
    const selectedOptions = menuData.menuOptions
      .filter((option) => (quantities[option._id] || 0) > 0)
      .map((option) => ({
        _id: option._id,
        name: option.name,
        price: option.price,
        quantity: quantities[option._id],
      }));

    const newOrder = {
      _id: menuData._id,
      name: menuData.name,
      quantity: menuData?.quantity,
      price: menuData.price,
      categoryId: menuData?.categoryId,
      printer: menuData?.categoryId?.printer,
      note: globalNote.trim(), // Add global note
      menuOptions: menuData?.menuOptions,
      options: selectedOptions,
      totalOptionPrice: calculateTotal(),
    };

    setStaffCart((prevCart) => [...prevCart, newOrder]);
    setQuantities({}); // Clear the quantities for all options
    setGlobalNote(""); // Clear the global note field
    onClose();
  };

  return (
    <Modal
      show={open}
      onHide={onClose}
      keyboard={false}
      centered
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal.Header
        closeButton
        style={{ textAlign: "center", padding: "15px" }}
      >
        <Modal.Title
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            textAlign: "start",
          }}
        >
          {menuData.name} ({menuData.price.toLocaleString()} {menuData.currency}
          )
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          fontSize: "1rem",
        }}
      >
        <div style={{ fontWeight: "bold", textAlign: "start" }}>
          <div>
            {menuData.menuOptions.length > 0
              ? menuData.menuOptions.map((option) => (
                  <div
                    key={option._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      backgroundColor:
                        (quantities[option._id] || 0) > 0
                          ? "#F9B5A6" // Highlight when quantity > 0
                          : "#f9f9f9",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    {/* Option Details */}
                    <div style={{ fontWeight: "bold" }}>
                      {option.name} - {moneyCurrency(option.price)}{" "}
                      {storeDetail.firstCurrency}
                    </div>

                    {/* Quantity Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "#fff",
                          fontSize: "1.2rem",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => handleQuantityChange(option._id, -1)}
                      >
                        -
                      </button>
                      <div style={{ fontSize: "1.2rem" }}>
                        {quantities[option._id] || 0}
                      </div>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "#fff",
                          fontSize: "1.2rem",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => handleQuantityChange(option._id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              : "No options available"}
          </div>
        </div>

        {/* Selected Options Display */}
        <div style={{ marginTop: "10px", fontWeight: "bold", color: "#555" }}>
          {t("menu_option")}:
          <div>
            {menuData.menuOptions
              .filter((option) => (quantities[option._id] || 0) > 0)
              .map((option) => (
                <span
                  key={option._id}
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#ffecd1",
                    borderRadius: "4px",
                  }}
                >
                  {option.name} [{quantities[option._id]}]
                </span>
              ))}
          </div>
        </div>

        {/* Total Price */}
        <div
          style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "20px" }}
        >
          {t("total")}: {moneyCurrency(calculateTotal())}{" "}
          {storeDetail.firstCurrency}
        </div>
        <textarea
          placeholder="ປ້ອນຄຳອະທິບາຍ..."
          value={globalNote}
          onChange={(e) => setGlobalNote(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            resize: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "15px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#F56342",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleAddToCart}
          >
            {t("add_to_cart")}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
