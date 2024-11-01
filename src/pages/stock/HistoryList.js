import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav, Spinner } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { CATEGORY, getLocalData, END_POINT_SEVER } from "../../constants/api";
import NavList from "./components/NavList";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { stockType } from "../../helpers/stockType";
import useQuery, { ObjectToQuery } from "../../helpers/useQuery";
import { useTranslation } from "react-i18next";

export default function Historylist() {
	const { t } = useTranslation();
	const { id, _page } = useParams();
	// state
	const [getTokken, setgetTokken] = useState();
	const [histories, setHistories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const query = useQuery();
	const navigate = useNavigate();
	const LIMIT_PAGE = 20;
	const pageNumber = Number.parseInt(query?.page || "1");
	const limit = 20;
	const skip = (pageNumber - 1) * limit;
	const filterSearch = query?.search;
	const [pageCountNumber, setPageCountNumber] = useState(1000);

	useEffect(() => {
		const fetchData = async () => {
			const _localData = await getLocalData();
			if (_localData) {
				setgetTokken(_localData);
				getData(_localData?.DATA?.storeId);
			}
		};
		fetchData();
	}, [limit, skip]);

	console.log("check limit:--->", limit, skip);

	const getData = async (id) => {
		setHistories([]);
		setIsLoading(true);
		const filter = {};
		if (skip) filter.skip = skip;
		if (limit) filter.limit = limit;
		const _resHistory = await axios({
			method: "get",
			url:
				END_POINT_SEVER +
				`/v3/stock-histories?storeId=${id}&limit=${limit}&skip=${filter.skip}`,
		});
		setHistories(_resHistory?.data);
		setIsLoading(false);
	};

	const onNextPage = () => {
		navigate(
			ObjectToQuery({
				...query,
				page: Number.parseInt(query?.page || "1") + 1,
			}),
		);
	};
	const onBackPage = () => {
		if (Number.parseInt(query?.page) <= 1) return;
		if (!query?.page) return; // page === undefined
		navigate(
			ObjectToQuery({
				...query,
				page: Number.parseInt(query?.page || "1") - 1,
			}),
		);
	};

	return (
		<div style={BODY}>
			<NavList ActiveKey="/settingStore/stock/history" />
			<div>
				<div style={{ height: 20 }}></div>
				<div>
					<div className="col-sm-12" style={{ overflowX: "auto" }}>
						<table className="table table-hover">
							<thead className="thead-light">
								<tr>
									<th style={{ textWrap: "nowrap" }} scope="col">
										#
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										{t("stock_list")}
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										{t("type")}
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										{t("amount")}
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										{t("date")}
									</th>
								</tr>
							</thead>
							<tbody>
								{histories &&
									histories.map((data, index) => {
										return (
											<tr>
												{/* <td>{index + 1}</td> */}
												<td style={{ textWrap: "nowrap" }}>
													{(pageNumber - 1) * LIMIT_PAGE + index + 1}
												</td>
												<td style={{ textWrap: "nowrap" }}>
													{data?.stockId?.name}
												</td>
												<td style={{ textWrap: "nowrap" }}>
													{stockType(data?.type)}
												</td>
												<td style={{ textWrap: "nowrap" }}>{data?.quantity}</td>
												<td style={{ textWrap: "nowrap" }}>
													{moment(data?.createdAt).format("DD/MM/YYYY")}
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{isLoading ? <Spinner animation="border" /> : ""}
						</div>
						{!isLoading ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<button className="appzap_button" onClick={() => onBackPage()}>
									{t("previous")}
								</button>
								<p style={{ margin: "5px 1rem" }}>
									{pageNumber} / {pageCountNumber}
								</p>
								<button className="appzap_button" onClick={() => onNextPage()}>
									{t("next")}
								</button>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
