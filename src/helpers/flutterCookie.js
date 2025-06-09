function flutterCookie({isCookie}) {
  try {

    const cookie = {
        cookie: isCookie
      };
    
      window.flutter_inappwebview
        .callHandler("Cookie", cookie)
        .then(function (result) {
          console.log("Cookie");
          console.log(JSON.stringify(result));
        })
        .catch(() => {
          console.log("error");
        });
    
  } catch (error) {
    console.log(error);
  }
}

export default flutterCookie