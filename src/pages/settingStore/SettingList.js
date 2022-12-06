import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faHistory,
  faTable,
  faUsers,
  faUtensils,
  faBoxes,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import styled from "styled-components";

export default function SettingList() {
  const params = useParams();
  const navigate = useNavigate();

  const data = [
    {
      id: "479af7e5-1947-426d-b511-d95f0155f70f",
      title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
      icon: <FontAwesomeIcon icon={faCogs} />,
      path: `/settingStore/storeDetail/${params?.id}`,
    },
    {
      id: "0f83cb87-fc96-4212-b67d-2af6f33ed937",
      title: "ຈັດການພະນັກງານ",
      icon: <FontAwesomeIcon icon={faUsers} />,
      path: `/settingStore/users/limit/40/page/1/${params?.id}`,
    },
    {
      id: "ab2dd4fe-617d-48f7-afa6-645fa3b8e04e",
      title: "ຈັດການອາຫານ",
      icon: <FontAwesomeIcon icon={faUtensils} />,
      path: `/settingStore/menu/limit/40/page/1/${params?.id}`,
    },
    {
      id: "1b76514a-d0e2-4808-89d1-3c66bc46d8ce",
      title: "ຕັ້ງຄ່າໂຕະ",
      icon: <FontAwesomeIcon icon={faTable} />,
      path: `/settingStore/settingTable/${params?.id}`,
    },
    {
      id: "1cb62d9b-01bd-419b-a60e-9b5b43133d7a",
      title: "ປະຫັວດການໃຊ້ງານ",
      icon: <FontAwesomeIcon icon={faHistory} />,
      path: `/historyUse/${params?.id}`,
    },
    {
      id: "42e27d60-6f12-446a-aa8f-ae6307b8ab34",
      title: "ຈັກການສະຕ໊ອກ",
      icon: <FontAwesomeIcon icon={faBoxes} />,
      path: `/settingStore/stock/limit/40/page/1/${params?.id}`,
    },
    {
      id: "0f90941b-c594-4365-a279-a995868ede2a",
      title: "ຕັ້ງຄ່າປິນເຕີ້",
      icon: <FontAwesomeIcon icon={faPrint} />,
      path: `/printer`,
    },
  ];

  return (
    <div style={{ height: "100%" }}>
      <Box
        sx={{
          padding: 15,
          display: "grid",
          gridTemplateColumns: {
            md: "repeat(4,1fr)",
            sm: "repeat(3,1fr)",
            xs: "repeat(2,1fr)",
          },
          gridGap: 10,
          gridAutoRows: "200px",
        }}
      >
        {data.map((e) => (
          <ItemBox onClick={() => navigate(e.path)} key={e.id}>
            {e.icon}
            {e.title}
          </ItemBox>
        ))}
      </Box>
    </div>
  );
}

const ItemBox = styled("div")({
  padding: 10,
  height: "100%",
  color:"#212529",
  outlineColor: "#FB6E3B",
  backgroundColor: "white",
  border: "1px solid  #E4E4E4",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  borderRadius: 8,
  "&:hover": {
    backgroundColor: "rgba(251,110,59,0.2)",
    cursor: "pointer",
  },
});
