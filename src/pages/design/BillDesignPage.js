import React from "react";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";

export default function BillDesignPage() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        padding: 10,
      }}
    >
      <Box>
        <BillForChef58 selectedTable={{ name: "A01" }} />
      </Box>
      <Box>
        <BillForChef80 />
      </Box>
      <Box>
        <BillForCheckOut58 />
      </Box>
      <Box>
        <BillForCheckOut80 />
      </Box>
    </div>
  );
}

const Box = ({ children }) => {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 8,
        border: "1px solid #ccc",
        background: "orange",
      }}
    >
      {children}
    </div>
  );
};
