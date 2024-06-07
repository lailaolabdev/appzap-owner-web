const printFlutter = ({ imageBuffer, ip, type, port }) => {
  const billData = {
    type: type, // ETHERNET, BLUETOOTH, USB
    ip: ip, // ip printer ກໍລະນີ້ເປັນ type ETHERNET
    port: port, // port printer (9000)
    image: imageBuffer, // ຮູບບິນ
  };

 
  window.flutter_inappwebview
    .callHandler("handlerFoo", billData)
    .then(function (result) {
      // Print to the console the data coming from the Flutter side.
      console.log(JSON.stringify(result));
    });
};

export default printFlutter;
