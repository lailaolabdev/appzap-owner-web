import React from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function PopUpEditStock({ open, onClose, data, stockCategory }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
      amount: data?.quantity || 0,
      buyPrice: data?.buyPrice || 0,
      wastes: data?.wastes || 0,
      unit: data?.unit || "",
      stockCategory: data?.stockCategoryId?._id || "",
    },
  });

  const onSubmit = (formData) => {
    console.log("Submitted Data:", formData); // Replace with save logic
  };

  return (
    <div>
      <Modal show={open} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit_stock")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:col-span-3">
              <label className="block text-md font-medium text-gray-900">
                {t("product_name")}
              </label>
              <div className="mt-2">
                <input
                  {...register("name", {
                    required: t("product_name_required"),
                  })}
                  placeholder={t("product_name")}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
              </div>
            </div>
            <div className="sm:col-span-3 my-3">
              <label className="block text-md font-medium text-gray-900">
                {t("amount")}
              </label>
              <div className="mt-2">
                <input
                  {...register("amount", { required: t("amount_required") })}
                  type="number"
                  placeholder={t("amount")}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3 my-3">
              <label className="block text-md font-medium text-gray-900">
                {t("buy_price")}
              </label>
              <div className="mt-2">
                <input
                  {...register("buy_price", {
                    required: t("buy_price_required"),
                  })}
                  type="number"
                  // onChange={handleChangeOnce}
                  placeholder={t("buy_price")}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3 my-3">
              <label className="block text-md font-medium text-gray-900">
                {t("wastes")} %
              </label>
              <div className="mt-2">
                <input
                  {...register("wastes", {
                    required: t("wastes_required"),
                  })}
                  type="number"
                  // onChange={handleChangeOnce}
                  placeholder={t("wastes")}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="relative col-span-3">
                <select
                  {...register("unit", {
                    required: t("unit_required"),
                  })}
                  type="text"
                  // onChange={handleChangeOnce}
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
                  {...register("categoryId", {
                    required: t("categoryId_required"),
                  })}
                  type="text"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                >
                  <option selected={true} disabled={true} value="">
                    {data?.stockCategoryId?.name
                      ? data.stockCategoryId.name
                      : `-- ${t("chose_stock_type")} --`}
                  </option>
                  {stockCategory?.map((e) => {
                    return <option value={e?._id}>{e?.name}</option>;
                  })}
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
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
          <Button type="submit" variant="primary">
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
