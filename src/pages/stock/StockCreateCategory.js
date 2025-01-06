import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, Form, Button, Table, Alert } from "react-bootstrap";
import { t } from "i18next";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { createStockeCategoryAll } from "../../services/stocks";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

export default function StockCreateCategory() {
  const navigate = useNavigate();
  const { profile } = useStore();
  const [stockTypeName, setStockTypeName] = useState("");
  const [note, setNote] = useState("");
  const [stockList, setStockList] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //TODO: Check if stock name already exists
    const isNameExists = stockList.some(
      (stock) => stock.name === stockTypeName
    );
    if (isNameExists) {
      await Swal.fire({
        icon: "warning",
        title: "ຊື້ສະຕອກມີຢູ່ແລ້ວ",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    const newStock = {
      name: stockTypeName,
      note: note,
      storeId: profile.data.storeId,
      createdBy: profile.data._id,
    };
    localStorage.setItem("stockAdd", JSON.stringify([...stockList, newStock]));

    setStockList([...stockList, newStock]);
    setIsCreated(true);
    setShowAlert(true);

    setStockTypeName("");
    setNote("");

    // setShowAlert(false);
    setTimeout(() => {
      setShowAlert(false);
    }, 1500);
  };

  const createCategory = async () => {
    try {
      const res = await createStockeCategoryAll(stockList);
      if (res.status === 200) {
        await Swal.fire({
          icon: "success",
          title: `${t("success")}`,
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem("stockAdd");
        navigate("/stockCategory");
      } else {
        console.log("res:", res);
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
    }
  };

  const handleRemove = (index) => {
    const updatedStockList = stockList.filter((_, i) => i !== index);
    setStockList(updatedStockList);
    console.log({ updatedStockList });
    if (updatedStockList.length === 0) {
      localStorage.removeItem("stockAdd");
    } else {
      localStorage.setItem("stockAdd", JSON.stringify(updatedStockList));
    }
  };

  useEffect(() => {
    const storedStock = JSON.parse(localStorage.getItem("stockAdd")) || [];
    setStockList(storedStock);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Breadcrumb for navigation */}
      {/* <Breadcrumb>
        <Breadcrumb.Item>{t("stock_manage")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("add_stock_type")}</Breadcrumb.Item>
      </Breadcrumb> */}

      {/* Display "Create Complete" success alert */}
      {showAlert && (
        <Alert
          variant="success"
          className=" mt-3 d-flex align-items-center"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <FaCheckCircle style={{ marginRight: "10px" }} /> {/* Success Icon */}
          {t("add_complete")}
        </Alert>
      )}

      {/* Card for the form content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className=" pb-2 mb-2 flex justify-between items-center">
          <h5 className="text-xl font-semibold">{t("add_stock_type")}</h5>
          <button
            onClick={createCategory}
            className="bg-color-app p-2 text-white font-semibold rounded-md mb-2 hover:bg-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {t("save")}
          </button>
        </div>
        <hr></hr>

        {/* Form for stock type */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="formStockTypeName"
              className="text-md font-semibold  text-gray-700 mb-2"
            >
              {t("stock_type_name")}
            </label>
            <input
              id="formStockTypeName"
              type="text"
              placeholder={t("stock_type_name")}
              value={stockTypeName}
              onChange={(e) => setStockTypeName(e.target.value)}
              required
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="formNote"
              className="text-md font-bold text-gray-700 mb-2"
            >
              {t("note")}
            </label>
            <textarea
              id="formNote"
              rows={3}
              placeholder={t("note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-w-0 py-2 px-4 bg-color-app text-white rounded-md hover:bg-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {t("add_stock_type")}
          </button>
        </form>
      </div>

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
                <th className="px-4 py-2 text-center">{t("note")}</th>
                <th className="px-4 py-2 text-center">{t("manage")}</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((stock, index) => (
                <tr key={stock.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{stock.name}</td>
                  <td className="px-4 py-2 text-center">{stock.note}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove stock type ${stock.name}`}
                    >
                      <FaTimesCircle className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
