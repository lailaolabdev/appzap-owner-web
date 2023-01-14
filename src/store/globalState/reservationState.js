import { useState } from "react";

export const useReservationState = () => {
  const [isReservationLoading, setReservationLoading] = useState(false);
  const [reservation, setReservation] = useState([]);

  return {
    isReservationLoading,
    setReservationLoading,
    reservation,
    setReservation,
  };
};
