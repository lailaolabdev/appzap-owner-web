import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers"; // Adjust the import path based on your project structure
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants/index"; // Adjust the import path based on your project structure

export const printItems = async (groupedItems, combinedBillRefs, printers) => {
  for (const [printerIp, items] of Object.entries(groupedItems)) {
    const _printer = printers.find((e) => e?.ip === printerIp);

    if (!_printer) {
      console.error(`No printer found with IP: ${printerIp}`);
      continue;
    }

    const element = combinedBillRefs[printerIp]?.current;

    if (!element) {
      console.error(`No element found for printer IP: ${printerIp}`);
      continue;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
      });

      const dataUrl = canvas.toDataURL();
      const _file = await base64ToBlob(dataUrl);

      let urlForPrinter = "";
      if (_printer?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      } else if (_printer?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      } else if (_printer?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }

      const bodyFormData = new FormData();
      bodyFormData.append("ip", _printer?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);

      console.log(`PREPARE TO SEND TO PRINTER: ${printerIp}`);

      // Send the request without handling response
      try {
        await axios.post(urlForPrinter, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (postError) {
        console.error(
          `Failed to send print request to printer ${printerIp}:`,
          postError
        );
        continue; // Continue to the next iteration if an error occurs
      }
    } catch (err) {
      console.error(`Failed to print items for printer ${printerIp}:`, err);
    }
  }
};
