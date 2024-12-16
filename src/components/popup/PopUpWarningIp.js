import React, { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { printBillDiscoverIp } from "../../services/prinBill80";
import { addPrinter } from "../../services/printer";
import { useStore } from "../../store";
import { BsClipboard } from "react-icons/bs";
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
  paddingTop: 15,
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "center",
  border: "none",
};

const CopyableInput = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false); // Track copy status
  const inputRef = useRef(null); // Reference to input element
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputRef.current.value); // Copy text to clipboard
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Swal.fire({
        title: "success",
        text: t("copy-ip-text"),
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to copy text!",
        icon: "error",
      });
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        ref={inputRef}
        type="text"
        value={textToCopy}
        placeholder={"ກະລຸນາປ້ອນ IP"}
        className="form-control relative"
        readOnly={true}
      />
      <Button
        className="absolute right-24 h-[38px] w-[38px] flex gap-1 items-center p-2"
        variant="light"
        onClick={handleCopy}
        style={{
          backgroundColor: copied ? "#28a745" : `${COLOR_APP}`, // Change color based on copy state
          color: "#fff",
          border: "none",
        }}
      >
        <BsClipboard size={20} />
        {/* {copied ? "Copied!" : "Copy"} */}
      </Button>
    </div>
  );
};
export default function PopUpWarningIp({
  open,
  text,
  onClose,
  onSubmit,
  setPopUpWarningIp,
}) {
  const { t } = useTranslation();
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { storeDetail } = useStore();

  const handleSearchIp = async () => {
    setIsLoading(true);
    const res = await printBillDiscoverIp();
    setData(res?.data?.data);
    setIsLoading(false);
  };

  const handleConfirmClick = async () => {
    navigate("/printer");
    setPopUpWarningIp(false);
  };

  return (
    <Modal show={open} centered>
      <Modal.Body>
        <div style={boxIcon}>
          <div style={iconStyle}>
            <BsQuestionLg />
          </div>
        </div>
        <div style={modalBodyStyle}>
          <h3 style={{ fontSize: 30, fontWeight: 600 }}>
            <b>{t("noti")}!</b>
          </h3>

          {data?.message && (
            <p>
              {data?.message} {data?.printerIPs.length} IP
            </p>
          )}
          {data ? (
            data?.printerIPs?.map((item) => {
              return (
                <div key={item}>
                  <CopyableInput textToCopy={item} />
                </div>
              );
            })
          ) : (
            <div>
              {data?.status ? (
                <span style={{ color: "red" }}>{text}</span>
              ) : isLoading ? (
                <p>ກຳລັງຄົ້ນຫາ......</p>
              ) : (
                <span style={{ color: "red" }}>ຫາ IP printer ບໍ່ເຫັນ</span>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
        <Button variant="secondary" onClick={onClose}>
          {t("Close")}
        </Button>
        <Button
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={handleSearchIp}
        >
          {t("search")}
        </Button>
      </Modal.Footer>
      {data?.printerIPs?.length > 0 && (
        <div className="flex justify-center cursor-pointer">
          <p onClick={handleConfirmClick}>
            <span style={{ color: `${COLOR_APP}` }}>
              Copy IP ໄປທີ່ໜ້າຕັ້ງຄ່າ Printer ໂດຍກົດບ່ອນນີ້
            </span>{" "}
          </p>
        </div>
      )}
    </Modal>
  );
}
