// src/helpers/orderHelpers.js

import { base64ToBlob, moneyCurrency } from "../../helpers"; // assuming moneyCurrency and base64ToBlob are helpers you already have
import moment from "moment";
import  printFlutter  from "../../helpers/printFlutter";
import axios from "axios";
import { ETHERNET_PRINTER_PORT, BLUETOOTH_PRINTER_PORT, USB_PRINTER_PORT } from "../../constants/index";

export const renderOptions = (options) => {
    return options && options.length > 0
      ? options.map((option, index) => (
          <span key={index}>[{option.name}]</span>
        ))
      : null;
  };

  
export const groupItemsByPrinter = (items, printers) => {
  if (!items || !Array.isArray(items) || items.length === 0) return {};
  if (!Array.isArray(printers) || printers.length === 0) return {};

  const printerMap = printers.reduce((acc, printer) => {
    if (printer?._id && printer?.ip) {
      acc[printer._id] = printer.ip;
    }
    return acc;
  }, {});

  return items.reduce((printerGroups, item) => {
    const printerIp = printerMap[item.printer] || "unknown";
    if (!printerGroups[printerIp]) {
      printerGroups[printerIp] = {};
    }

    const tableId = item?.tableId;
    const code = item?.code;

    if (tableId && !printerGroups[printerIp][tableId]) {
      printerGroups[printerIp][tableId] = {};
    }
    if (code && !printerGroups[printerIp][tableId]?.[code]) {
      printerGroups[printerIp][tableId][code] = [];
    }

    if (tableId && code) {
      printerGroups[printerIp][tableId][code].push(item);
    }

    return printerGroups;
  }, {});
};

export const convertHtmlToBase64 = (orderSelect, printers, storeDetail, totalText, currencyLabel) => {
  const base64ArrayAndPrinter = [];
  orderSelect.forEach((data, index) => {
    if (data) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const baseHeight = 250;
      const extraHeightPerOption = 30;
      const extraHeightForNote = data?.note ? 40 : 0;
      const dynamicHeight =
        baseHeight +
        (data.options?.length || 0) * extraHeightPerOption +
        extraHeightForNote;
      const width = 510;

      canvas.width = width;
      canvas.height = dynamicHeight;

      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, dynamicHeight);

      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " ";
          let metrics = context.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
        return y + lineHeight;
      }

      context.fillStyle = "#000";
      context.fillRect(0, 0, width / 2, 60);
      context.fillStyle = "#fff";
      context.font = "bold 36px NotoSansLao, Arial, sans-serif";
      context.fillText(data?.tableId?.name, 10, 45);

      context.fillStyle = "#000";
      context.font = "bold 30px NotoSansLao, Arial, sans-serif";
      context.fillText(data?.code, width - 220, 45);

      context.strokeStyle = "#ccc";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, 65);
      context.lineTo(width, 65);
      context.stroke();

      context.fillStyle = "#000";
      context.font = "bold 34px NotoSansLao, Arial, sans-serif";
      let yPosition = 100;
      yPosition = wrapText(
        context,
        `${data?.name} (${data?.quantity})`,
        10,
        yPosition,
        width - 20,
        36
      );

      if (data?.note) {
        const noteLabel = "note: ";
        const noteText = data.note;
        context.fillStyle = "#666";
        context.font = " bold italic bold 24px Arial, sans-serif";
        context.fillText(noteLabel, 10, yPosition);

        const noteLabelWidth = context.measureText(noteLabel).width;
        context.font = "bold italic 24px Arial, sans-serif";
        yPosition = wrapText(
          context,
          noteText,
          10 + noteLabelWidth,
          yPosition,
          width - 20 - noteLabelWidth,
          30
        );

        yPosition += 10;
      }

      if (data.options && data.options.length > 0) {
        context.fillStyle = "#000";
        context.font = "24px NotoSansLao, Arial, sans-serif";
        data.options.forEach((option, idx) => {
          const optionPriceText = option?.price
            ? ` - ${moneyCurrency(option?.price)}`
            : "";
          const optionText = `- ${option?.name}${optionPriceText} x ${
            option?.quantity || 1
          }`;
          yPosition = wrapText(
            context,
            optionText,
            10,
            yPosition,
            width - 20,
            30
          );
        });

        context.strokeStyle = "#ccc";
        context.setLineDash([4, 2]);
        context.beginPath();
        context.moveTo(0, yPosition);
        context.lineTo(width, yPosition);
        context.stroke();
        context.setLineDash([]);
        yPosition += 20;
      }

      context.fillStyle = "#000";
      context.font = " 24px NotoSansLao, Arial, sans-serif";
      yPosition = wrapText(
        context,
        `${totalText} ${moneyCurrency(
          data?.price + (data?.totalOptionPrice ?? 0)
        )} ${currencyLabel}`,
        10,
        yPosition,
        width - 20,
        46
      );

      context.fillStyle = "#000";
      context.font = "28px NotoSansLao, Arial, sans-serif";
      context.textAlign = "right";
      context.textBaseline = "bottom";
      context.fillText(
        `${data?.deliveryCode ? `(DC : ${data?.deliveryCode})` : ""}`,
        width - 10,
        dynamicHeight - 86
      );

      context.strokeStyle = "#000";
      context.setLineDash([4, 2]);
      context.beginPath();
      context.moveTo(0, dynamicHeight - 70);
      context.lineTo(width, dynamicHeight - 70);
      context.stroke();
      context.setLineDash([]);

      context.font = "bold 24px NotoSansLao, Arial, sans-serif";
      context.fillStyle = "#000";
      context.textAlign = "left";
      context.fillText(
        data?.createdBy?.firstname || data?.updatedBy?.firstname || "",
        10,
        dynamicHeight - 20
      );

      context.textAlign = "right";
      context.fillStyle = "#6e6e6e";
      context.font = "22px NotoSansLao, Arial, sans-serif";
      context.fillText(
        `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
          data?.createdAt
        ).format("LT")}`,
        width - 10,
        dynamicHeight - 20
      );

      const dataUrl = canvas.toDataURL("image/png");
      const printer = printers.find((e) => e?._id === data?.printer);
      if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
    }
  });

  return base64ArrayAndPrinter;
};

export const runPrint = async (dataUrl, index, printer) => {
  try {
    const printFile = base64ToBlob(dataUrl);
    var bodyFormData = new FormData();

    bodyFormData.append("ip", printer?.ip);
    if (index === 0) {
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
    }
    bodyFormData.append("isdrawer", false);
    bodyFormData.append("port", "9100");
    bodyFormData.append("image", printFile);
    bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

    let urlForPrinter = "";
    if (printer?.type === "ETHERNET") urlForPrinter = ETHERNET_PRINTER_PORT;
    if (printer?.type === "BLUETOOTH") urlForPrinter = BLUETOOTH_PRINTER_PORT;
    if (printer?.type === "USB") urlForPrinter = USB_PRINTER_PORT;

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
    return true;
  } catch {
    return false;
  }
};
