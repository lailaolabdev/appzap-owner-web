import { useShiftStore } from "../../zustand/ShiftStore";
import PopUpOpenShift from "../../components/popup/PopUpOpenShift";

export default function ShiftOpenPages() {
  const { shiftCurrent } = useShiftStore();

  return (
    <>
      <PopUpOpenShift open={shiftCurrent[0]?.status !== "OPEN"} />
    </>
  );
}
