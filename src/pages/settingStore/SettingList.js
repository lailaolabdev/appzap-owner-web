import React from 'react'
import useReactRouter from "use-react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

  return (
    <div style={{ padding: 15 }} className='row col-sm-12 text-center'>
      <button
        type='button'
        className='card col-2'
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
          history.push("/settingStore/storeDetail/" + match?.params?.id)
        }>
        <FontAwesomeIcon icon={faCogs} />
        ຕັ້ງຄ່າຮ້ານຄ້າ
      </button>
      <button
        type='button'
        className='card col-2'
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
          history.push(
            "/settingStore/users/limit/40/page/1/" + match?.params?.id
          )
        }>
        <FontAwesomeIcon icon={faUsers} />
        ຈັດການພະນັກງານ
      </button>
      <button
        type='button'
        className='card col-2'
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
          history.push(
            "/settingStore/menu/limit/40/page/1/" + match?.params?.id
          )
        }>
        <FontAwesomeIcon icon={faUtensils} />
        ຈັດການອາຫານ
      </button>
      <button
        type='button'
        className='card col-2'
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
          history.push("/settingStore/settingTable/" + match?.params?.id)
        }>
        <FontAwesomeIcon icon={faTable} />
        ຕັ້ງຄ່າໂຕະ
      </button>
      <button
        type='button'
        className='card col-2'
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
        onClick={() => history.push("/historyUse/" + match?.params?.id)}>
        <FontAwesomeIcon icon={faHistory} />
        ປະຫັວດການໃຊ້ງານ
      </button>
      {/* <button
        type='button'
        className='card col-2'
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
          history.push(
            "/settingStore/stock/limit/40/page/1/" + match?.params?.id
          )
        }>
        <FontAwesomeIcon icon={faBoxes} />
        ປະຫວັດສະຕ໊ອກ
      </button> */}
    </div>
  );
}
