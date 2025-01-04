import React, { useState, useEffect } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
import Sidenav from "./SideNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PopUpShowSales from "../components/popup/PopUpShowSales";
import { END_POINT_SEVER } from "../constants/api";
import { useStoreStore } from "../zustand/storeStore";

import { 
  fetchSalesData,
  updateAvailableStoreId,
  updateSalesClick,
  updateViews 
} from '../services/showSales';

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
  const { storeDetail } = useStoreStore()
  const [selectId, setSelectId] = useState(null);

  const storeId = storeDetail?._id;


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSalesData();
      if (data) {
        setSalesId(data.selectedStores?.[0] || null);
        setSalesData(data);
      } else {
        setSalesId(null);
        setSalesData(null);
        setPopup({ PopUpShowSales: false });
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setPopup({ PopUpShowSales: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[])


  const handleUpdateAvailableStoreId = async (id, isAvailable) => {
    try {
      const updatedData = await updateAvailableStoreId(
        id, 
        isAvailable, 
        salesData?._id, 
        storeId
        
      );
      if (updatedData) {
        setSalesData(updatedData);
        // Verify the update was successful
        const isUpdateSuccessful = updatedData.selectedStores?.some(
          store => store._id === id && store.isAvailable === isAvailable
        );
        if (!isUpdateSuccessful) {
          console.error("Store availability update failed to reflect in data");
        }
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleUpdateSalesClick = async (id) => {
    try {
      const success = await updateSalesClick(id);
      if (success) {
        await fetchData(); 
      }
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };
  

  useEffect(() => {
    if (storeDetail) {
      fetchData();
      const intervalId = setInterval(fetchData, 30000);
      return () => clearInterval(intervalId);
    } else {
      setIsLoading(false);
      setPopup({ PopUpShowSales: false });
    }
  }, [storeId]);

  
  useEffect(() => {
    if (!isLoading && salesData && popup?.PopUpShowSales) {
      updateViews(salesData._id);
    }
  }, [isLoading, salesData, popup?.PopUpShowSales]);

  useEffect(() => {
    if (!isLoading && salesData && storeDetail) {
      const targetStore = salesData.selectedStores?.find(
        store => store.storeId === storeId || store.storeId === null
      );
  
      if (targetStore) {
        setSelectId(targetStore._id);
        setPopup({ PopUpShowSales: targetStore.isAvailable });
      } else {
        setPopup({ PopUpShowSales: false });
      }
    }
  }, [salesData, storeDetail, isLoading]);

  const renderLayout = () => (
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
        {!isLoading && storeDetail && (
          <PopUpShowSales
            open={popup?.PopUpShowSales}
            onClose={() => {
              setPopup();
            }}
            salesData={salesData}
            selectId={selectId}
            END_POINT_SEVER={END_POINT_SEVER}
            handleUpdateAvailableStoreId={handleUpdateAvailableStoreId}
            handleUpdateSalesClick={handleUpdateSalesClick}
          />
        )}
        <Outlet />
      </div>
    </Box>
  );

  return renderLayout();
}