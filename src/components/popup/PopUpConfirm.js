import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export default function PopUpConfirm({
  open,
  text1,
  text2,
  onClose,
  onSubmit,
  isRejected,
}) {
  const { t } = useTranslation();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [select, setSelect] = useState("");
  const [otherInput, setOtherInput] = useState("");

  const rejectOptions = [
    { value: "", label: "--" },
    { value: "1", label: "ບໍ່ມີໂຕະວ່າງ" },
    { value: "other", label: "ອື່ນໆ" },
  ];

  // Get label for the selected rejection reason
  const getRejectLabel = (value) =>
    rejectOptions.find((option) => option.value === value)?.label || "";

  // Handle select input change
  const handleOnSelectChange = (e) => {
    setSelect(e.target.value);
    setErrorMessage("");
  };

  // Clear all state when the modal closes
  const handleOnClose = () => {
    onClose();
    setButtonDisabled(false);
    resetState();
  };

  const resetState = () => {
    setSelect("");
    setOtherInput("");
    setErrorMessage("");
  };

  // Handle form submission
  const handleOnSubmit = async () => {
    setButtonDisabled(true);

    try {
      if (isRejected) {
        // Validate rejection reason
        if (!select) {
          setErrorMessage(t("ກະລຸນາເລືອກເຫດຜົນ!"));
          return;
        }

        if (select === "other" && !otherInput.trim()) {
          setErrorMessage(t("ກະລຸນາປ້ອນເຫດຜົນ!"));
          return;
        }

        // Invoke onSubmit with the rejection message
        const rejectionMessage =
          select === "other" ? otherInput : getRejectLabel(select);
        await onSubmit(rejectionMessage);
        return;
      }

      // Normal submission
      await onSubmit();
    } finally {
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    resetState();
  }, [open]);

  return (
    <Modal show={open} onHide={handleOnClose}>
      <Modal.Header closeButton />
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          {text1 && <div>{text1}</div>}
          {text2 && <div style={{ color: "red" }}>{text2}</div>}
        </div>

        {isRejected && (
          <form className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label>{"ເລືອກເຫດຜົນ"}</label>
              <select
                className={cn(
                  "form-control",
                  select === "" ? "!text-gray-400" : ""
                )}
                value={select}
                onChange={handleOnSelectChange}
              >
                {rejectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {select === "other" && (
              <input
                placeholder={"ກະລຸນາປ້ອນເຫດຜົນ"}
                className="form-control"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
              />
            )}

            {errorMessage && (
              <span className="text-center text-red-400">{errorMessage}</span>
            )}
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={buttonDisabled}
          variant="secondary"
          onClick={handleOnClose}
        >
          {t("cancel")}
        </Button>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#fff", border: 0 }}
          onClick={handleOnSubmit}
        >
          {t("ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
