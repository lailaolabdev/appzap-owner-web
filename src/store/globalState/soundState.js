import { useState } from "react";
import _message from "../../sound/message.mp3";
import _order from "../../sound/order-sound.wav";
import { toast } from "react-toastify";

export const useSoundState = () => {
  let _messageSound = new Audio(_message);
  let _orderSound = new Audio(_order);
  const messageSound = () => {
    _messageSound.play();
  };

  const orderSound = () => {
    _orderSound.play();
    // toast.success("ອັບເດດສະຖານະສຳເລັດ", {
    //   position: "top-center",
    //   autoClose: 200,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
  };

  return {
    messageSound,
    orderSound,
  };
};
