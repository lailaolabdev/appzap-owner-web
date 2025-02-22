import React, { useState } from "react";

const BuyXGetYForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    requiredItems: "",
    freeItems: "",
    buyQuantity: 1,
    getQuantity: 1,
    validFrom: "",
    validUntil: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        requiredItems: formData.requiredItems.split(","),
        freeItems: formData.freeItems.split(","),
        type: "BUY_X_GET_Y",
      }),
    });
    alert("โปรโมชั่นซื้อ 1 แถม 1 ถูกสร้าง!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold">โปรโมชั่นซื้อ 1 แถม 1</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ชื่อโปรโมชั่น"
        className="input"
      />
      <input
        type="text"
        name="requiredItems"
        value={formData.requiredItems}
        onChange={handleChange}
        placeholder="เมนูที่ต้องซื้อ (comma separated)"
        className="input"
      />
      <input
        type="text"
        name="freeItems"
        value={formData.freeItems}
        onChange={handleChange}
        placeholder="ของแถม (comma separated)"
        className="input"
      />
      <input
        type="number"
        name="buyQuantity"
        value={formData.buyQuantity}
        onChange={handleChange}
        placeholder="จำนวนที่ต้องซื้อ"
        className="input"
      />
      <input
        type="number"
        name="getQuantity"
        value={formData.getQuantity}
        onChange={handleChange}
        placeholder="จำนวนที่แถม"
        className="input"
      />
      <input
        type="date"
        name="validFrom"
        value={formData.validFrom}
        onChange={handleChange}
        className="input"
      />
      <input
        type="date"
        name="validUntil"
        value={formData.validUntil}
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="btn">
        บันทึก
      </button>
    </form>
  );
};

export default BuyXGetYForm;
