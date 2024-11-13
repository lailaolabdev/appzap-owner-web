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

export const printItems = async (
  groupedItems,
  combinedBillRefs,
  printers,
  selectedTable
) => {
  for (const [printerIp, items] of Object.entries(groupedItems)) {
    const _printer = printers.find((e) => e?.ip === printerIp);

    if (!_printer) {
      console.error(`No printer found with IP: ${printerIp}`);
      continue;
    }

    try {
      const base64ArrayAndPrinter = convertHtmlToBase64(
        items,
        _printer,
        selectedTable
      );

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
const convertHtmlToBase64 = (items, printer, selectedTable) => {
  const base64ArrayAndPrinter = [];

  items.forEach((data) => {
    if (data) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Constants for layout
      const width = 510;
      const baseHeight = 100; // Header height
      const extraHeightPerItem = 40; // Height for each item
      const extraHeightPerOption = 30; // Height for each option
      const footerHeight = 60; // Footer height
      const marginTop = 20; // Space between sections
      const titleMarginLeft = 20;
      const optionMarginLeft = 40;

      // Calculate total height dynamically
      let contentHeight = baseHeight;
      items.forEach((item) => {
        contentHeight += extraHeightPerItem;
        if (item.options && item.options.length > 0) {
          contentHeight += item.options.length * extraHeightPerOption;
        }
      });
      contentHeight += footerHeight + marginTop;

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = contentHeight;

      // Background
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, contentHeight);

      // Header
      context.fillStyle = "#000";
      context.fillRect(0, 0, width / 2, 60);
      context.fillStyle = "#fff";
      context.font = "bold NotoSansLao, 36px Arial, sans-serif";
      context.fillText(
        selectedTable?.tableName || "Table",
        titleMarginLeft,
        45
      );

      context.fillStyle = "#000";
      context.font = "bold NotoSansLao, 30px Arial, sans-serif";
      context.fillText(selectedTable?.code || "N/A", width - 160, 45);

      // Divider line below header
      context.strokeStyle = "#ccc";
      context.beginPath();
      context.moveTo(0, 65);
      context.lineTo(width, 65);
      context.stroke();

      // Items
      context.font = "30px NotoSansLao, Arial, sans-serif";
      let itemYPosition = baseHeight; // Start after header
      items.forEach((item) => {
        // Main item
        context.font = "bold NotoSansLao, 28px Arial, sans-serif";
        context.fillText(
          `${item.name} (x${item.quantity || 1})`,
          titleMarginLeft,
          itemYPosition
        );
        itemYPosition += extraHeightPerItem;

        // Options
        if (item.options && item.options.length > 0) {
          context.font = "24px NotoSansLao, Arial, sans-serif";
          item.options.forEach((option) => {
            context.fillText(
              `- ${option.name} ${option.price ? `- ${option.price}` : ""} x ${
                option.quantity || 1
              }`,
              optionMarginLeft,
              itemYPosition
            );
            itemYPosition += extraHeightPerOption;
          });
        }
      });

      // Dotted line
      context.strokeStyle = "#000";
      context.setLineDash([4, 2]);
      context.beginPath();
      context.moveTo(0, itemYPosition + marginTop);
      context.lineTo(width, itemYPosition + marginTop);
      context.stroke();
      context.setLineDash([]);

      // Footer
      context.font = "bold NotoSansLao, 24px Arial, sans-serif";
      context.fillStyle = "#000";
      context.fillText(
        data?.createdBy?.firstname || data?.updatedBy?.firstname || "lailaolab",
        titleMarginLeft,
        contentHeight - footerHeight / 2
      );

      context.fillStyle = "#6e6e6e";
      context.font = "22px NotoSansLao, Arial, sans-serif";
      context.fillText(
        `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
          data?.createdAt
        ).format("LT")}`,
        width - 200,
        contentHeight - footerHeight / 2
      );

      // Convert to base64
      const dataUrl = canvas.toDataURL("image/png");
      base64ArrayAndPrinter.push({ dataUrl, printer });
    }
  });

  return base64ArrayAndPrinter;
};
