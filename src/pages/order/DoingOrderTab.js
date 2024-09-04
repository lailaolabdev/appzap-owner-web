import React, { useState, useMemo, useRef, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import moment from "moment";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as _ from "lodash";
import empty from "../../image/empty.png";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

/**
 * import components
 */

import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
// import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
// import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
/**
 * import function
 */
// import { getOrders, updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { SERVE_STATUS, END_POINT, DOING_STATUS } from "../../constants";
import { useStore } from "../../store";
import { socket } from "../../services/socket";

const DoingOrderTab = () => {
	const { t } = useTranslation();
	// if (billForCher80.current.length !== arrLength) {
	//   // add or remove refs
	//   billForCher80.current = Array(arrLength)
	//     .fill()
	//     .map((_, i) => billForCher80.current[i]);
	// }
	// if (billForCher58.current.length !== arrLength) {
	//   // add or remove refs
	//   billForCher58.current = Array(arrLength)
	//     .fill()
	//     .map((_, i) => billForCher58?.current[i]);
	// }
	const { storeDetail } = useStore();
	const storeId = storeDetail._id;
	/**
	 * routes
	 */

	const {
		orderItems,
		getOrderItemsStore,
		handleCheckbox,
		checkAllOrders,
		handleUpdateOrderStatus,
		newOrderTransaction,
		getOrderWaitingAndDoingByStore,
	} = useStore();

	return (
		<div>
			{/* <OrderNavbar /> */}
			{orderItems?.length > 0 ? (
				<div>
					<div
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							display: "flex",
							paddingTop: 15,
							paddingLeft: 15,
							paddingRight: 15,
						}}
					>
						<div
							style={{
								alignItems: "end",
								flexDirection: "column",
								display: "flex",
								justifyContent: "center",
							}}
						>
							{/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }} >ເລືອກທັງໝົດ</div>} /> */}
						</div>
						{/* <div>
            <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(SERVE_STATUS, match?.params?.id)}>ເສີບແລ້ວ</Button>
          </div> */}
					</div>
					{/* <div>
            <button
              style={{
                backgroundColor: "#FB6E3B",
                color: "#fff",
                border: "1px solid #FB6E3B",
                height: "40px",
                margin: "10px",
              }}
              onClick={() => onPrintForCher()}
            >
              ພິມບິນໄປຄົວ
            </button>
          </div> */}
					<Container
						style={{
							overflowX: "auto",
						}}
						fluid
						className="mt-3"
					>
						<TableCustom
							responsive
							className="staff-table-list borderless table-hover"
						>
							<thead>
								<tr>
									<th>
										<FormControlLabel
											control={
												<Checkbox
													name="checkedC"
													onChange={(e) => checkAllOrders(e)}
													style={{ marginLeft: 10 }}
												/>
											}
										/>
									</th>

									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("no")}
									</th>
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("menu_name")}
									</th>
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("amount")}
									</th>
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("from_table")}
									</th>
									{/* <th>ລະຫັດໂຕະ</th> */}
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("status")}
									</th>
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("time")}
									</th>
									<th
										style={{
											textWrap: "nowrap",
										}}
									>
										{t("commend")}
									</th>
								</tr>
							</thead>
							<tbody>
								{orderItems?.map((order, index) => (
									<tr key={index}>
										<td>
											<Checkbox
												checked={order?.isChecked ? true : false}
												onChange={(e) => handleCheckbox(order)}
												color="primary"
												inputProps={{ "aria-label": "secondary checkbox" }}
											/>
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>{index + 1}</p>
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>{order?.name ?? "-"}</p>
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p>
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>{order?.tableId?.name ?? "-"}</p>
										</td>
										{/* <td>
                        <p style={{ margin: 0 }}>{order?.code ?? "-"}</p>
                      </td> */}
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>
												{order?.status ? orderStatus(order?.status) : "-"}
											</p>
										</td>

										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>
												{order?.createdAt
													? moment(order?.createdAt).format("HH:mm a")
													: "-"}
											</p>
										</td>
										<td
											style={{
												textWrap: "nowrap",
											}}
										>
											<p style={{ margin: 0 }}>{order?.note ?? "-"}</p>
										</td>
									</tr>
								))}
							</tbody>
						</TableCustom>
					</Container>
				</div>
			) : (
				<Image src={empty} alt="" width="100%" />
			)}
		</div>
	);
};

export default DoingOrderTab;

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
