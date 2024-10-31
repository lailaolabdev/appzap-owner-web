import React, { useState, useRef, useMemo, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import Swal from "sweetalert2";
import axios from "axios";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

/**
 * import components
 */
// import OrderNavbar from "./component/OrderNavbar";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";

import { orderStatus } from "../../helpers";
import { WAITING_STATUS } from "../../constants";
import { useStore } from "../../store";
import empty from "../../image/empty.png";
import ReactAudioPlayer from "react-audio-player";
import Notification from "../../vioceNotification/ding.mp3";
// import { socket } from "../../services/socket";

export default function WaitingOrderTab() {
	const { t } = useTranslation();
	const {
		soundPlayer,
		orderItems,
		getOrderItemsStore,
		handleCheckbox,
		checkAllOrders,
		setNewOrderTransaction,
		setNewOrderUpdateStatusTransaction,
		newOrderTransaction,
		newOrderUpdateStatusTransaction,
		getOrderWaitingAndDoingByStore,
	} = useStore();
	/**
	 * Initial Component
	 */
	const { storeDetail, selectOrderStatus, setSelectOrderStatus } = useStore();
	const { printers, selectedTable } = useStore();
	const billForCher80 = useRef([]);
	const billForCher58 = useRef([]);

	return (
		<RootStyle>
			<div>
				<div>
					<ReactAudioPlayer src={Notification} ref={soundPlayer} />
				</div>
				<div style={{ overflowX: "auto" }}>
					<TableCustom responsive>
						<thead>
							<tr style={{
								backgroundColor:'white',
								borderBottom:'3px solid black',
								}} >
								<th>
									<FormControlLabel
										control={
											<Checkbox
												name="checkedC"
												onChange={(e) => checkAllOrders(e)}
											/>
										}
										style={{ marginLeft: 2 }}
									/>
								</th>
								{/* <th style={{ textWrap: "nowrap" }}>{t("no")}</th> */}
								<th style={{ textWrap: "nowrap" }}>{t("menu_name")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("amount")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("from_table")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("table_code")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("status")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("status")}</th>
								<th style={{ textWrap: "nowrap" }}>{t("commend")}</th>
							</tr>
						</thead>
						<tbody>
							{orderItems?.map((order, index) => {
								return (
									<tr key={index}>
										<td>
											<Checkbox
												checked={order?.isChecked ? true : false}
												onChange={(e) => handleCheckbox(order)}
												color="primary"
												inputProps={{ "aria-label": "secondary checkbox" }}
											/>
										</td>
										{/* <td>{index + 1} </td> */}
										<td style={{ fontWeight: "bold", textWrap: "nowrap" }}>
											{order?.name ?? "-"}{" "}
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											{order?.quantity ?? "-"}{" "}
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											{order?.tableId?.name ?? "-"}
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											{order?.code ?? "-"}{" "}
										</td>
										<td
											style={{
												color: "red",
												fontWeight: "bold",
												textWrap: "nowrap",
											}}
										>
											{order?.status ? orderStatus(order?.status) : "-"}
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											{order?.createdAt
												? moment(order?.createdAt).format("HH:mm ")
												: "-"}{" "}
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											{order?.note ?? "-"}{" "}
										</td>
									</tr>
								);
							})}
						</tbody>
					</TableCustom>
				</div>
			</div>
		</RootStyle>
	);
}

const RootStyle = styled("div")({
	padding: 10,
});

const TableCustom = styled("table")({
	width: "100%",
	fontSize: 18,
	["th,td"]: {
		padding: 0,
	},
	["th:first-child"]: {
		maxWidth: 40,
		width: 40,
	},
	["td:first-child"]: {
		maxWidth: 40,
		width: 40,
	},
	["tr:nth-child(2n+0)"]: {
		backgroundColor: "#ffe9d8",
	},
	thead: {
		backgroundColor: "#ffd6b8",
	},
});
