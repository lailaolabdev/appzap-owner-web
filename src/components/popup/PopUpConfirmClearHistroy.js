import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";

// Assuming COLOR_APP is defined elsewhere
import { COLOR_APP } from "../../constants";

const boxIcon = {
	position: "absolute",
	left: 0,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	top: 0,
	width: "100%",
};

const iconStyle = {
	fontSize: "6em",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	background: "#FB6E3B",
	marginTop: "-.7em",
	width: 120,
	height: 120,
	borderRadius: "30em",
	boxShadow:
		"rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
	color: "#ffff",
	border: "10px solid #ffff",
};

const modalBodyStyle = {
	textAlign: "center",
	minHeight: "23vh",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexDirection: "column",
	gap: 5,
	paddingTop: "50px",
};

const modalFooterStyle = {
	display: "flex",
	justifyContent: "center",
	border: "none",
};

export default function PopUpConfirmDeletion({
	open,
	text,
	onClose,
	onSubmit,
	amount,
	textAmount,
	startData,
	endData
}) {
	const { t } = useTranslation();
	const [buttonDisabled, setButtonDisabled] = useState(false);

	const handleConfirmClick = () => {
		setButtonDisabled(true);
		onSubmit()
	};

	return (
    <Modal show={open} centered>
      <Modal.Body style={{
		height: '40vh'
	  }}>
        <div style={boxIcon} >
          <div style={iconStyle}>
            <BsQuestionLg />
          </div>
        </div>
        <div style={modalBodyStyle} className="p-5 mt-4">
          <h3 style={{ fontSize: 30, fontWeight: 600 }}>
            <b>{text}!</b>
          </h3>
            <div>
              {t("would_you_delete")}{" "}
              <span style={{ color: "red" }}>{text}</span> {t("realy_out")}
            </div>
          <div className=" bg-orange-100 w-full rounded-sm p-3 mt-3">
            <div
              className="flex justify-between"
            >
              <b>{textAmount}</b> <p>{amount}</p>
            </div>
            <div className="flex justify-between">
              <b>ວັນທີ່</b>{" "}
              <p>
                {startData} ~ {endData}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
        <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={handleConfirmClick}
        >
          {t("ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
