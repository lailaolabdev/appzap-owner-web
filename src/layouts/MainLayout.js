import React, { useState, useEffect } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
import Sidenav from "./SideNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PopUpShowSales from "../components/popup/PopUpShowSales";
import { END_POINT_SEVER, getLocalData } from "../constants/api";
import axios from "axios";
import { useStore } from "../store";

export default function MainLayout({ children }) {
  const [expanded, setExpanded] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const _onToggle = (exp) => {
    setExpanded(exp);
  };

  const [popup, setPopup] = useState({ PopUpShowSales: true });
  const [salesId, setSalesId] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, storeDetail } = useStore();
  const [selectId, setSelectId] = useState(null);

  const storeId = storeDetail._id;

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${END_POINT_SEVER}/v3/show-sales`);
      setSalesId(response.data[0].selectedStores[0]);
      setSalesData(response.data[0]);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("salesData._id:",salesData._id)



  const updateAvailableStoreId = async ( id, isAvailable) => {
    try {
      await axios.put(`${END_POINT_SEVER}/v3/show-sales//v3/show-sales/updateAvailableStoreId/${id}`, {
        isAvailable,
        salesId:salesData._id
      });
      await fetchSalesData(); // รีโหลดข้อมูลหลังอัพเดต
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  // ฟังก์ชันอัพเดตจำนวนคลิก
  const updateSales = async (id, currentClicks) => {
    try {
      const updatedClicks = (currentClicks || 0) + 1;
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/${id}`, {
        clicks: updatedClicks,
      });
      await fetchSalesData(); // รีโหลดข้อมูลหลังอัพเดต
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  // Initial fetch และ interval
  useEffect(() => {
    fetchSalesData();
    const intervalId = setInterval(fetchSalesData, 60000);
    return () => clearInterval(intervalId);
  }, [storeId]);

  useEffect(() => {
    if (!isLoading) {
      if (salesId === null) {
        setPopup({ PopUpShowSales: true });
      } else {
        const matchedStore = salesData.selectedStores.find(
          (store) => store.storeId === storeId
        );
  
        if (matchedStore) {
          setSelectId(matchedStore._id); // Log `_id` ของ store ที่ตรง
          setPopup({ PopUpShowSales: true });
        } else {
          setPopup({ PopUpShowSales: false });
        }
      }
    }
  }, [salesId, storeId, isLoading]);
  

  return (
    <Box
      sx={{
        paddingLeft: { md: 65 },
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: { md: "block", xs: "block" },
          height: 64,
          maxHeight: 64,
          width: 64,
          overflow: { md: "visible", xs: expanded ? "visible" : "hidden" },
          transform: "translate3d(0,0,0)",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 100000,
        }}
      >
        <Sidenav
          location={location}
          navigate={navigate}
          onToggle={(exp) => _onToggle(exp)}
        />
      </Box>
      <Navbar />
      <div
        style={{
          marginTop: 65,
          minHeight: "calc( 100dvh - 65px )",
          height: "calc( 100dvh - 65px )",
          maxHeight: "calc( 100dvh - 65px )",
          overflow: "auto",
          overflowY: "scroll",
          position: "relative",
        }}
      >
        {!isLoading && (
          <PopUpShowSales
            open={popup?.PopUpShowSales}
            onClose={() => {
              setPopup();
            }}
            salesData={salesData}
            selectId={selectId}
            END_POINT_SEVER={END_POINT_SEVER}
            updateAvailableStoreId={updateAvailableStoreId}
            updateSales={updateSales}
          />
        )}
        <Outlet />
      </div>
    </Box>
  );
}