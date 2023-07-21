import React, { useEffect, useState } from "react";
// import "./styles.css";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import Box from "../../components/Box";
import { Breadcrumb } from "react-bootstrap";
import { useStore } from "../../store";

export default function MenuSortPage() {
  // state
  const [items, setItems] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  // provider
  const { menuStart } = useStore();

  // useEffect

  useEffect(() => {}, []);

  // function
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const nextState = swap(items, sourceIndex, targetIndex);
    setItems(nextState);
  }

  return (
    <Box sx={{ padding: { md: 20, xs: 10 } }}>
      <Breadcrumb>
        <Breadcrumb.Item>ຈັດການເມນູ</Breadcrumb.Item>
        <Breadcrumb.Item active>ຈັດລຽງເມນູ</Breadcrumb.Item>
      </Breadcrumb>
      {/* <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="items"
          boxesPerRow={4}
          rowHeight={100}
          style={{ height: "400px" }}
        >
          {items.map((item) => (
            <GridItem
              key={item}
              style={{ backgroundColor: "#ccc", border: "1px solid #000" }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                }}
              >
                {item}
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider> */}
    </Box>
  );
}
