import React, { useState, useEffect } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
import Sidenav from "./SideNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PopUpShowSales from "../components/popup/PopUpShowSales";
import { END_POINT_SEVER } from "../constants/api";
import { useStore } from "../store";
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
  const { profile, storeDetail } = useStore();
  const [selectId, setSelectId] = useState(null);

  const storeId = storeDetail?._id;
  console.log("salesData... :",salesData)

  const fetchSalesData = async () => {
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

  const updateAvailableStoreId = async (id, isAvailable) => {
    if (!storeDetail) return;
    try {
      const updatedData = await updateAvailableStoreId(
        id, 
        isAvailable, 
        salesData?._id, 
        storeDetail._id
      );
      if (updatedData) {
        setSalesData(updatedData);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const updateSalesClick = async (id, currentClicks) => {
    if (!storeDetail) return;
    try {
      const success = await updateSalesClick(id, currentClicks);
      if (success) {
        await fetchSalesData();
      }
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  useEffect(() => {
    if (storeDetail) {
      fetchSalesData();
      const intervalId = setInterval(fetchSalesData, 60000);
      return () => clearInterval(intervalId);
    } else {
      setIsLoading(false);
      setPopup({ PopUpShowSales: false });
    }
  }, [storeDetail?._id]);

  
  useEffect(() => {
    if (!isLoading && salesData && popup?.PopUpShowSales) {
      updateViews(salesData._id);
    }
  }, [isLoading, salesData, popup?.PopUpShowSales]);

  useEffect(() => {
    if (!isLoading && salesData && storeDetail) {
      const hasNullStore = salesData.selectedStores?.some(store => store.storeId === null) || false;
      const currentStore = salesData.selectedStores?.find(
        store => store.storeId === storeDetail._id || store.storeId === null
      );
  
      if (hasNullStore) {
        const specificStore = salesData.selectedStores?.find(
          store => store.storeId === storeDetail._id
        );
        
        if (specificStore) {
          setSelectId(specificStore._id);
          setPopup({ PopUpShowSales: specificStore.isAvailable });
        } else {
          const nullStore = salesData.selectedStores?.find(store => store.storeId === null);
          if (nullStore) {
            setSelectId(nullStore._id);
            setPopup({ PopUpShowSales: nullStore.isAvailable });
          } else {
            setPopup({ PopUpShowSales: false });
          }
        }
      } else {
        if (currentStore) {
          setSelectId(currentStore._id);
          setPopup({ PopUpShowSales: currentStore.isAvailable });
        } else {
          setPopup({ PopUpShowSales: false });
        }
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
            updateAvailableStoreId={updateAvailableStoreId}
            updateSalesClick={updateSalesClick}
          />
        )}
        <Outlet />
      </div>
    </Box>
  );

  return renderLayout();
}