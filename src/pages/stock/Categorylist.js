import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { getLocalData, END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import NavList from "./components/NavList";
import PopUpAddCategory from "./components/popup/PopUpAddCategory";
import PopUpEditCategory from "./components/popup/PopUpEditCategory";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { getHeaders } from "../../services/auth";

export default function Categorylist() {
	// state
	const [popAddCategory, setPopAddCategory] = useState(false);
	const [popEditCategory, setPopEditCategory] = useState(false);
	const [popConfirmDeletion, setPopConfirmDeletion] = useState(false);
	const [select, setSelect] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [loadStatus, setLoadStatus] = useState("");

	const [Categorys, setCategorys] = useState([]);
	// functions
	const _confirmeDelete = async () => {
		try {
			const header = await getHeaders();
			const headers = {
				"Content-Type": "application/json",
				Authorization: header.authorization,
			};
			const _resData = await axios.delete(
				`${END_POINT_SEVER}/v3/stock-category/delete/${select?._id}`,
				{
					headers: headers,
				},
			);
			if (_resData?.data) {
				setCategorys(_resData?.data);
				successAdd("ລົບຂໍ້ມູນສຳເລັດ");
				setPopConfirmDeletion(false);
				getCategory();
			}
		} catch (err) {
			console.log("Error:", err);
			errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
		}
	};
	const getCategory = async () => {
		try {
			const { DATA } = await getLocalData();
			if (DATA) {
				setIsLoading(true);
				const data = await axios.get(
					`${END_POINT_SEVER}/v3/stock-categories?storeId=${DATA?.storeId}&isDeleted=false`,
				);
				if (data.status < 300) {
					setLoadStatus("SUCCESS");
					setCategorys(data.data);
				}
				setIsLoading(false);
			}
		} catch (err) {
			setLoadStatus("ERROR!!");
			setIsLoading(false);
			console.log("err:", err);
		}
	};
	// -------------------------------------------------------------------------- //
	useEffect(() => {
		const getData = async () => {
			getCategory();
		};
		getData();
	}, []);
	// -------------------------------------------------------------------------- //
	return (
		<div style={BODY}>
			<NavList ActiveKey="/settingStore/stock/category" />
			<div>
				<div className="col-sm-12 text-right">
					<Button
						className="col-sm-2"
						style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
						onClick={() => setPopAddCategory(true)}
					>
						ເພີ່ມປະເພດສະຕ໊ອກ
					</Button>
				</div>
				<div style={{ height: 20 }}></div>
				<div>
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
										#
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										ຊື່ປະເພດສະຕ໊ອກ
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										ໝາຍເຫດ
									</th>
									<th style={{ textWrap: "nowrap" }} scope="col">
										ຈັດການຂໍ້ມູນ
									</th>
								</tr>
							</thead>
							<tbody>
								{Categorys &&
									Categorys.map((data, index) => {
										return (
											<tr>
												<td style={{ textWrap: "nowrap" }}>{index + 1}</td>
												<td style={{ textWrap: "nowrap" }}>{data?.name}</td>
												<td style={{ textWrap: "nowrap" }}>{data?.note}</td>
												<td style={{ textWrap: "nowrap" }}>
													<FontAwesomeIcon
														icon={faEdit}
														style={{ color: COLOR_APP }}
														onClick={() => {
															setSelect(data);
															setPopEditCategory(true);
														}}
													/>
													<FontAwesomeIcon
														icon={faTrashAlt}
														style={{ marginLeft: 20, color: "red" }}
														onClick={() => {
															setSelect(data);
															setPopConfirmDeletion(true);
														}}
													/>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{isLoading ? <Spinner animation="border" /> : ""}
						</div>
					</div>
				</div>
			</div>
			{/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
			<PopUpAddCategory
				open={popAddCategory}
				onClose={() => setPopAddCategory(false)}
				callback={() => {
					successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
					getCategory();
				}}
			/>
			<PopUpEditCategory
				open={popEditCategory}
				onClose={() => setPopEditCategory(false)}
				callback={() => {
					successAdd("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
					getCategory();
				}}
				data={select}
			/>
			<PopUpConfirmDeletion
				open={popConfirmDeletion}
				onClose={() => setPopConfirmDeletion(false)}
				text={select?.name}
				onSubmit={_confirmeDelete}
			/>
			{/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
		</div>
	);
}
