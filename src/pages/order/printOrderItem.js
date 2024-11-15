import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob, moneyCurrency } from "../../helpers"; // Adjust the import path based on your project structure
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants/index"; // Adjust the import path based on your project structure
import printFlutter from "../../helpers/printFlutter";
import moment from "moment";

export const printOrderItems = async (
  groupedItems,
  combinedBillRefs,
  printers,
  selectedTable
) => {
  console.log("groupedItems", groupedItems);
  for (const [printerIp, items] of Object.entries(groupedItems)) {
    const _printer = printers.find((e) => e?.ip === printerIp);

    if (!_printer) {
      console.error(`No printer found with IP: ${printerIp}`);
      continue;
    }

    console.log("items", items);
    const base64ArrayAndPrinter = convertHtmlToBase64(
      items,
      _printer,
      selectedTable
    );

    try {
      if (base64ArrayAndPrinter.length > 0) {
        const { dataUrl, printer } = base64ArrayAndPrinter[0]; // Use the first (and only) base64 image

        await runPrint(dataUrl, printer);
      }
    } catch (err) {
      console.error(`Failed to print items for printer ${printerIp}:`, err);
      continue;
    }
  }
};

// Run the actual print process for each printer
const runPrint = async (dataUrl, printer) => {
  try {
    const printFile = await base64ToBlob(dataUrl);
    const bodyFormData = new FormData();

    bodyFormData.append("ip", printer?.ip);
    bodyFormData.append("isdrawer", false);
    bodyFormData.append("port", "9100");
    bodyFormData.append("image", printFile);
    bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

    let urlForPrinter = "";
    if (printer?.type === "ETHERNET") {
      urlForPrinter = ETHERNET_PRINTER_PORT;
    } else if (printer?.type === "BLUETOOTH") {
      urlForPrinter = BLUETOOTH_PRINTER_PORT;
    } else if (printer?.type === "USB") {
      urlForPrinter = USB_PRINTER_PORT;
    }

    await printFlutter(
      {
        imageBuffer: dataUrl,
        ip: printer?.ip,
        type: printer?.type,
        port: "9100",
        width: printer?.width === "58mm" ? 400 : 580,
      },
      async () => {
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    );
  } catch (error) {
    console.error(`Failed to print to ${printer?.ip}:`, error);
    throw error;
  }
};

// Convert HTML element to base64 for printing
const convertHtmlToBase64 = (itemsByTable, printer, selectedTable) => {
  const base64ArrayAndPrinter = [];
  let totalPrice = 0;

  console.log("itemsByTable", itemsByTable);

  // Process each tableId group separately
  Object.entries(itemsByTable).forEach(([code, items]) => {
    console.log("DATA code: ", items);

    if (items && Array.isArray(items)) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const width = 510;
      const baseHeight = 100;
      const extraHeightPerItem = 40;
      const extraHeightPerOption = 30;
      const footerHeight = 60;
      const marginTop = 20;

      let contentHeight = baseHeight;
      items.forEach((item) => {
        contentHeight += extraHeightPerItem;
        if (item.options && item.options.length > 0) {
          contentHeight += item.options.length * extraHeightPerOption;
        }
      });
      contentHeight += footerHeight + marginTop;

      canvas.width = width;
      canvas.height = contentHeight;

      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, contentHeight);

      context.fillStyle = "#000";
      context.font = "bold 36px Arial, sans-serif";
      context.fillText(`Table: ${selectedTable?.tableName || "Table"}`, 20, 45);

      let itemYPosition = baseHeight;
      items.forEach((item) => {
        context.font = "28px Arial, sans-serif";
        context.fillText(
          `- ${item.name} x${item.quantity || 1}`,
          20,
          itemYPosition
        );
        itemYPosition += extraHeightPerItem;

        totalPrice += (item.price || 0) * (item.quantity || 1);

        if (item.options) {
          context.font = "24px Arial, sans-serif";
          item.options.forEach((option) => {
            context.fillText(
              `  - ${option.name} x${option.quantity || 1}`,
              40,
              itemYPosition
            );
            itemYPosition += extraHeightPerOption;

            totalPrice += (option.price || 0) * (option.quantity || 1);
          });
        }
      });

      context.font = "30px Arial, sans-serif";
      context.fillText(
        `Total: ${totalPrice} LAK`,
        20,
        itemYPosition + marginTop
      );

      const dataUrl = canvas.toDataURL("image/png");
      base64ArrayAndPrinter.push({ dataUrl, printer });
    } else {
      console.error(`Expected items to be an array, but got:`, items);
    }
  });

  return base64ArrayAndPrinter;
};
