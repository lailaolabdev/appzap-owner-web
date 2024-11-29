import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { printBillDiscoverIp } from "../../services/prinBill80";
import { addPrinter } from "../../services/printer";
import { useStore } from "../../store";
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

  const handleIpChange = (e) => {
    setData(e.target.value);
  };

  const handleSearchIp = async () => {
    setIsLoading(true);
    const res = await printBillDiscoverIp();
    setData(res?.data?.data);
    setIsLoading(false);
  };

  //   const handleConfirmClick = async () => {
  //     if (!data) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Please enter Ip printer",
  //         showConfirmButton: false,
  //         timer: 1800,
  //       });
  //       return;
  //     }
  //     const value = {
  //       cutPaper: "cut",
  //       ip: data[0],
  //       name: `PrinterEthernet ${Date.now()}`,
  //       storeId: storeDetail?._id,
  //       type: "ETHERNET",
  //       width: "80mm",
  //     };
  //     await addPrinter(value);
  //     Swal.fire({
  //       icon: "success",
  //       title: "ສຳເລັດ",
  //       text: "ສ້າງ IP Address ໃໝ່ສຳເລັດ",
  //       showConfirmButton: false,
  //       timer: 1800,
  //     });
  //     navigate("/printer");
  //     setPopUpWarningIp(false);
  //   };

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
          {isLoading && <p>ກຳລັງຄົ້ນຫາ......</p>}
          {data?.data?.message && <p>{data?.data?.message}</p>}
          {data ? (
            data?.map((item) => {
              <div key={item?._id}>
                <input
                  type="text"
                  value={item?.printerIPs}
                  onChange={handleIpChange}
                  placeholder={"ກະລຸນາປ້ອນ IP"}
                  className="form-control"
                  readOnly={true}
                />
              </div>;
            })
          ) : (
            <div>
              {data?.status ? (
                <span style={{ color: "red" }}>{text}</span>
              ) : (
                <span style={{ color: "red" }}>ຫາ IP printer ບໍ່ເຫັນ</span>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={handleSearchIp}
        >
          {t("search")}
        </Button>
        {/* <Button
          disabled={!data[0]}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={handleConfirmClick}
        >
          {t("ok")}
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
