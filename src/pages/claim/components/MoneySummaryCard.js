import React from "react";
import { GiMoneyStack } from "react-icons/gi";
import { moneyCurrency } from "../../../helpers";

const MoneySummaryCard = ({ amount, currency }) => (
  <div className="my-3">
    <div className="py-4 px-8 border-2 border-orange-500 bg-white rounded-xl shadow-xl w-fit">
      <div className="flex flex-row items-center gap-4">
        <span className="bg-orange-500 border border-orange-500 w-20 h-20 rounded-full relative">
          <GiMoneyStack className="absolute top-4 right-4 text-[50px] text-white" />
        </span>
        <div className="flex flex-col justify-center items-start">
          <h4 className="text-lg text-gray-500 font-bold">Total Money Claim</h4>
          <h2 className="text-2xl font-bold text-orange-600 text-center">
            {moneyCurrency(amount)} {currency === "LAK" ? "ກີບ" : currency}
          </h2>
        </div>
      </div>
    </div>
  </div>
);

export default MoneySummaryCard;
