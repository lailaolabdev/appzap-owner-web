import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./styles.css";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import Box from "../../components/Box";
import { Breadcrumb, Button } from "react-bootstrap";
import { useStore } from "../../store";
import { END_POINT_SEVER } from "../../constants/api";

export default function MenuSortPage() {
  // state
  const [items, setItems] = useState([]);

  // provider
  const { menus } = useStore();

  // useEffect

  useEffect(() => {
    if (menus) {
      setItems(menus);
    }
  }, [menus]);

  // function
  async function onSaveSort() {
    const data = items.map((e, i) => ({ id: e._id, sort: i + 1 }));
    
    await axios.post(`${END_POINT_SEVER}/v4/menus-sort/update`, data);
  }
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
      <div style={{ marginBottom: 10 }}>
        <Button onClick={onSaveSort}>Save</Button>
      </div>
      <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="items"
          boxesPerRow={6}
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
                {item.name}
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
    </Box>
  );
}
