// In WaitingOrderTab.js
import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { useTranslation } from "react-i18next";
import { useOrderStore } from "../../zustand/orderStore";
import Notification from "../../vioceNotification/ding.mp3";
import OrderList from "./OrderList"; // Import the default export

const WaitingOrderTab = () => {
  const { t, i18n: { language } } = useTranslation();
  const { waitingOrders, handleCheckbox, handleCheckAll } = useOrderStore();

  return (
    <div>
      <div>
        <ReactAudioPlayer src={Notification} />
      </div>
      <OrderList
	  	onTabStatusName={"WAITING"}
        orders={waitingOrders} // Pass orders to OrderList component
        handleCheckbox={handleCheckbox} // Pass handleCheckbox function
        handleCheckAll={handleCheckAll} // Pass handleCheckAll function
        language={language} // Pass language for translations
        t={t} // Pass translation function
      />
    </div>
  );
};

export default WaitingOrderTab;
