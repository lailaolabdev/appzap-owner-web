const StatusComponent = ({ status, style }) => {
  const converStatusName = (status) => {
    switch (status) {
      case "WAITING":
        return "ອໍເດີເຂົ້າ";
      case "DOING":
        return "ກໍາລັງຄົວ";
      case "SERVED":
        return `ເສີບແລ້ວ`;
      case "CART":
        return `ກຳລັງຈະສັງ`;
      case "FEEDBACK":
        return `ສົ່ງຄືນ`;
      case "PAID":
        return `ຈ່າຍແລ້ວ`;
      default:
        return "ຍົກເລີກ";
    }
  };
  const converStatusColor = (status) => {
    switch (status) {
      case "WAITING":
        return "#4FC0D0";
      case "DOING":
        return "#FFD6A5";
      case "SERVED":
        return `#A0D8B3`;
      case "CART":
        return `#B4E4FF`;
      case "FEEDBACK":
        return `#DF7857`;
      case "PAID":
        return `#00C851`;
      default:
        return "#DF2E38";
    }
  };
  return (
    <div
      disabled
      style={{
        backgroundColor: converStatusColor(status),
        padding: "5px 10px",
        color: "#fff",
        borderRadius: 4,
        fontWeight: "bold",
        ...style,
      }}
    >
      {converStatusName(status)}
    </div>
  );
};

export default StatusComponent;
