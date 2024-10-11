import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers"; // Adjust the import path based on your project structure
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants/index"; // Adjust the import path based on your project structure
import printFlutter from "../../helpers/printFlutter";

export const printItems = async (groupedItems, combinedBillRefs, printers) => {
  for (const [printerIp, items] of Object.entries(groupedItems)) {
    const _printer = printers.find((e) => e?.ip === printerIp);

    if (!_printer) {
      console.error(`No printer found with IP: ${printerIp}`);
      continue; // Safe to use here because we're still inside the loop body
    }

    const element = combinedBillRefs[printerIp]?.current;

    if (!element) {
      console.error(`No element found for printer IP: ${printerIp}`);
      continue; // Safe here as well
    }

    try {
      // Create a canvas from the element
      const canvas = await html2canvas(element, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
      });

      // Convert canvas to base64 image
      const dataUrl = canvas.toDataURL();
      const _file = await base64ToBlob(dataUrl);

      // Determine printer URL based on type
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

      // Call printFlutter with the necessary parameters
      await printFlutter(
        {
          imageBuffer: dataUrl, // base64-encoded image
          ip: _printer?.ip,
          type: _printer?.type,
          port: "9100",

          width: _printer?.width === "58mm" ? 400 : 580, // Adjusting width based on printer paper size
        },
        async () => {
          // Fallback: Send the print request using axios if printFlutter succeeds
          try {
            await axios.post(urlForPrinter, bodyFormData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } catch (postError) {
            console.error(
              `Failed to send print request to printer ${printerIp}:`,
              postError
            );
            // Handle error but don't use continue here, just return out of the callback
            return; // Exit from the callback in case of an error, allowing the loop to continue
          }
        }
      );
    } catch (err) {
      console.error(`Failed to print items for printer ${printerIp}:`, err);
      continue; // Safe to use here, skips to the next printer in the loop
    }
  }
};
