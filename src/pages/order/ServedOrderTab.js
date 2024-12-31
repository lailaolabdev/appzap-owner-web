// In ServedOrderTab.js
import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { useTranslation } from "react-i18next";
import { useOrderStore } from "../../zustand/orderStore";
import Notification from "../../vioceNotification/ding.mp3";
import OrderList from "./OrderList"; // Import the default export
import {
	DOING_STATUS,
	WAITING_STATUS,
	SERVE_STATUS,
	CANCEL_STATUS,
  } from "../../constants/index";

const ServedOrderTab = () => {
  const { t, i18n: { language } } = useTranslation();
  const { servedOrders, handleCheckbox, handleCheckAll } = useOrderStore();

  return (
    <div>
      <div>
        <ReactAudioPlayer src={Notification} />
      </div>
      <OrderList
	  	  onTabStatusName={SERVE_STATUS}
        hideCheckbox={true}
        orders={servedOrders} // Pass orders to OrderList component
        handleCheckbox={handleCheckbox} // Pass handleCheckbox function
        handleCheckAll={handleCheckAll} // Pass handleCheckAll function
        language={language} // Pass language for translations
        t={t} // Pass translation function
      />
    </div>
  );
};

export default ServedOrderTab;



{/* <Image src={empty} alt="" width="100%" /> */}