import { useState, useEffect } from "react";

export default function useChecksum(value) {
  const [checksum, setChecksum] = useState(0);

  useEffect(() => {
    setChecksum((checksum) => checksum + 1);
  }, [value]);

  return checksum;
}
