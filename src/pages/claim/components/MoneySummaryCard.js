import React from "react";
import { GiMoneyStack } from "react-icons/gi";
import { moneyCurrency } from "../../../helpers";

const MoneySummaryCard = ({ amount, currency }) => (
  <div className="my-3">
    <div className="max-w-lg p-4 border-2 border-orange-500 bg-white rounded-lg shadow-xl w-[350px] h-[160px]">
      <div className="flex flex-row items-center gap-3">
        <span className="bg-orange-500 border border-orange-500 w-[80px] h-[80px] rounded-full relative">
          <GiMoneyStack className="absolute top-4 right-4 text-[50px] text-white" />
        </span>
        <div className="flex flex-col justify-center items-center mt-2">
          <h4 className="text-lg text-gray-500 font-bold">Total Money Claim</h4>
          <h2 className="text-3xl font-bold text-orange-600 text-center">
            {moneyCurrency(amount)} {currency}
          </h2>
        </div>
      </div>
    </div>
  </div>
);

export default MoneySummaryCard;
