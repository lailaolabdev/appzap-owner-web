import { BiCheckDouble } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import ButtonPrimary from "./ButtonPrimary";
import { COLOR_APP } from "../../constants";
import { useTranslation } from "react-i18next";

const ButtonManamentReservation = ({ status, handleReject, handleConfirm, handleEdit }) => {
  const { t } = useTranslation();
  if (status === "CANCEL") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <ButtonPrimary
          style={{
            color: "#ccc",
            backgroundColor: "#fff",
            border: `1px solid #ccc`,
            height: 31,
            fontSize: 14,
            padding: 4,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IoClose style={{ width: 20, height: 20 }} />
            <span>{t('bookingDeclined')}</span>
          </div>
        </ButtonPrimary>
        {/* <AiOutlineSetting /> */}

      </div>
    );
  }
  if (status === "SUCCESS") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems:"center" }}>
        <ButtonPrimary
          style={{
            color: COLOR_APP,
            backgroundColor: "#5BFF33",
            // border: `1px solid ${COLOR_APP}`,
            height: 31,
            fontSize: 14,
            padding: 4,

            width: "100%",
          }}
          disabled
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BiCheckDouble style={{ width: 20, height: 20, color: "white" }} />
            <span style={{ color: "white" }}>{t('successfulBookingConfirm')}</span>
          </div>
        </ButtonPrimary>
        {/* <AiOutlineSetting /> */}

      </div>
    );
  }
  if (status === "STAFF_CONFIRM") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <ButtonPrimary
          style={{
            color: COLOR_APP,
            backgroundColor: "#fff",
            border: `1px solid ${COLOR_APP}`,
            height: 31,
            fontSize: 14,
            padding: 4,
            width: "100%",
          }}
          disabled
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BiCheckDouble style={{ width: 20, height: 20 }} />
            <span>{t('bookingSuccessful')}</span>
          </div>
        </ButtonPrimary>
        {/* <AiOutlineSetting /> */}


      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <ButtonPrimary
        style={{
          color: "white",
          height: 31,
          fontSize: 14,
          padding: 4,
          width: "100%",
        }}
        onClick={handleConfirm}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{t('approveButton')}</span>
        </div>
      </ButtonPrimary>

      <ButtonPrimary
        style={{
          color: "white",
          backgroundColor: "#D9D9D9",
          height: 31,
          fontSize: 14,
          padding: 4,
          width: "100%",
        }}
        onClick={handleReject}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{t('cancelButton')}</span>
        </div>
      </ButtonPrimary>
      <ButtonPrimary
        style={{
          color: "orange",
          backgroundColor: "#fff",
          border: `1px solid orange`,
          height: 31,
          fontSize: 14,
          padding: 4,
          width: "100%",
        }}
        onClick={handleEdit}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{t('edit')}</span>
        </div>
      </ButtonPrimary>
    </div>
  );
};

export default ButtonManamentReservation;
