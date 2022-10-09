import { BiCheckDouble } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import ButtonPrimary from "./ButtonPrimary";

const ButtonManamentReservation = ({ status }) => {
    if (status == "CANCEL") {
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <ButtonPrimary
            style={{
              color: "white",
              backgroundColor: "#FF4A4A",
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
              <span>ການຈອງຖືກປະຕິເສດ</span>
            </div>
          </ButtonPrimary>
        </div>
      );
    }
    if (status == "STAFF_CONFIRM") {
      return (
        <div style={{ display: "flex", gap: 10 }}>
          <ButtonPrimary
            style={{
              color: "white",
              backgroundColor: "#18AB00",
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
              <span>ຈອງສຳເລັດແລ້ວ</span>
            </div>
          </ButtonPrimary>
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
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>ອະນຸມັດ</span>
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
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>ບໍ່ອະນຸມັດ</span>
          </div>
        </ButtonPrimary>
      </div>
    );
  };
  
  export default ButtonManamentReservation