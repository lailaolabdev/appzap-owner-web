import { useEffect, useState } from "react";
import _message from "../../sound/message.mp3";
import _order from "../../sound/order-sound.wav";
import useLocalStorage from "../../helpers/useLocalStorage";
// import { toast } from "react-toastify";
let _messageSound = new Audio("https://appzap-file-storage.s3.ap-southeast-1.amazonaws.com/audio/incoming-message-sound-1.mp3");
let _orderSound = new Audio("https://appzap-file-storage.s3.ap-southeast-1.amazonaws.com/audio/incoming-order-sound-1.wav");

export const useSoundState = () => {
  const [audioSetting, setAudioSetting] = useLocalStorage("audioSetting", {
    // ສຽງລະບົບຂາຍໜ້າຮ້ານ
    order: true,
    openTable: true,
    // ສຽງຂໍ້ຄວາມ
    message: true,
    // ສຽງອື່ນໆ
    music: true,
  });
  const [runSound, setRunSound] = useState();

  useEffect(() => {
    if (runSound?.messageSound) {
      setRunSound();
      return messageSound();
    } else if (runSound?.orderSound) {
      setRunSound();
      return orderSound();
    }
  }, [runSound]);

  const messageSound = () => {
    if (audioSetting?.message) {
      _messageSound.play();
    }
  };

  const orderSound = () => {
    if (audioSetting?.order) {
      _orderSound.play();
    }
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
    audioSetting,
    setAudioSetting,
    messageSound,
    orderSound,
    runSound,
    setRunSound,
  };
};
