import React from "react";

export default function EmptyState({ text }) {
  // const emptyUrl = "https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png";

  return (
    <div className="d-flex w-100 h-100 justify-content-center align-items-center gap-2 flex-column">
      <img src="/images/empty-cart.webp" style={{ width: 200, height: 200 }} />
      <p>
        <b>{text}</b>
      </p>
    </div>
  );
}
