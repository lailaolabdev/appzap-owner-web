import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../Box";
import { useTranslation } from "react-i18next";

export default function PopUpChooseCategoryTypeComponent({
	open,
	onClose,
	categoryData,
	setSelectedCategory,
}) {
	const { t } = useTranslation();
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

	const onSelectCategory = (categoryId) => {
		const _selectedTables = [...selectedCategoryIds];

		// Check if the categoryId is already selected
		const isTableSelected = _selectedTables.some(
			(table) => table === categoryId,
		);

		if (!isTableSelected) {
			// If the categoryId is not in the selectedCategoryIds array, add it
			setSelectedCategoryIds([..._selectedTables, categoryId]);
		} else {
			// If the categoryId is already selected, remove it
			const updatedSelectedCategoryIds = _selectedTables.filter(
				(table) => table !== categoryId,
			);
			setSelectedCategoryIds(updatedSelectedCategoryIds);
		}
	};

	const checkedCategory = (categoryId) => {
		return selectedCategoryIds.some((table) => table === categoryId);
	};

	return (
		<Modal show={open} onHide={onClose} centered>
			<Modal.Header closeButton>{t("chose_type")}</Modal.Header>
			<Modal.Body>
				<div style={{ textAlign: "center" }}>
					<Box
						sx={{
							display: "grid",
							gap: 6,
							gridTemplateColumns: {
								md: "1fr 1fr 1fr",
								sm: "1fr 1fr",
								xs: "1fr",
							},
						}}
					>
						{categoryData?.map((item, index) => (
							<div>
								<div
									style={{
										width: "100%",
										height: "100%",
										border:
											"1px solid" +
											(checkedCategory(item?._id) ? COLOR_APP : "#EEE"),
										borderRadius: 8,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										textAlign: "center",
										padding: 10,
										cursor: "pointer",
									}}
									onClick={() => {
										onSelectCategory(item?._id);
									}}
								>
									<div
										style={{
											position: "absolute",
											float: "right",
											right: 10,
											top: 10,
										}}
									></div>
									<div>
										<span
											style={{
												fontSize: 16,
											}}
										>
											<div>{item?.name}</div>
										</span>
									</div>
								</div>
							</div>
						))}
					</Box>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
					{t("cancel")}
				</Button>
				<Button
					disabled={buttonDisabled}
					style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
					onClick={() => {
						setSelectedCategory(selectedCategoryIds);
						onClose();
						// setButtonDisabled(true);
						// onSubmit().then(() => setButtonDisabled(false));
					}}
				>
					{t("ok")}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
