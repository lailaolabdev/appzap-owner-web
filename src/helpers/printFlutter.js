const printFlutter = ({ imageBuffer, ip, type, port }) => {
  const billData = {
    type: type, // ETHERNET, BLUETOOTH, USB
    ip: ip,
    port: port,
    image: imageBuffer,
  };

  if (window.flutter_inappwebview) {
    window.flutter_inappwebview.callHandler("printBill", billData);
  } else {
    alert("Flutter interface not available");
  }
};

export default printFlutter;
