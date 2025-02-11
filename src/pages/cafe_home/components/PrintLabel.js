import moment from "moment";
import React, { useEffect } from "react";
import { moneyCurrency } from "../../../helpers";
import { useStoreStore } from "../../../zustand/storeStore";

export default function PrintLabel({ data, bill, totalPrice }) {
  const { storeDetail } = useStoreStore();
  return (
    <>
      <div className="py-2 px-4 bg-white rounded-lg shadow-md">
        <span className="flex items-center justify-between">
          <h5 className="font-bold">{bill?.name}</h5>
          <p className="pt-2 font-bold"># {data}</p>
        </span>

        <div className="flex gap-1">
          {bill?.options?.map((item, index) => (
            <div key={item.id || index}>
              <span>
                {item.quantity > 1
                  ? `${item.name} x ${item.quantity}`
                  : item.name}
                {index < bill.options.length - 1 && ","}{" "}
              </span>
            </div>
          ))}
        </div>

        {bill?.note && (
          <p className="text-[14px] mt-2 font-bold italic text-gray-500">
            note : ( {bill?.note} )
          </p>
        )}

        {/* <div>PrintLabel component</div> */}
        <span className="mt-2 flex items-center justify-between font-bold">
          <div>
            {moment(bill?.createdAt).format("DD/MM")} |{" "}
            {moment(bill?.createdAt).format("LT")}
          </div>
          <div>
            {moneyCurrency(totalPrice())} {storeDetail?.firstCurrency}
          </div>
        </span>
      </div>
    </>
  );
}
