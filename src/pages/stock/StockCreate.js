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
import clsx from "clsx";
import { get } from "lodash";

export default function StockCreate() {
  const navigate = useNavigate();
  const { profile } = useStore();
  const [categoryStock, setCategorysStock] = useState([]);
  const [stockIndex, setStockIndex] = useState(0);
  const [stock, setStock] = useState([]);
  const [stockName, setStockName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [wastes, setWastes] = useState(0);
  const [stockQuality, setStockQuality] = useState(0);
  const [note, setNote] = useState("");
  const [units, setUnits] = useState("");
  const [stockCategory, setStockCategory] = useState("");

  const [stockOnec, setStockOnec] = useState({
    stockName: "",
    buyPrice: 0,
    wastes: 0,
    stockQuality: 0,
    note: "",
    stockCategory: "",
    unit: "",
    lowStock: 0,
  });

  const [data, setData] = useState([]);

  const getIndex = () => {
    const indexData = stock.length;
    setStockIndex(indexData);
  };

  const getCategoryStock = async () => {
    const res = await getStocksCategory(profile.data.storeId);
    setCategorysStock(res?.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name already exists
    const nameExists = stock.some((item) => item.name === data?.stockName);

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
      name: stockOnec?.stockName,
      buyPrice: stockOnec?.buyPrice,
      wastes: stockOnec?.wastes,
      quantity: stockOnec?.stockQuality,
      detail: stockOnec?.detail,
      unit: stockOnec?.unit,
      storeId: profile?.data?.storeId,
      createdBy: profile?.data?._id,
      statusLevel: stockOnec?.lowStock,
    };
    if (stockOnec?.stockCategory) {
      newStock.stockCategoryId = stockOnec?.stockCategory;
    }

    setStock([...stock, newStock]);
    localStorage.setItem("StockName", JSON.stringify([...stock, newStock]));
    // setStock([...stock, newStock]);

    setStockOnec({
      stockName: "",
      buyPrice: 0,
      wastes: 0,
      stockQuality: 0,
      note: "",
      stockCategory: "",
      unit: "",
      lowStock: 0,
    });
  };

  const createStock = async () => {
    try {
      const res = await createStockeAll(stock);
      if (res.status === 200) {
        await Swal.fire({
          icon: "success",
          title: `${t("success")}`,
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem("StockName");
        navigate("/stock");
      } else {
        await Swal.fire({
          icon: "error",
          title: `ຊື້ສະຕອ໋ກມີຢູ່ແລ້ວ`,
          text: `${res?.data?.existNames}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log("err:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Message: ${error.message}, Code: ${
          error.code || "INTERNAL_SERVER_ERROR"
        }`,
        showConfirmButton: true,
      });
    }
  };

  const handleChangeOnce = (e) => {
    const { name, value } = e.target;
    setStockOnec((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;

    // Update data for the specific index
    setStock((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };

      // Create updated stock structure
      const createStock = stock.map((stockItem, idx) => ({
        name: stockItem.name,
        buyPrice: updatedData[idx]?.buyPrice || "",
        wastes: updatedData[idx]?.wastes || "",
        quantity: updatedData[idx]?.quantity || "",
        detail: stockItem?.detail || "",
        stockCategoryId: updatedData[idx]?.stockCategoryId || "",
        unit: updatedData[idx]?.unit || "",
        unit1: updatedData[idx]?.unit1 || "",
        storeId: profile.data?.storeId || "",
        createdBy: profile.data?._id || "",
      }));

      return createStock; // Update state with the new structure
    });
  };

  const handleRemove = (index) => {
    const updatedStockList = stock.filter((_, i) => i !== index);
    setStock(updatedStockList);
    console.log({ updatedStockList });
    if (updatedStockList.length === 0) {
      localStorage.removeItem("StockName");
    } else {
      localStorage.setItem("StockName", JSON.stringify(updatedStockList));
    }
  };

  console.log("stock", stock);

  useEffect(() => {
    getCategoryStock();
    getIndex();
    const storedStock = JSON.parse(localStorage.getItem("StockName")) || [];
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
                  value={stockOnec.stockName}
                  onChange={handleChangeOnce}
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
                  value={stockOnec.buyPrice}
                  onChange={handleChangeOnce}
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
                  value={stockOnec.stockQuality}
                  onChange={handleChangeOnce}
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
                  value={stockOnec.wastes}
                  setWastes
                  onChange={handleChangeOnce}
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
                value={stockOnec.stockCategory}
                onChange={handleChangeOnce}
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
                value={stockOnec.unit}
                onChange={handleChangeOnce}
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
          <div className="mt-2 sm:col-span-3">
            <label className="block text-md font-medium text-gray-900">
              {t("low_stock")}
            </label>
            <div className="mt-2">
              <input
                name="lowStock"
                value={stockOnec.lowStock}
                setWastes
                onChange={handleChangeOnce}
                placeholder={`${t("low_stock")}`}
                type="number"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="mt-2 col-span-full">
            <label className="block text-md font-medium text-gray-900">
              {t("note")}
            </label>
            <div className="mt-2">
              <textarea
                name="detail"
                value={stockOnec.detail}
                onChange={handleChangeOnce}
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
                  <th className="px-4 py-2 text-center">{t("low_stock")}</th>
                  <th className="px-4 py-2 text-center">{t("note")}</th>
                  <th className="px-4 py-2 text-center">{t("manage")}</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((stock, index) => {
                  // Find the category name from categoryStock array
                  return (
                    <tr key={stock.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 text-center">{stock.name}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="mt-2 justify-center">
                          <input
                            name="buyPrice"
                            type="number"
                            value={
                              stock?.buyPrice
                                ? stock?.buyPrice
                                : data.stockQuality || 0
                            }
                            onChange={(e) => handleChange(index, e)}
                            placeholder={t("buy_price")}
                            autoComplete="given-name"
                            className="text-center block w-20 rounded-md bg-white  py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6 justify-center"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="mt-2 flex justify-center">
                          <input
                            name="quantity"
                            type="number"
                            value={
                              stock?.quantity
                                ? stock?.quantity
                                : data?.quantity || 0
                            }
                            onChange={(e) => handleChange(index, e)}
                            placeholder={t("stock_amount")}
                            autoComplete="given-name"
                            className="text-center block w-20 rounded-md bg-white py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="mt-2 justify-center flex">
                          <input
                            name="wastes"
                            type="number"
                            value={
                              stock?.wastes ? stock?.wastes : data?.wastes || 0
                            }
                            onChange={(e) => handleChange(index, e)}
                            placeholder={t("wastes")}
                            autoComplete="given-name"
                            className="text-center block w-20 rounded-md bg-white  py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-100 sm:text-sm/6 justify-center"
                          />
                          <span className="text-center px-2 py-1"> %</span>
                        </div>
                      </td>
                      {/* Display category name instead of ID */}
                      <td className="px-4 py-2 text-center">
                        <div className="relative col-span-3">
                          <select
                            name="stockCategoryId"
                            value={
                              stock?.stockCategoryId
                                ? stock?.stockCategoryId
                                : data.stockCategoryId || ""
                            }
                            onChange={(e) => handleChange(index, e)}
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
                      </td>
                      <td>
                        <div className="relative col-span-3">
                          <select
                            name="unit"
                            value={stock?.unit ? stock?.unit : data.unit || ""}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer justify-center"
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
                            <option value="ຖົງ">{t("pack")}</option>
                            <option value="ປ໋ອງ">{t("pack")}</option>
                            <option value="ອັນ">{t("pack")}</option>
                            <option value="ຕຸກ">{t("pack")}</option>
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
                      </td>
                      <td className="px-4 py-2 text-center">
                        {stock.statusLevel}
                      </td>
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
