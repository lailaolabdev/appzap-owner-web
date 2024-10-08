import React, { useCallback, useEffect, useState } from "react";
// import useReactRouter from "use-react-router"
import { Nav } from "react-bootstrap";
import moment from "moment";
import { getHeaders } from "../../services/auth";
import { END_POINT_SEVER } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCertificate,
	faCoins,
	faPeopleArrows,
	faPrint,
	faTable,
	faHistory 
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingAppzap from "../../components/LoadingAppzap";
import PaginationAppzap from "../../constants/PaginationAppzap";
import { useTranslation } from "react-i18next";

export default function HistoryUse() {
	const { t } = useTranslation();
	// const { history, location, match } = useReactRouter();
	const params = useParams();
	const [data, setData] = useState([]);
	const [totalLogs, setTotalLogs] = useState();
	const [filtterModele, setFiltterModele] = useState("checkBill");

	const [isLoading, setIsLoading] = useState(false);

	const rowsPerPage = 100;
	const [page, setPage] = useState(0);
	const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;
	const handleChangePage = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	useEffect(() => {
		_getdataHistories();
	}, []);
	useEffect(() => {
		_getdataHistories();
	}, [page]);

	useEffect(() => {
		_getdataHistories();
	}, [filtterModele]);
	const _getdataHistories = async () => {
		try {
			const headers = await getHeaders();
			setIsLoading(true);

			let apiUrl = `${END_POINT_SEVER}/v3/logs/skip/${page * rowsPerPage}/limit/${rowsPerPage}?storeId=${params?.id}&modele=${filtterModele}`;

			if(filtterModele ==='historyServiceChange'){
				apiUrl = `${END_POINT_SEVER}/saveservice`; 
			}

			const res = await axios.get(apiUrl
				,{ headers },
			);
			

			if (res?.status < 300) {
				setData(res?.data?.data);
				setTotalLogs(res?.data?.total);
				console.log(data)
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	const formatNumber = (num) => {
		if (typeof num !== 'number' || isNaN(num)) {
			return '-'; // return a default value if num is invalid
		}
		return num.toLocaleString('en-US').replace(/,/g, '.');
	};
	

	return (
		<div>
			<div>
				<Nav
					fill
					variant="tabs"
					defaultActiveKey="/checkBill"
					style={{
						fontWeight: "bold",
						backgroundColor: "#f8f8f8",
						border: "none",
						// height: 60,
						marginBottom: 5,
						overflowX: "scroll",
						display: "flex",
					}}
				>
					<Nav.Item>
						<Nav.Link
							eventKey="/checkBill"
							style={{
								color: "#FB6E3B",
								border: "none",
								height: 60,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={() => setFiltterModele("checkBill")}
						>
							{" "}
							<FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
							<div style={{ width: 8 }}></div> {t("calculate_money")}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="/canceled"
							style={{
								color: "#FB6E3B",
								border: "none",
								height: 60,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={() => setFiltterModele("canceled")}
						>
							<FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>{" "}
							<div style={{ width: 8 }}></div> {t("order_history")}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="/print"
							style={{
								color: "#FB6E3B",
								border: "none",
								height: 60,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={() => setFiltterModele("print")}
						>
							<FontAwesomeIcon icon={faPrint}></FontAwesomeIcon>{" "}
							<div style={{ width: 8 }}></div> {t("printer")}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="/resetBill"
							style={{
								color: "#FB6E3B",
								border: "none",
								height: 60,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={() => setFiltterModele("resetBill")}
						>
							<FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>{" "}
							<div style={{ width: 8 }}></div> {t("edit_bill")}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="/transferTable"
							style={{
								color: "#FB6E3B",
								border: "none",
								height: 60,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={() => setFiltterModele("transferTable")}
						>
							<FontAwesomeIcon icon={faPeopleArrows}></FontAwesomeIcon>{" "}
							<div style={{ width: 8 }}></div> {t("change_combine_table")}
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
                        <Nav.Link
                            eventKey="/historyServiceChange"
                            style={{
                                color: "#FB6E3B",
                                border: "none",
                                height: 60,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onClick={() => setFiltterModele("historyServiceChange")}
                        >
                            <FontAwesomeIcon icon={faHistory}></FontAwesomeIcon>{" "}
                            <div style={{ width: 8 }}></div> {t("history service change")}
                        </Nav.Link>
                    </Nav.Item>

				</Nav>
			</div>
			{isLoading ? (
				<LoadingAppzap />
			) : (
				<div
					className="col-sm-12"
					style={{
						overflowX: "auto",
					}}
				>
					<table className="table table-hover">
						<thead className="thead-light">
							<tr>
								<th style={{ textWrap: "nowrap" }} scope="col">
									{t("no")}
								</th>
								<th style={{ textWrap: "nowrap" }} scope="col">
									{ filtterModele  === "historyServiceChange" ?"ຊື່ແລະນາມສະກຸນ" :t("manager_name")}
								</th>
								<th style={{ textWrap: "nowrap" }} scope="col">
									{filtterModele == "historyServiceChange" ? "ຍອດລວມ" :t("cause") }
								</th>
								<th style={{ textWrap: "nowrap" }} scope="col">
								{ filtterModele  === "historyServiceChange" ?`Service change ${""}` :t("detial")}
								</th>
								{filtterModele === 'historyServiceChange' && (
									<th style={{ textWrap: "nowrap" }} scope="col">ຍອດລວມ + ພາສີ  </th>
								)}
								<th style={{ textWrap: "nowrap" }} scope="col">
									{t("date_time")}
								</th>
							</tr>
						</thead>

						<tbody>
							{data?.map((item, index) => {
								return (
									<tr key={index}>
										<td style={{ textWrap: "nowrap" }}>
											{page * rowsPerPage + index + 1}
										</td>
										{filtterModele === 'historyServiceChange' 
										? (<td style={{ textWrap: "nowrap" }}>{item.firstName} {item.lastName}</td>)
									    : (<td style={{ textWrap: "nowrap" }}>{item?.user}</td>) }
										{/* <td
                      style={{
                        color: item?.event === "INFO" ? "green" : "red",
                      }}
                    >
					{item?.event}
                    </td> */}
					                    <td style={{ textWrap: "nowrap" }}>
					                    	{filtterModele == 'historyServiceChange'?
					                    	` ${formatNumber(item.total)} ກີບ, `
					                    	: (item?.reason === null ||
					                    	item?.reason === "" ||
					                    	item?.reason === undefined ||
					                    	item?.reason === "undefined" ||
					                    	item?.reason === "null"
					                    		? "-"
					                    		: item?.reason)}
					                    </td>
										<td style={{ textWrap: "nowrap" }}>
										{filtterModele === 'historyServiceChange'?
										    ` ${formatNumber(item.serviceChangeAmount )} ກີບ `:""}
										</td>
										{filtterModele === 'historyServiceChange' && (
                                            <td style={{ textWrap: "nowrap" }}>
                                               { formatNumber( item.totalMustPay) } ກີບ 
                                            </td>
                                        )}
										<td style={{ textWrap: "nowrap" }}>
											{moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					<PaginationAppzap
						rowsPerPage={rowsPerPage}
						page={page}
						pageAll={pageAll}
						onPageChange={handleChangePage}
					/>
				</div>
			)}
		</div>
	);
}
