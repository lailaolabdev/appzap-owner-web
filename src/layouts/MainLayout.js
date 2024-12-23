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
  const [viewTracked, setViewTracked] = useState(false);

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

  const updateAvailableStoreId = async (id, isAvailable) => {
    try {
      const response = await axios.put(`${END_POINT_SEVER}/v3/show-sales/updateAvailableStoreId/${id}`, {
        isAvailable,
        salesId: salesData._id,
        storeId: storeDetail._id
      });
      
      // ອັບເດດ salesData ດ້ວຍຂໍ້ມຼນຈາກ respons
      setSalesData(response.data);
  
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };
  

  const updateSales = async (id, currentClicks) => {
    try {
      const updatedClicks = (currentClicks || 0) + 1;
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/${id}`, {
        clicks: updatedClicks,
      });
      await fetchSalesData(); 
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };


  // Initial fetch and interval
  useEffect(() => {
    fetchSalesData();
    const intervalId = setInterval(fetchSalesData, 60000);
    return () => clearInterval(intervalId);
  }, [storeId]);


  const updateViews = async (id) => {
    try {
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/updateViews/${id}`);
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  useEffect(() => {
    if (!isLoading && salesData && popup?.PopUpShowSales && !viewTracked) {
      updateViews(salesData._id);
      setViewTracked(true);
    }
  }, [isLoading, salesData, popup?.PopUpShowSales, viewTracked]);

  // reset viewTracked ເມື່ອ salesData ປ່ຽນ
  useEffect(() => {
    setViewTracked(false);
  }, [salesData._id]);



  useEffect(() => {
    if (!isLoading && salesData) {
      const hasNullStore = salesData.selectedStores.some(store => store.storeId === null);
      const currentStore = salesData.selectedStores.find(
        store => store.storeId === storeDetail._id || store.storeId === null
      );
  
      if (hasNullStore) {
        // กรณี store ทั้งหมด (storeId = null)
        const specificStore = salesData.selectedStores.find(
          store => store.storeId === storeDetail._id
        );
        
        if (specificStore) {
          // ถ้ามี store เฉพาะแล้ว ใช้ค่า isAvailable ของ store นั้น
          setSelectId(specificStore._id);
          setPopup({ PopUpShowSales: specificStore.isAvailable });
        } else {
          // ถ้ายังไม่มี store เฉพาะ ใช้ค่าจาก store ที่เป็น null
          const nullStore = salesData.selectedStores.find(store => store.storeId === null);
          setSelectId(nullStore._id);
          setPopup({ PopUpShowSales: nullStore.isAvailable });
        }
      } else {
        // กรณีปกติ
        if (currentStore) {
          setSelectId(currentStore._id);
          setPopup({ PopUpShowSales: currentStore.isAvailable });
        } else {
          setPopup({ PopUpShowSales: false });
        }
      }
    }
  }, [salesData, storeDetail._id, isLoading]);

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