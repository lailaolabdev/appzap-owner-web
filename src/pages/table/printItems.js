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
  console.log("groupedItems", groupedItems);
  for (const [printerIp, items] of Object.entries(groupedItems)) {
    const _printer = printers.find((e) => e?.ip === printerIp);

    if (!_printer) {
      console.error(`No printer found with IP: ${printerIp}`);
      continue;
    }

    console.log("_printer", _printer);
    console.log("items", items);

    try {
      const base64ArrayAndPrinter = convertHtmlToBase64(
        items,
        _printer,
        selectedTable
      );

      console.log("base64ArrayAndPrinter", base64ArrayAndPrinter);

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
  console.log("items123", items);
  const base64ArrayAndPrinter = [];
  let totalPrice = 0; // Variable to hold the total price

  // Helper function to wrap text
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lines.push({ text: line.trim(), y: currentY });
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line.trim()) {
      lines.push({ text: line.trim(), y: currentY });
    }

    // Draw all lines
    lines.forEach((lineObj) => {
      context.fillText(lineObj.text, x, lineObj.y);
    });

    // Return the final Y position for next content
    return lines.length > 0 ? lines[lines.length - 1].y : y;
  };

  items.forEach((data) => {
    if (data) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Constants for layout
      const width = 510;
      const baseHeight = 100; // Header height
      const extraHeightPerItem = 40; // Base height for each item
      const extraHeightPerOption = 30; // Height for each option
      const footerHeight = 60; // Footer height
      const marginTop = 20; // Space between sections
      const titleMarginLeft = 20;
      const optionMarginLeft = 40;
      const maxTextWidth = width - titleMarginLeft - 20; // Maximum width for text
      const lineHeight = 35; // Height between lines for wrapped text

      // Calculate total height dynamically (rough estimate, will adjust later)
      let contentHeight = baseHeight;

      // Estimate height for items (accounting for potential wrapping)
      items.forEach((item) => {
        // Estimate 2 lines max per item name
        contentHeight += extraHeightPerItem + lineHeight;
        if (item.options && item.options.length > 0) {
          contentHeight += item.options.length * extraHeightPerOption;
        }
      });
      contentHeight += footerHeight + marginTop + 50; // Extra buffer

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
      context.font = "bold 36px NotoSansLao, Arial, sans-serif";
      context.fillText(
        selectedTable?.tableName || data?.tableName,
        titleMarginLeft,
        45
      );

      context.fillStyle = "#000";
      context.font = "bold 30px NotoSansLao, Arial, sans-serif";
      context.fillText(selectedTable?.code || "N/A", width - 160, 45);

      // Divider line below header
      context.strokeStyle = "#ccc";
      context.beginPath();
      context.moveTo(0, 65);
      context.lineTo(width, 65);
      context.stroke();

      // Items
      context.fillStyle = "#000";
      let itemYPosition = baseHeight + 20; // Start after header with some margin

      items.forEach((item) => {
        // Main item with text wrapping
        context.font = "bold 28px NotoSansLao, Arial, sans-serif";
        const itemText = `- ${item.name} (x${item.quantity || 1})`;
        context.font = "NotoSansLao, Arial, sans-serif";
        context.fillStyle = "#000";
        const finalY = wrapText(
          context,
          itemText,
          titleMarginLeft,
          itemYPosition,
          maxTextWidth,
          lineHeight
        );

        itemYPosition = finalY + 30; // Add more space after the item

        // Calculate price for the item
        totalPrice += (item.price || 0) * (item.quantity || 1);

        //note
        if (item.note) {
          context.font = "20px NotoSansLao, Arial, sans-serif";
          context.fillStyle = "#666"; // Lighter color for note
          const itemNoteText = `note: ${item.note}`;
          const itemNoteFinalY = wrapText(
            context,
            itemNoteText,
            titleMarginLeft + 10, // Slightly indented
            itemYPosition,
            maxTextWidth - 10,
            24
          );
          itemYPosition = itemNoteFinalY + 20;
          context.fillStyle = "#000"; // Reset color back to black
        }

        // Options
        if (item.options && item.options.length > 0) {
          context.font = "24px NotoSansLao, Arial, sans-serif";
          item.options.forEach((option) => {
            const optionText = `- ${option.name} ${
              option.price ? `- ${option.price}` : ""
            } ${option.quantity !== 1 ? "x" : ""} ${
              option.quantity !== 1 ? option.quantity : ""
            }`;
            const optionFinalY = wrapText(
              context,
              optionText,
              optionMarginLeft,
              itemYPosition,
              maxTextWidth - 20, // Slightly less width for options
              28
            );
            itemYPosition = optionFinalY + 25; // Add more space after each option

            // Add the option price to the total
            totalPrice += (option.price || 0) * (option.quantity || 1);
          });
        }

        itemYPosition += 20; // Extra space between items
      });

      // Total Price Text
      context.font = "30px NotoSansLao, Arial, sans-serif";
      context.fillStyle = "#000";
      context.fillText(
        `ລວມ: ${moneyCurrency(totalPrice)} LAK`,
        titleMarginLeft,
        itemYPosition + marginTop
      );

      // Dotted line
      context.strokeStyle = "#000";
      context.setLineDash([4, 2]);
      context.beginPath();
      context.moveTo(0, itemYPosition + marginTop + 15);
      context.lineTo(width, itemYPosition + marginTop + 15);
      context.stroke();
      context.setLineDash([]);

      // Footer
      const footerY = itemYPosition + marginTop + 45;
      context.font = "bold 24px NotoSansLao, Arial, sans-serif";
      context.fillStyle = "#000";
      context.fillText(
        data?.createdBy?.firstname || data?.updatedBy?.firstname || "",
        titleMarginLeft,
        footerY
      );

      context.fillStyle = "#6e6e6e";
      context.font = "22px NotoSansLao, Arial, sans-serif";
      context.fillText(
        `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
          data?.createdAt
        ).format("LT")}`,
        width - 200,
        footerY
      );

      // Adjust canvas height to actual content
      const actualHeight = footerY + 30;
      if (actualHeight < contentHeight) {
        const newCanvas = document.createElement("canvas");
        const newContext = newCanvas.getContext("2d");
        newCanvas.width = width;
        newCanvas.height = actualHeight;
        newContext.drawImage(canvas, 0, 0);

        // Convert to base64
        const dataUrl = newCanvas.toDataURL("image/png");
        base64ArrayAndPrinter.push({ dataUrl, printer });
      } else {
        // Convert to base64
        const dataUrl = canvas.toDataURL("image/png");
        base64ArrayAndPrinter.push({ dataUrl, printer });
      }
    }
  });

  return base64ArrayAndPrinter;
};
