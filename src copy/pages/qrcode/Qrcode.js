import React from "react";
import { QRCode } from "react-qrcode-logo";
const Qrcode = () => {
  return (
    <div className="container">
      <QRCode
        logoImage={
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png"
        }
        value="https://github.com/gcoro/react-qrcode-logo"
      />
    </div>
  );
};

export default Qrcode;
