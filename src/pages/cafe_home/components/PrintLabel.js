import moment from "moment";
import React, { useEffect } from "react";
import { moneyCurrency } from "../../../helpers";
import { useStoreStore } from "../../../zustand/storeStore";

export default function PrintLabel({ data, bill }) {
  const { storeDetail } = useStoreStore();

  console.log("data", data);
  console.log("bill", bill?.price);

  return (
    <div className="py-2 px-4 bg-white rounded-lg shadow-md">
      <span className="flex items-center justify-between">
        <h5 className="font-bold">{bill?.name}</h5>
        <p className="pt-2 font-bold"># {data}</p>
      </span>
      <div>
        {bill?.options?.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between font-bold"
          >
            <span>
              {" "}
              - {item.name} x {item.quantity}
            </span>
          </div>
        ))}
      </div>
      {/* <div>PrintLabel component</div> */}
      <span className="mt-2 flex items-center justify-between font-bold">
        <div>
          {moment(bill?.createdAt).format("DD/MM")} |{" "}
          {moment(bill?.createdAt).format("LT")}
        </div>
        <div>
          {moneyCurrency(bill?.price)} {storeDetail?.firstCurrency}
        </div>
      </span>
    </div>
  );
}
