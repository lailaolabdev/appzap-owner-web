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

  items.forEach((data, index) => {
    if (data) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Calculate dynamic canvas height based on the number of items
      const width = 510;
      const headerHeight = 60; // Height for the title block
      const footerHeight = 60; // Height for the footer (date/time)
      const height = headerHeight + items.length * 60 + footerHeight; // Final canvas height

      canvas.width = width;
      canvas.height = height;

      // Set white background
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      // Helper function for text wrapping
      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;

          // Check if the line exceeds the maximum width
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " "; // Start a new line with the current word
            y += lineHeight; // Move down for the next line
          } else {
            line = testLine; // Continue adding to the line
          }
        }

        // Draw the last line if there's remaining text
        if (line) {
          context.fillText(line, x, y);
        }
      }

      // Draw the Title Block with increased margin
      const titleMargin = 20; // Set a margin for the title
      const tableName = selectedTable?.tableName || "Table";
      context.fillStyle = "#000"; // Black background for left block
      context.fillRect(0, 0, width / 2, headerHeight); // Black block width / 2
      context.fillStyle = "#fff"; // White text
      context.font = "bold 36px NotoSansLao";
      context.fillText(tableName, titleMargin, 45); // Title text on the left with margin

      const tableCode = selectedTable?.code || "N/A";
      context.fillStyle = "#000"; // Black text
      context.font = "bold 30px NotoSansLao";
      context.fillText(tableCode, width - 160, 44); // Dynamically display selectedTable's code

      // Draw Items List with increased margin
      context.fillStyle = "#000"; // Black text
      context.font = " 30px NotoSansLao";
      let itemYPosition = headerHeight + 40; // Starting Y position for items with margin

      items.forEach((item) => {
        // Combine the item name and menuOptions into a single line
        let itemText = `- ${item.name} (x ${item.quantity})`;

        // If the item has options, append them in square brackets
        if (item.options && item.options.length > 0) {
          const optionsText = item.options
            .map((option) => `[${option.name} x ${option.quantity}]`)
            .join(" "); // Concatenate options
          itemText += ` ${optionsText}`; // Append options to the item name
        }

        // Wrap and draw the item name and options with margin
        const itemMaxWidth = 490; // Set a max width for wrapping
        wrapText(
          context,
          itemText,
          titleMargin,
          itemYPosition,
          itemMaxWidth,
          40
        ); // Call wrapText to draw the text

        // Update Y position after wrapping
        const wrappedLines = Math.ceil(
          context.measureText(itemText).width / itemMaxWidth
        );
        itemYPosition += wrappedLines * 40; // Increase Y position based on wrapped lines
      });

      // Draw the dotted line
      context.strokeStyle = "#000"; // Black dotted line
      context.setLineDash([4, 2]); // Dotted line style
      context.beginPath();
      context.moveTo(0, itemYPosition + 10); // Just below the last item
      context.lineTo(width, itemYPosition + 10); // Across the canvas width
      context.stroke();

      // Footer with Date and Time
      const footerYPosition = itemYPosition + 40; // Adjust position closer to the dotted line
      context.setLineDash([]); // Reset line style
      context.font = "bold 24px NotoSansLao";
      context.fillText(
        `${moment(data.createdAt).format("DD/MM/YY")} | ${moment(
          data.createdAt
        ).format("LT")}`,
        width - 200,
        footerYPosition
      ); // Date and time

      // Convert canvas to base64
      const dataUrl = canvas.toDataURL("image/png");
      base64ArrayAndPrinter.push({ dataUrl, printer });
    }
  });

  return base64ArrayAndPrinter;
};

// const runPrint = async (dataUrl, index, printer) => {
//   try {
//     const printFile = base64ToBlob(dataUrl);
//     var bodyFormData = new FormData();

//     bodyFormData.append("ip", printer?.ip);
//     if (index === 0) {
//       bodyFormData.append("beep1", 1);
//       bodyFormData.append("beep2", 9);
//     }
//     bodyFormData.append("isdrawer", false);
//     bodyFormData.append("port", "9100");
//     bodyFormData.append("image", printFile);
//     bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

//     let urlForPrinter = "";
//     if (printer?.type === "ETHERNET") urlForPrinter = ETHERNET_PRINTER_PORT;
//     if (printer?.type === "BLUETOOTH") urlForPrinter = BLUETOOTH_PRINTER_PORT;
//     if (printer?.type === "USB") urlForPrinter = USB_PRINTER_PORT;

//     await printFlutter(
//       {
//         imageBuffer: dataUrl,
//         ip: printer?.ip,
//         type: printer?.type,
//         port: "9100",
//         width: printer?.width === "58mm" ? 400 : 580,
//       },
//       async () => {
//         await axios({
//           method: "post",
//           url: urlForPrinter,
//           data: bodyFormData,
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//     );
//     return true;
//   } catch {
//     return false;
//   }
// };

// const convertHtmlToBase64 = (orderSelect) => {
//   const base64ArrayAndPrinter = [];

//   orderSelect.forEach((data, index) => {
//     if (data) {
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");

//       // Define canvas dimensions based on the image layout you want to replicate
//       const width = 510;
//       const height = 290;
//       canvas.width = width;
//       canvas.height = height;

//       // Set white background
//       context.fillStyle = "#fff";
//       context.fillRect(0, 0, width, height);

//       // Draw the Table ID (left black block)
//       context.fillStyle = "#000"; // Black background
//       context.fillRect(0, 0, width / 2, 60); // Black block width / 2
//       context.fillStyle = "#fff"; // White text
//       context.font = "bold 36px NotoSansLao";
//       context.fillText(data?.tableId?.name || selectedTable?.name, 10, 45); // Table ID text

//       // Draw the Table Code (right side)
//       context.fillStyle = "#000"; // Black text
//       context.font = "bold 30px NotoSansLao";
//       context.fillText(data?.code || selectedTable?.code, width - 220, 44); // Code text on the right

//       // Draw Item Name and Quantity
//       context.fillStyle = "#000"; // Black text
//       context.font = "bold 40px NotoSansLao";
//       context.fillText(`${data?.name} (${data?.quantity})`, 10, 110); // Item name

//       // Draw Item Name and Quantity
//       context.fillStyle = "#000"; // Black text
//       context.font = "24px NotoSansLao";
//       context.fillText(`${data?.note}`, 10, 150); // Item name

//       // Draw Price and Quantity
//       context.font = "28px NotoSansLao";
//       context.fillText(
//         `${moneyCurrency(data?.price + (data?.totalOptionPrice ?? 0))} x ${
//           data?.quantity
//         }`,
//         20,
//         210
//       ); // Price and quantity

//       // Draw the dotted line
//       context.strokeStyle = "#000"; // Black dotted line
//       context.setLineDash([4, 2]); // Dotted line style
//       context.beginPath();
//       context.moveTo(0, 230); // Start at (20, 150)
//       context.lineTo(width, 230); // End at (width - 20, 150)
//       context.stroke();

//       // Draw Footer (Created By and Date)
//       context.setLineDash([]); // Reset line style
//       context.font = "bold 24px NotoSansLao";
//       context.fillText(
//         data?.createdBy?.firstname || data?.updatedBy?.firstname || "lailaolab",
//         20,
//         260
//       ); // Created by name

//       context.fillStyle = "#6e6e6e"; // Black text
//       context.font = "22px NotoSansLao";
//       context.fillText(
//         `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
//           data?.createdAt
//         ).format("LT")}`,
//         width - 180,
//         260
//       ); // Date and time

//       // Convert canvas to base64
//       const dataUrl = canvas.toDataURL("image/png");

//       const printer = printers.find((e) => e?._id === data?.printer);
//       if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
//     }
//   });

//   return base64ArrayAndPrinter;
// };
