import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import BillForReport80 from "./BillForReport80";
import Swal from "sweetalert2";
import { base64ToBlob } from "../../helpers";
import html2canvas from "html2canvas";
import axios from "axios";
import { USB_PRINTER_PORT } from "../../constants";
import printFlutter from "../../helpers/printFlutter";
import { useStore } from "../../store";

export default function PrintTest() {
  const { printerCounter, printers } = useStore();
  let bill80Ref = useRef(null);
  const [widthBill80, setWidthBill80] = useState(0);
  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
  }, [bill80Ref]);
  const onPrintBill = async () => {
    try {
      let urlForPrinter = "";

      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      let dataImageForPrint = await html2canvas(bill80Ref.current, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 530 / widthBill80,
      });

      urlForPrinter = USB_PRINTER_PORT;

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: printerBillData.width === "58" ? 350 : 550,
          beep: 1,
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
      await Swal.fire({
        icon: "success",
        title: "ປິນສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "ປິນບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div>
      <div ref={bill80Ref} style={{ maxWidth: 330, width: 330 }}>
        <BillForReport80 />
      </div>
      <button onClick={onPrintBill}>Print</button>
    </div>
  );
}
