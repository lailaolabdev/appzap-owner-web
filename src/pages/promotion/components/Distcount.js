import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
const Distcount = () => {
  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="bg-white rounded-xl h-full overflow-hidden">
        <CardTitle className="text-gray-700 text-[18px] py-2 px-4">
          ການຫຼຸດລາຄາຕາມລາຍການ ຫຼື ໝວດໝູ່
        </CardTitle>
        <Card className="m-4">
          <div className="p-4">
            {/* <img src="" alt="" /> */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input
                  type="text"
                  className="w-[560px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input
                  type="text"
                  className="w-[560px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input
                  type="text"
                  className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                />
              </div>
            </div>
          </div>
        </Card>
        <Card className="m-4">
          <div className="p-4">
            <img src="" alt="" />
            <div>
              <div>
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input type="text" />
              </div>
              <div>
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input type="text" />
              </div>
              <div>
                <label htmlFor="">ຊື່ໂປຣໂມຊັນ</label>
                <input type="text" />
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default Distcount;
