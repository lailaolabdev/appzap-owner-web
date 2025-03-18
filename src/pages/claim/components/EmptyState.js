import React from "react";
import { FcEmptyTrash } from "react-icons/fc";

const EmptyState = () => (
  <tr>
    <td colSpan={9}>
      <div className="flex flex-col items-center mt-4">
        <p className="text-orange-500 text-[18px] font-bold">ບໍ່ມີຂໍ້ມູນ</p>
        <FcEmptyTrash className="text-orange-500 text-[60px] animate-bounce" />
      </div>
    </td>
  </tr>
);

export default EmptyState;
