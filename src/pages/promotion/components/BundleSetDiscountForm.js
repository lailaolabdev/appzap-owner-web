import React, { useState } from "react";

const BundleSetDiscountForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    requiredItems: "",
    discountValue: 0,
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
        type: "BUNDLE_MENU",
      }),
    });
    alert("โปรโมชั่นเซ็ตเมนูถูกสร้าง!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold">โปรโมชั่นเซ็ตเมนู</h2>
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
        placeholder="รายการเมนู (comma separated)"
        className="input"
      />
      <input
        type="number"
        name="discountValue"
        value={formData.discountValue}
        onChange={handleChange}
        placeholder="มูลค่าส่วนลด"
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

export default BundleSetDiscountForm;
