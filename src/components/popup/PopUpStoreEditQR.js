import React, { useState, useRef } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import { BsQrCodeScan } from "react-icons/bs";
import { COLOR_APP_CANCEL, COLOR_APP } from "../../constants";
import { useTranslation } from "react-i18next";
import jsQR from "jsqr";

export default function PopUpStoreEditQR({ open, onClose, onSubmit, data }) {
  const { t } = useTranslation();
  const [qrText, setQrText] = useState("");
  const [scanError, setScanError] = useState("");
  const fileInputRef = useRef(null);
  const formikRef = useRef(null);
  const clearAllData = () => {
    setQrText("");
    setScanError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  // Handle modal close with data clearing
  const handleClose = () => {
    clearAllData();
    onClose();
  };
  const handleQrUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview URL for the image
    const previewUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to process the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data for QR processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Scan QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrText(code.data);
          setScanError("");
        } else {
          setScanError(t("No QR code found in the image"));
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={open} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t("change_qr_code")}</Modal.Title>
      </Modal.Header>
      <Formik
        innerRef={formikRef}
        initialValues={{
          _id: data?._id,
          qr: data?.printer?.qr || "",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.qr && !qrText) {
            errors.qr = t("please_fill");
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const Submit = async () => {
            // Include the scanned QR text in the submission
            const updatedValues = {
              _id: values._id,
              printer: {
                qr: qrText || values?.qr,
              },
            };
            await onSubmit(updatedValues);
            setSubmitting(false);
            clearAllData();

            // Close the modal
            onClose();
          };
          Submit();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              {/* QR Code Upload Section */}
              <div className="mb-4 mt-4">
                <div className="d-flex flex-column align-items-center">
                  {values?.qr ? (
                    <>
                      <img
                        src={`https://app-api.appzap.la/qr-gennerate/qr?data=${values?.qr}`}
                        className="w-[350px] h-[350]"
                        alt=""
                      />
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="px-4 py-2 bg-color-app hover:bg-orange-400 text-white border border-gray-300 rounded-md shadow-sm transition-all flex items-center"
                          onClick={() => fileInputRef.current.click()}
                        >
                          {t("upload_qr_code")}
                        </button>
                        {/* <button
                          type="button"
                          className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white border border-gray-300 rounded-md shadow-sm transition-all flex items-center"
                          onClick={() => clearAllData()}
                        >
                          {t("delete")}
                        </button> */}
                      </div>
                    </>
                  ) : (
                    <div
                      className="qr-preview-container mb-3"
                      style={{
                        width: "250px",
                        height: "250px",
                        border: "1px dashed #ccc",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      {fileInputRef.current?.files?.[0] ? (
                        <img
                          src={URL.createObjectURL(
                            fileInputRef.current.files[0]
                          )}
                          alt="QR Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center p-3">
                          <BsQrCodeScan
                            size={50}
                            style={{ color: "#adb5bd", marginBottom: "15px" }}
                          />
                          <p className="mb-0" style={{ color: "#6c757d" }}>
                            {t("upload_qr_code")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      handleQrUpload(e);
                      // Clear validation errors when uploading
                      setFieldValue("qr", "");
                    }}
                    style={{ display: "none" }}
                  />

                  {scanError && (
                    <Alert
                      variant="danger"
                      className="mt-2 w-100"
                      style={{ borderRadius: "8px" }}
                    >
                      {scanError}
                    </Alert>
                  )}

                  {qrText ? (
                    <div className="mt-3 w-100">
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={qrText}
                          onChange={(e) => {
                            setQrText(e.target.value);
                            setFieldValue("qr", e.target.value);
                          }}
                          name="qr"
                          isInvalid={errors.qr && touched.qr}
                          style={{
                            borderRadius: "8px",
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                            padding: "12px",
                            fontSize: "14px",
                          }}
                        />
                        {errors.qr && touched.qr && (
                          <Form.Control.Feedback type="invalid">
                            {errors.qr}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </div>
                  ) : (
                    values?.qr && (
                      <div className="mt-3 w-100">
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            disabled
                            rows={4}
                            value={values.qr}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="qr"
                            isInvalid={errors.qr && touched.qr}
                            style={{
                              borderRadius: "8px",
                              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                              padding: "12px",
                              fontSize: "14px",
                            }}
                          />
                          {errors.qr && touched.qr && (
                            <Form.Control.Feedback type="invalid">
                              {errors.qr}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleClose}
                type="button"
              >
                {t("cancel")}
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={isSubmitting}
              >
                {t("save")}
              </button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
