// In CanceledOrderTab.js
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

const CanceledOrderTab = () => {
  const { t, i18n: { language } } = useTranslation();
  const { canceledOrders, handleCheckbox, handleCheckAll } = useOrderStore();

  return (
    <div>
      <div>
        <ReactAudioPlayer src={Notification} />
      </div>
      <OrderList
	  	  onTabStatusName={CANCEL_STATUS}
        hideCheckbox={true}
        orders={canceledOrders} // Pass orders to OrderList component
        handleCheckbox={handleCheckbox} // Pass handleCheckbox function
        handleCheckAll={handleCheckAll} // Pass handleCheckAll function
        language={language} // Pass language for translations
        t={t} // Pass translation function
      />
    </div>
  );
};

export default CanceledOrderTab;



{/* <Image src={empty} alt="" width="100%" /> */}