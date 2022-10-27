import React from "react";
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faHistory,
  faTable,
  faUsers,
  faUtensils,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

export default function SettingList() {
  const { history, match } = useReactRouter();

  const data = [
    {
      id: "479af7e5-1947-426d-b511-d95f0155f70f",
      title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
      icon: <FontAwesomeIcon icon={faCogs} />,
      path: `/settingStore/storeDetail/${match?.params?.id}`,
    },
    {
      id: "0f83cb87-fc96-4212-b67d-2af6f33ed937",
      title: "ຈັດການພະນັກງານ",
      icon: <FontAwesomeIcon icon={faUsers} />,
      path: `/settingStore/users/limit/40/page/1/${match?.params?.id}`,
    },
    {
      id: "ab2dd4fe-617d-48f7-afa6-645fa3b8e04e",
      title: "ຈັດການອາຫານ",
      icon: <FontAwesomeIcon icon={faUtensils} />,
      path: `/settingStore/menu/limit/40/page/1/${match?.params?.id}`,
    },
    {
      id: "1b76514a-d0e2-4808-89d1-3c66bc46d8ce",
      title: "ຕັ້ງຄ່າໂຕະ",
      icon: <FontAwesomeIcon icon={faTable} />,
      path: `/settingStore/settingTable/${match?.params?.id}`,
    },
    {
      id: "1cb62d9b-01bd-419b-a60e-9b5b43133d7a",
      title: "ປະຫັວດການໃຊ້ງານ",
      icon: <FontAwesomeIcon icon={faHistory} />,
      path: `/historyUse/${match?.params?.id}`,
    },
    {
      id: "42e27d60-6f12-446a-aa8f-ae6307b8ab34",
      title: "ຈັກການສະຕ໊ອກ",
      icon: <FontAwesomeIcon icon={faBoxes} />,
      path: `/settingStore/stock/limit/40/page/1/${match?.params?.id}`,
    },
  ];

  return (
    <div style={{ padding: 15 }} className="row text-center">
      {data.map((e) => (
        <button
          type="button"
          className="card col col-6 col-sm-4 col-md-3 col-lg-2"
          style={{
            padding: 10,
            height: 100,
            outlineColor: "#FB6E3B",
            backgroundColor: "white",
            border: "1px solid  #E4E4E4",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
          onClick={() =>
            history.push(e.path)
          }
          key={e.id}
        >
          {e.icon}
          {e.title}
        </button>
      ))}
    </div>
  );
}
