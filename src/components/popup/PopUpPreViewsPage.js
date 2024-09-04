import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { URL_PHOTO_AW3 } from "../../constants";
import html2canvas from "html2canvas";
import {
	BLUETOOTH_PRINTER_PORT,
	ETHERNET_PRINTER_PORT,
	USB_PRINTER_PORT,
} from "../../constants";
import Swal from "sweetalert2";
import axios from "axios";
import { useStore } from "../../store";
import { base64ToBlob } from "../../helpers";
import { useTranslation } from "react-i18next";
import printFlutter from "../../helpers/printFlutter";

export default function PopUpPreViewsPage({ onClose, open, datas, storeData }) {
	const { t } = useTranslation();
	const billRef = useRef(null);

	const [selectPrinter, setSelectPrinter] = useState();

	const { printerCounter, printers } = useStore();

	useEffect(() => {
		console.log("datas: ", datas);
	}, [open]);

	//todo function
	const billPrint = async () => {
		try {
			let urlPrinter = "";
			const _printerCounters = JSON.parse(printerCounter?.prints);
			const printerBillData = printers?.find(
				(e) => e?._id === _printerCounters?.BILL,
			);

			const imageFormater = await html2canvas(billRef.current, {
				useCORS: true,
				scrollX: 10,
				scrollY: 0,
				scale: 1,
			});

			urlPrinter = USB_PRINTER_PORT;

			const myPrinter = JSON.parse(selectPrinter);

			if (myPrinter?.type === "ETHERNET") {
				urlPrinter = ETHERNET_PRINTER_PORT;
			}
			if (myPrinter?.type === "BLUETOOTH") {
				urlPrinter = BLUETOOTH_PRINTER_PORT;
			}
			if (myPrinter?.type === "USB") {
				urlPrinter = USB_PRINTER_PORT;
			}

      const _file = await base64ToBlob(imageFormater.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", myPrinter?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      await printFlutter(
        {
          imageBuffer: imageFormater.toDataURL(),
          ip: myPrinter?.ip,
          type: myPrinter?.type,
          port: "9100",
          width: myPrinter?.width === "58mm" ? 400 : 580,
          beap: 1,
        },
        async () => {
          await axios({
            method: "post",
            url: urlPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );
      // await axios({
      //   method: "post",
      //   url: urlPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" }
      // });
      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

	return (
		<Modal show={open} onHide={onClose} centered>
			<div ref={billRef}>
				<Modal.Body>
					<div className="d-flex justify-content-center align-items-center flex-column">
						<div>
							<img
								style={{
									height: 80,
									width: 80,
									borderRadius: "50%",
								}}
								src={URL_PHOTO_AW3 + storeData?.image}
							/>
						</div>
						<h2>{storeData?.name}</h2>
						<p>
							{t("tel")}: {storeData?.phone}
						</p>
					</div>
					<div>
						<Table
							className="text-center"
							style={{ border: "1.5px solid #000" }}
						>
							<thead>
								<tr>
									<th
										style={{
											border: "1.5px solid #000",
											textAlign: "center",
										}}
									>
										{t("no")}
									</th>
									<th
										style={{
											border: "1.5px solid #000",
											textAlign: "center",
										}}
									>
										{t("type")}
									</th>
									<th
										style={{
											border: "1.5px solid #000",
											textAlign: "center",
										}}
									>
										{t("product_name")}
									</th>
									<th
										style={{
											border: "1.5px solid #000",
											textAlign: "center",
										}}
									>
										{t("amount_unit")}
									</th>
								</tr>
							</thead>
							<tbody>
								{datas.map((item, index) => (
									<tr key={index}>
										<td
											style={{
												padding: "4px 2px",
												textAlign: "center",
												border: "1.5px solid #000",
											}}
										>
											{index + 1}
										</td>
										<td
											style={{
												padding: "4px 2px",
												textAlign: "center",
												border: "1.5px solid #000",
											}}
										>
											{item?.stockCategoryId?.name}
										</td>
										<td
											style={{
												padding: "4px 2px",
												textAlign: "center",
												border: "1.5px solid #000",
											}}
										>
											{item?.name}
										</td>
										<td
											style={{
												padding: "4px 2px",
												textAlign: "center",
												border: "1.5px solid #000",
											}}
										>
											{item?.quantity} {item?.unit}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				</Modal.Body>
			</div>
			<Modal.Footer>
				<Form.Group style={{ display: "flex", gap: 10 }}>
					<Form.Control
						as="select"
						name="width"
						onChange={(e) => setSelectPrinter(e.target.value)}
					>
						{printers?.map((e) => (
							<option value={JSON.stringify(e)}>{e?.name}</option>
						))}
					</Form.Control>
					<Button
						className="w-100"
						onClick={() => {
							billPrint();
							onClose();
						}}
					>
						{t("print_bill")}
					</Button>
				</Form.Group>
			</Modal.Footer>
		</Modal>
	);
}
