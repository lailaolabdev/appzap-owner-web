import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create BroadcastChannels for cross-tab/window communication
const cfdBroadcast = new BroadcastChannel("cfd-channel");
const connectionBroadcast = new BroadcastChannel("cfd-connection");
const orderBroadcast = new BroadcastChannel("cfd-order");

/**
 * Main CFD Store - Consolidated store for Customer Facing Display
 * Combines functionality from useSecondScreenStore and slideImageStore
 * with additional features for connection monitoring and display configuration
 */
export const useCFDStore = create(
  persist(
    (set, get) => ({
      // Connection Status
      connectionStatus: "disconnected", // 'connected' | 'disconnected'
      lastHeartbeat: null,
      screensDetected: 0,
      secondScreenAvailable: false,

      // Display Mode & Toggles
      isToggledOpenTwoScreen: false,
      isToggledSlide: true,
      isToggledTable: true,
      isToggled: true, // Show title/header

      // Display Settings (Store-level configuration)
      cfdSettings: {
        showItemImages: true,
        showPrices: true,
        showTaxes: true,
        showTotals: true,
        showPromotions: true,
        showChange: true,
        showDiscounts: true,
        enabledForStoreType: ["GENERAL", "CAFE"],
      },

      // Active Order Data
      activeOrderData: null,
      activeTableInfo: null,

      // Slide Images
      slideImages: [],
      activeSlideSet: [],
      
      // Second Screen State
      isToggledOpenScreen: [],

      // Actions - Connection Management
      setConnectionStatus: (status) => {
        const newState = { 
          connectionStatus: status, 
          lastHeartbeat: new Date().toISOString() 
        };
        set(newState);
        connectionBroadcast.postMessage({ type: "STATUS_UPDATE", ...newState });
      },

      sendHeartbeat: () => {
        const heartbeat = {
          type: "HEARTBEAT",
          timestamp: new Date().toISOString(),
          source: "main",
        };
        connectionBroadcast.postMessage(heartbeat);
        set({ lastHeartbeat: heartbeat.timestamp });
      },

      setScreensDetected: (count) => {
        set({ screensDetected: count, secondScreenAvailable: count > 1 });
      },

      // Actions - Display Toggles
      setToggleOpenTwoScreen: (value) => {
        set({ isToggledOpenTwoScreen: value });
        cfdBroadcast.postMessage({ type: "TOGGLE_OPEN", value });
      },

      setToggleSlide: (value) => {
        set({ isToggledSlide: value });
        cfdBroadcast.postMessage({ type: "TOGGLE_SLIDE", value });
      },

      setToggleTable: (value) => {
        set({ isToggledTable: value });
        cfdBroadcast.postMessage({ type: "TOGGLE_TABLE", value });
      },

      setToggleTitle: (value) => {
        set({ isToggled: value });
        cfdBroadcast.postMessage({ type: "TOGGLE_TITLE", value });
      },

      // Actions - CFD Settings
      setCFDSettings: (settings) => {
        set({ cfdSettings: { ...get().cfdSettings, ...settings } });
        cfdBroadcast.postMessage({ type: "SETTINGS_UPDATE", settings });
      },

      updateCFDSetting: (key, value) => {
        const newSettings = { ...get().cfdSettings, [key]: value };
        set({ cfdSettings: newSettings });
        cfdBroadcast.postMessage({ 
          type: "SETTING_UPDATE", 
          key, 
          value, 
          settings: newSettings 
        });
      },

      // Actions - Order Management
      setActiveOrderData: (orderData) => {
        set({ activeOrderData: orderData });
        orderBroadcast.postMessage({ type: "ORDER_UPDATE", orderData });
      },

      setActiveTableInfo: (tableInfo) => {
        set({ activeTableInfo: tableInfo });
        orderBroadcast.postMessage({ type: "TABLE_INFO", tableInfo });
      },

      clearActiveOrder: () => {
        set({ activeOrderData: null, activeTableInfo: null });
        orderBroadcast.postMessage({ type: "ORDER_CLEAR" });
      },

      // Actions - Slide Images
      setSlideImages: (images) => {
        set({ slideImages: images });
      },

      setActiveSlideSet: (slides) => {
        set({ activeSlideSet: slides });
        cfdBroadcast.postMessage({ type: "SLIDES_UPDATE", slides });
      },

      // Actions - Second Screen
      addOpenScreen: (data) => {
        const sanitizedData = JSON.parse(JSON.stringify(data));
        set((state) => {
          const currentArray = Array.isArray(state.isToggledOpenScreen)
            ? state.isToggledOpenScreen
            : [];
          const updatedArray = [...currentArray, sanitizedData];
          return { isToggledOpenScreen: updatedArray.slice(-100) };
        });
      },

      clearOpenScreens: () => {
        set({ isToggledOpenScreen: [] });
      },

      // Get current display mode
      getDisplayMode: () => {
        const state = get();
        if (state.isToggledSlide && state.isToggledTable) return "both";
        if (state.isToggledSlide) return "slide";
        if (state.isToggledTable) return "table";
        return "none";
      },
    }),
    {
      name: "cfd-store",
      getStorage: () => localStorage,
      // Only persist necessary data, not broadcast channels
      partialize: (state) => ({
        isToggledOpenTwoScreen: state.isToggledOpenTwoScreen,
        isToggledSlide: state.isToggledSlide,
        isToggledTable: state.isToggledTable,
        isToggled: state.isToggled,
        cfdSettings: state.cfdSettings,
        slideImages: state.slideImages,
        activeSlideSet: state.activeSlideSet,
      }),
    }
  )
);

// Listen for connection status updates from other windows
connectionBroadcast.onmessage = (event) => {
  const { type, timestamp } = event.data;
  
  if (type === "HEARTBEAT") {
    useCFDStore.setState({ 
      connectionStatus: "connected",
      lastHeartbeat: timestamp 
    });
  } else if (type === "HEARTBEAT_RESPONSE") {
    useCFDStore.setState({ 
      connectionStatus: "connected",
      lastHeartbeat: timestamp 
    });
  } else if (type === "STATUS_UPDATE") {
    useCFDStore.setState({ 
      connectionStatus: event.data.connectionStatus,
      lastHeartbeat: event.data.lastHeartbeat 
    });
  }
};

// Listen for CFD broadcast updates
cfdBroadcast.onmessage = (event) => {
  const { type, value, settings } = event.data;
  
  switch (type) {
    case "TOGGLE_OPEN":
      useCFDStore.setState({ isToggledOpenTwoScreen: value });
      break;
    case "TOGGLE_SLIDE":
      useCFDStore.setState({ isToggledSlide: value });
      break;
    case "TOGGLE_TABLE":
      useCFDStore.setState({ isToggledTable: value });
      break;
    case "TOGGLE_TITLE":
      useCFDStore.setState({ isToggled: value });
      break;
    case "SETTINGS_UPDATE":
      useCFDStore.setState({ cfdSettings: { ...useCFDStore.getState().cfdSettings, ...settings } });
      break;
    case "SLIDES_UPDATE":
      useCFDStore.setState({ activeSlideSet: event.data.slides });
      break;
    default:
      break;
  }
};

// Listen for order updates
orderBroadcast.onmessage = (event) => {
  const { type, orderData, tableInfo } = event.data;
  
  switch (type) {
    case "ORDER_UPDATE":
      useCFDStore.setState({ activeOrderData: orderData });
      break;
    case "TABLE_INFO":
      useCFDStore.setState({ activeTableInfo: tableInfo });
      break;
    case "ORDER_CLEAR":
      useCFDStore.setState({ activeOrderData: null, activeTableInfo: null });
      break;
    default:
      break;
  }
};

// Heartbeat mechanism - check connection every 5 seconds
let heartbeatInterval;

export const startHeartbeat = () => {
  if (heartbeatInterval) return;
  
  heartbeatInterval = setInterval(() => {
    const state = useCFDStore.getState();
    const now = new Date().getTime();
    const lastHeartbeat = state.lastHeartbeat ? new Date(state.lastHeartbeat).getTime() : 0;
    
    // If no heartbeat in last 10 seconds, mark as disconnected
    if (now - lastHeartbeat > 10000) {
      useCFDStore.setState({ connectionStatus: "disconnected" });
    }
    
    // Send heartbeat
    state.sendHeartbeat();
  }, 5000);
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Export broadcast channels for external use if needed
export { cfdBroadcast, connectionBroadcast, orderBroadcast };

