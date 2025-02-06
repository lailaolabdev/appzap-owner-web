import React from "react";
import { Typewriter } from "react-simple-typewriter";

export const TypeEffect = ({ storeDetail, textEffect }) => {
  return (
    <div className="flex justify-center items-center">
      <h1 className="pt-4 font-semibold text-[35px]">
        {storeDetail?.name}{" "}
        <span className="text-orange-500 font-bold">
          {/* Style will be inherited from the parent element */}
          <Typewriter
            words={[textEffect]}
            loop={5}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </span>
      </h1>
    </div>
  );
};
