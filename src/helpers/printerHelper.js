// kitchenPrinter.js
const axios = require('axios');

const PRINTER_URL = "http://localhost:9090/api/v1/ethernet-printing/kitchen";

/**
 * Sends an order to the kitchen printer.
 * @param {Object} data - The data for the order.
 * @param {string} data.tableName - The table name for the order.
 * @param {string} data.code - The order code.
 * @param {Array} data.orders - The orders to print.
 * @param {string} printerIP - The IP address of the kitchen printer.
 */
const sendToKitchenPrinter = async (data, printerIP = "192.168.110.210") => {
  try {
    const { tableName, code, orders } = data;
    // Map the orders to the required format for printing
    const mappedOrders = orders.map((order) => {
      const subBody = order.options.map((option) => ({
        text: `- ${option.name}`,
        bold: false,
        fontSize: 24,
      }));

      if (order.note) {
        subBody.push({
          text: `Note: ${order.note}`,
          bold: false,
          fontSize: 24,
        });
      }

      return {
        text: `${order.name} (${order.quantity} x ${order.price.toLocaleString()})`,
        bold: true,
        fontSize: 30,
        subBody: subBody,
      };
    });

    // Prepare the print payload
    const printPayload = {
      header: {
        text: `ໂຕະ: ${tableName} (${code})`,
        fontSize: 40,
      },
      body: mappedOrders,
      footer: {
        left: "ຜະລິດ",
        right: new Date().toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
      printerIP: printerIP,
      shouldCutEachItem: true,
    };

    // Send the print request to the kitchen printer
    const response = await axios.post(PRINTER_URL, printPayload);

    console.log("Print job sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending print job:", error.message);
  }
};

module.exports = { sendToKitchenPrinter };
