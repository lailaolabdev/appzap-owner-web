// In WaitingOrderTab.js
import React, { useMemo } from "react";
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

const WaitingOrderTab = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { waitingOrders, handleCheckbox, handleCheckAll } = useOrderStore();

  // Sort waitingOrders by createdAt in descending order (newest first)
  const sortedWaitingOrders = useMemo(() => {
    if (!waitingOrders || waitingOrders.length === 0) return [];

    return [...waitingOrders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Descending order (newest first)
    });
  }, [waitingOrders]);

  return (
    <div>
      <div>
        <ReactAudioPlayer src={Notification} />
      </div>
      <OrderList
        onTabStatusName={WAITING_STATUS}
        orders={sortedWaitingOrders} // Pass sorted orders to OrderList component
        handleCheckbox={handleCheckbox} // Pass handleCheckbox function
        handleCheckAll={handleCheckAll} // Pass handleCheckAll function
        language={language} // Pass language for translations
        t={t} // Pass translation function
      />
    </div>
  );
};

export default WaitingOrderTab;
