import React, { useState, useEffect } from "react";
import { BODY } from "../../constants";
import NavList from "./components/NavList";
import { Breadcrumb } from "react-bootstrap";
import { t } from "i18next";
import { createStockeAll, getStocksCategory } from "../../services/stocks";
import { useStore } from "../../store";
import { FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function StockCreate() {
  const navigate = useNavigate();
  const { profile } = useStore();
  const [categoryStock, setCategorysStock] = useState([]);
  const [stock, setStock] = useState([]);
  const [stockName, setStockName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [wastes, setWastes] = useState(0);
  const [stockQuality, setStockQuality] = useState(0);
  const [note, setNote] = useState("");
  const [units, setUnits] = useState("");
  const [stockCategory, setStockCategory] = useState("");

  const [data, setData] = useState({
    stockName: "",
    buyPrice: 0,
    wastes: 0,
    stockQuality: 0,
    note: "",
    stockCategory: "",
    unit: "",
  });

  console.log({ data });

  const getCategoryStock = async () => {
    const res = await getStocksCategory(profile.data.storeId);
    setCategorysStock(res?.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    //TODO: Validate name already exists
    const nameExists = stock.some((item) => item.name === data.stockName);

    if (nameExists) {
      await Swal.fire({
        icon: "warning",
        title: "ຊື້ສິນຄ້າມີຢູ່ແລ້ວ",
        showConfirmButton: false,
        timer: 1000,
      });
      return; // Stop further execution
    }

    const newStock = {
      name: data.stockName,
      buyPrice: data.buyPrice,
      wastes: data.wastes,
      quantity: data.stockQuality,
      detail: data.detail,
      stockCategoryId: data.stockCategory,
      unit: data.unit,
      storeId: profile.data.storeId,
      createdBy: profile.data._id,
    };

    localStorage.setItem("Stock", JSON.stringify([...stock, newStock]));
    setStock([...stock, newStock]);
    // setIsCreated(true);
    // setShowAlert(true);

    setData({
      stockName: "",
      buyPrice: "",
      wastes: "",
      stockQuality: "",
      detail: "",
      stockCategory: "",
      unit: "",
    });
  };

  const createStock = async () => {
    try {
      const res = await createStockeAll(stock);
      if (res.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "ປິນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem("Stock");
        navigate("/stock");
      }
    } catch (error) {
      console.log("err:", error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemove = (index) => {
    const updatedStockList = stock.filter((_, i) => i !== index);
    setStock(updatedStockList);
    console.log({ updatedStockList });
    if (updatedStockList.length === 0) {
      localStorage.removeItem("Stock");
    } else {
      localStorage.setItem("Stock", JSON.stringify(updatedStockList));
    }
  };

  useEffect(() => {
    getCategoryStock();
    const storedStock = JSON.parse(localStorage.getItem("Stock")) || [];
    setStock(storedStock);
  }, []);

  return (
    <div style={BODY}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className=" pb-2 mb-2 flex justify-between items-center">
          <h5 className="text-xl font-medium">{t("create_stock")}</h5>
          <button
            onClick={createStock}
            className="bg-color-app p-2 text-white font-medium rounded-md mb-2 hover:bg-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {t("save")}
          </button>
        </div>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-md font-medium text-gray-900">
                {t("product_name")}
              </label>
              <div className="mt-2">
                <input
                  name="stockName"
                  placeholder={t("product_name")}
                  type="text"
                  required
                  value={data.stockName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-md font-medium text-gray-900">
                {t("buy_price")}
              </label>
              <div className="mt-2">
                <input
                  name="buyPrice"
                  placeholder={t("buy_price")}
                  value={data.buyPrice}
                  onChange={handleChange}
                  type="number"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-md font-medium text-gray-900">
                {t("stock_amount")}
              </label>
              <div className="mt-2">
                <input
                  name="stockQuality"
                  type="number"
                  value={data.stockQuality}
                  onChange={handleChange}
                  placeholder={t("stock_amount")}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-md font-medium text-gray-900">
                {t("wastes")} %
              </label>
              <div className="mt-2">
                <input
                  name="wastes"
                  value={data.wastes}
                  setWastes
                  onChange={handleChange}
                  placeholder={`${t("wastes")} %`}
                  type="number"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="relative col-span-3">
              <select
                name="stockCategory"
                value={data.stockCategory}
                onChange={handleChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option selected={true} disabled={true} value="">
                  -- {t("chose_stock_type")} --
                </option>
                {categoryStock?.map((e) => {
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

            {/* Dropdown for Brazil (again, for example) */}
            <div className="relative col-span-3">
              <select
                name="unit"
                value={data.unit}
                onChange={handleChange}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option selected={true} disabled={true} value="">
                  -- {t("chose_unit")} --
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
          </div>
          <div className="mt-2 col-span-full">
            <label className="block text-md font-medium text-gray-900">
              {t("note")}
            </label>
            <div className="mt-2">
              <textarea
                name="detail"
                value={data.detail}
                onChange={handleChange}
                placeholder={t("note")}
                rows={3}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                defaultValue={""}
              />
            </div>
            {/* <p className="mt-3 text-sm/6 text-gray-600">
            Write a few sentences about yourself.
          </p> */}
          </div>
          <button
            type="submit"
            className="mt-3 min-w-0 py-2 px-4 bg-color-app text-white font-medium rounded-md hover:bg-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {t("add_stock_type")}
          </button>
        </form>
        <div className="mt-4 border border-gray-200 rounded-lg shadow-md">
          <div className="px-4 py-2 bg-gray-100 border-b">
            <h5 className="text-xl font-semibold">{t("stock_type")}</h5>
          </div>
          <div className="px-4 py-4">
            {/* Table to display stock types */}
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-center">
                    {t("stock_type_name")}
                  </th>
                  <th className="px-4 py-2 text-center">{t("buy_price")}</th>
                  <th className="px-4 py-2 text-center">{t("stock_amount")}</th>
                  <th className="px-4 py-2 text-center">{t("wastes")}</th>
                  <th className="px-4 py-2 text-center">{t("stock_type")}</th>
                  <th className="px-4 py-2 text-center">{t("unit")}</th>
                  <th className="px-4 py-2 text-center">{t("note")}</th>
                  <th className="px-4 py-2 text-center">{t("manage")}</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((stock, index) => {
                  // Find the category name from categoryStock array
                  const categoryName =
                    categoryStock.find(
                      (cat) => cat._id === stock.stockCategoryId
                    )?.name || t("unknown_category");

                  return (
                    <tr key={stock.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 text-center">{stock.name}</td>
                      <td className="px-4 py-2 text-center">
                        {stock.buyPrice}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {stock.quantity}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {stock.wastes} %
                      </td>
                      {/* Display category name instead of ID */}
                      <td className="px-4 py-2 text-center">{categoryName}</td>
                      <td className="px-4 py-2 text-center">{stock.unit}</td>
                      <td className="px-4 py-2 text-center">{stock.detail}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemove(index)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove stock type ${stock.name}`}
                        >
                          <FaTimesCircle
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
