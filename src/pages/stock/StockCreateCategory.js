import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, Form, Button, Table, Alert } from "react-bootstrap";
import { t } from "i18next";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Importing the success icon from react-icons

export default function StockCreateCategory() {
  const [stockTypeName, setStockTypeName] = useState("");
  const [note, setNote] = useState("");
  const [stockList, setStockList] = useState([]);
  const [isCreated, setIsCreated] = useState(false); // State to track if stock is created
  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the alert

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new stock object and add to the stock list
    const newStock = {
      id: stockList.length + 1,
      name: stockTypeName,
      note: note,
    };
    localStorage.setItem("stockAdd", JSON.stringify([...stockList, newStock]));

    // Update stock list and show "Create Complete" message
    setStockList([...stockList, newStock]);
    setIsCreated(true);
    setShowAlert(true); // Show the alert when stock is created

    // Reset form after submit
    setStockTypeName("");
    setNote("");

    // Auto close the alert after 3 seconds
    // setTimeout(() => {
    //   setShowAlert(false); // Hide the alert after 3 seconds
    // }, 3000);
  };

  const handleRemove = (id) => {
    // Remove stock from the list and update localStorage
    const updatedStockList = stockList.filter((stock) => stock.id !== id);
    setStockList(updatedStockList);
    localStorage.setItem("stockAdd", JSON.stringify(updatedStockList));
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
        <div
          className="mt-3 flex items-center justify-between px-4, py-2 leading-normal text-green-600 bg-green-100 rounded-lg"
          role="alert"
        >
          <div className="flex items-center ">
            <FaCheckCircle className="mr-3" /> {/* Success Icon */}
            <p>{t("add_complete")}</p>
          </div>
          <svg
            onClick={() => setShowAlert(false)}
            className="w-4 h-4 fill-current text-green-600 ml-4 cursor-pointer hover:opacity-80"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z" />
          </svg>
        </div>
      )}

      {/* Card for the form content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h5 className="text-xl font-semibold">{t("add_stock_type")}</h5>
        </div>

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
              className="px-2 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="px-2 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-w-0 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {t("add_stock_type")}
          </button>
        </form>
      </div>

      {/* Card for the table content */}
      <Card className="mt-4">
        <Card.Header>
          <h5>{t("stock_type")}</h5>
        </Card.Header>
        <Card.Body>
          {/* Table to display stock types */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>{t("stock_type_name")}</th>
                <th style={{ textAlign: "center" }}>{t("note")}</th>
                <th style={{ textAlign: "center" }}>{t("manage")}</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.id}</td>
                  <td style={{ textAlign: "center" }}>{stock.name}</td>
                  <td style={{ textAlign: "center" }}>{stock.note}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(stock.id)}
                    >
                      <FaTimesCircle />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
