import { React, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { updateStock } from "../../../../services/stocks";
import Swal from "sweetalert2";

export default function PopUpEditStock({
  open,
  onClose,
  data,
  stockCategory,
  callback,
}) {
  const { t } = useTranslation();
  const [stockEdit, setStockEdit] = useState({
    name: "",
    buyPrice: 0,
    wastes: 0,
    quantity: 0,
    detail: "",
    stockCategoryId: "",
    unit: "",
  });

  useEffect(() => {
    if (open && data) {
      setStockEdit({
        name: data.name || "",
        buyPrice: data.buyPrice || 0,
        wastes: data.wastes || 0,
        quantity: data.quantity || 0,
        note: data.detail || "",
        stockCategoryId: data.stockCategoryId?._id || "",
        unit: data.unit || "",
      });
    }
  }, [open, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const stockUpdate = async (id, data) => {
    const res = await updateStock(id, data);
    if (res.status === 200) {
      await Swal.fire({
        icon: "success",
        title: `${t("success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      callback(res.data);
    }
  };

  const handleSubmit = () => {
    stockUpdate(data?._id, stockEdit).then(() => {
      onClose();
    });
  };

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("edit_stock")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-md font-medium text-gray-900"
            >
              {t("product_name")}
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={stockEdit.name}
                onChange={handleChange}
                placeholder={t("product_name")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-orange-100 sm:text-sm"
              />
            </div>
          </div>

          {/* Quantity Input */}
          {/* <div className="sm:col-span-3 my-3">
            <label
              htmlFor="quantity"
              className="block text-md font-medium text-gray-900"
            >
              {t("amount")}
            </label>
            <div className="mt-2">
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={stockEdit.quantity}
                onChange={handleChange}
                placeholder={t("amount")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-orange-100 sm:text-sm"
              />
            </div>
          </div> */}

          {/* Buy Price Input */}
          <div className="sm:col-span-3 my-3">
            <label
              htmlFor="buyPrice"
              className="block text-md font-medium text-gray-900"
            >
              {t("buy_price")}
            </label>
            <div className="mt-2">
              <input
                id="buyPrice"
                name="buyPrice"
                type="number"
                value={stockEdit.buyPrice}
                onChange={handleChange}
                placeholder={t("buy_price")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-orange-100 sm:text-sm"
              />
            </div>
          </div>

          {/* Wastes Input */}
          <div className="sm:col-span-3 my-3">
            <label
              htmlFor="wastes"
              className="block text-md font-medium text-gray-900"
            >
              {t("wastes")}
            </label>
            <div className="mt-2">
              <input
                id="wastes"
                name="wastes"
                type="number"
                value={stockEdit.wastes}
                onChange={handleChange}
                placeholder={t("wastes")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-orange-100 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="relative col-span-3">
              <select
                name="unit"
                value={stockEdit.unit}
                onChange={handleChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option selected={true} disabled={true} value="">
                  {data?.unit ? data.unit : `-- ${t("chose_unit")} --`}
                </option>
                <option value="ກຣາມ">{t("g")}</option>
                <option value="ກິໂລກຣາມ">{t("kilogram")}</option>
                <option value="ໝັດ">{t("bundle")}</option>
                <option value="ແກ້ວ">{t("bottle")}</option>
                <option value="ລິດ">{t("litre")}</option>
                <option value="ມິລລິລິດ">{t("millilitre")}</option>
                <option value="ລັງເເກັດ">{t("box")}</option>
                <option value="ແພັກ">{t("pack")}</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
            <div className="relative col-span-3">
              <select
                name="stockCategoryId"
                value={stockEdit.stockCategoryId}
                onChange={handleChange}
                className="w-full bg-transparent text-slate-700 text-sm border rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 shadow-sm"
              >
                <option disabled value="">
                  {`-- ${t("chose_stock_type")} --`}
                </option>
                {stockCategory?.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t("close")}
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
