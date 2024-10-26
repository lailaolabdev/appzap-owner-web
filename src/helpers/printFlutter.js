const printFlutter = (
  { imageBuffer, ip, type, port, width, beep, drawer },
  callback
) => {
  return new Promise((resolve, reject) => {
    try {
      const billData = {
        drawer: drawer,
        type: type, // ETHERNET, BLUETOOTH, USB
        ip: ip, // ip printer ກໍລະນີ້ເປັນ type ETHERNET
        port: port, // port printer (9000)
        image: imageBuffer, // ຮູບບິນ
        width: width,
        beep: beep,
      };

      window.flutter_inappwebview
        .callHandler("handlerFoo", billData)
        .then(function (result) {
          // Print to the console the data coming from the Flutter side.
          console.log("handlerFoo");
          console.log(JSON.stringify(result));
          resolve();
        })
        .catch(() => {
          callback()
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
    } catch (err) {
      callback()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    }
  });
};

export default printFlutter;
