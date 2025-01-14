function flutterDrawer({ drawer, ip }, callback) {
  return new Promise((resolve, reject) => {
    try {
      const billData = {
        drawer: drawer,
        ip: ip, // ip printer ກໍລະນີ້ເປັນ type ETHERNET
      };

      window.flutter_inappwebview
        .callHandler("handlerName", billData)
        .then(function (result) {
          // Print to the console the data coming from the Flutter side.
          console.log("handlerName");
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
}

export default flutterDrawer;
