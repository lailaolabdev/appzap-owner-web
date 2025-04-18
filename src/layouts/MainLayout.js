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
  addStoreId,
  updateSalesClick,
  updateViews,
  updateStoreAvailability,
} from "../services/showSales";
import { handleTimeShowSales } from "../helpers/handleTimeShowSales";
import { useStore } from "../store";
import { showSalesService } from "../services/showSales";
import moment from "moment";

// import { useStoreStore } from "../zustand/storeStore";
import { useShiftStore } from "../zustand/ShiftStore";

export default function MainLayout({ children }) {
  const [expanded, setExpanded] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const _onToggle = (exp) => {
    setExpanded(exp);
  };

  const [popup, setPopup] = useState({ PopUpShowSales: true });
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { storeDetail } = useStoreStore();
  const [selectId, setSelectId] = useState(null);
  const [hasUpdatedForNone, setHasUpdatedForNone] = useState(false);
  const [daysCounter, setDaysCounter] = useState(0);
  const [hasUpdatedViews, setHasUpdatedViews] = useState(false);
  const { profile } = useStore();
  // const { storeDetail } = useStoreStore();
  const { getShift } = useShiftStore();
  // const [selectId, setSelectId] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));

  const storeId = storeDetail?._id;
  const allIdOfSelectStore = salesData?.selectedStores?.map((id) => id._id);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSalesData();
      setSalesData(data || null);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setPopup({ PopUpShowSales: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleaddStoreId = async (id, isAvailable) => {
    try {
      const updatedData = await addStoreId(
        id,
        isAvailable,
        salesData?._id,
        storeId
      );
      // const updatedData = await showSalesService.updateAvailableStoreId(
      //   id,
      //   isAvailable,
      //   salesData?._id,
      //   storeDetail._id
      // );
      if (updatedData) {
        setSalesData(updatedData);
        const isUpdateSuccessful = updatedData.selectedStores?.some(
          (store) => store._id === id && store.isAvailable === isAvailable
        );
        if (!isUpdateSuccessful) {
          console.error("Store addStoreId failed to reflect in data");
        }
      }
    } catch (error) {
      console.error("Error addStoreId:", error);
    }
  };

  const handleUpdateStoreAvailability = async () => {
    try {
      await updateStoreAvailability(salesData?._id, allIdOfSelectStore, true);
    } catch (error) {
      console.error("Error updateStoreAvailability:", error);
    }
  };

  const handleUpdateSalesClick = async (id) => {
    try {
      await updateSalesClick(id);
      await fetchData();
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  const GetOpenShift = async (startDate) => {
    const endDate = startDate; // Same date range for a single day
    const findBy = `startDate=${startDate}&endDate=${endDate}&status=OPEN`;
    await getShift(findBy);
  };

  useEffect(() => {
    GetOpenShift(startDate);
  }, []);

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
    let updateIntervalId = null;

    if (!isLoading && salesData && storeDetail) {
      const targetStore = salesData?.selectedStores?.find(
        (store) => store.storeId === storeId || store.storeId === null
      );

      const isUnavailableStore = salesData?.selectedStores?.some(
        (store) => store.storeId === storeId && store.isAvailable === false
      );

      if (targetStore && !isUnavailableStore) {
        const { shouldShow, updateInterval } = handleTimeShowSales({
          salesData,
          popup,
          hasUpdatedForNone,
          daysCounter,
          handleUpdateStoreAvailability,
          setDaysCounter,
          setHasUpdatedForNone,
        });

        updateIntervalId = updateInterval;
        setSelectId(targetStore._id);

        // เช็คว่าควรแสดง popup และยังไม่เคย update views
        if (shouldShow && !hasUpdatedViews) {
          updateViews(salesData?._id);
          setHasUpdatedViews(true); // mark ว่า update แล้ว
        }

        setPopup({ PopUpShowSales: targetStore.isAvailable && shouldShow });
      } else {
        setPopup({ PopUpShowSales: false });
      }
    }

    return () => {
      if (updateIntervalId) {
        clearTimeout(updateIntervalId);
      }
    };
  }, [salesData, storeDetail, isLoading]);

  useEffect(() => {
    setHasUpdatedViews(false);
  }, [salesData?.selectedStores?.map((id) => id.isAvailable)]);

  useEffect(() => {
    setDaysCounter(0);
  }, [salesData?.repeatFrequency]);

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
        <Outlet />
      </div>
    </Box>
  );

  return renderLayout();
}
