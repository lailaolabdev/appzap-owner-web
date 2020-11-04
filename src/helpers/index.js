export const orderStatus = (status) => {
  switch (status) {
    case "WAITING":
      return "ອໍເດີເຂົ້າ";
      break;
    case "DOING":
      return "ກຳລັງເຮັດ";
      break;
    case "SERVED":
      return "ເສີບແລ້ວ";
      break;
    default:
      return "ຍົກເລີກແລ້ວ";
      break;
  }
};
