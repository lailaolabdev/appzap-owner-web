import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSlideImageStore = create(
  persist(
    (set) => ({
      UseSlideImage: [],
      setUseSlideImage: (menus) => {
        set({ UseSlideImage: menus });
      },
      clearUseSlideImage: () => {
        set({ UseSlideImage: [] });
      },
    }),
    {
      name: "use-slide-image",
      getStorage: () => localStorage,
    }
  )
);

export const useCombinedToggleSlide = create(
  persist(
    (set) => ({
      isToggledOpenTwoScreen: false,
      isToggledSlide: true,
      isToggledTable: true,
      isToggled: true,

      // Toggle functions

      SettoggleOpenTwoScreen: (data) => {
        set({ isToggledOpenTwoScreen: data });
      },
      SettoggleSlide: (data) => {
        set({ isToggledSlide: data }); // Corrected key
      },
      SettoggleTable: (data) => {
        set({ isToggledTable: data }); // Corrected key
      },
      Settoggle: (data) => {
        set({ isToggled: data });
      },
    }),
    {
      name: "toggle-store", // Persisted state key
      getStorage: () => localStorage, // Use localStorage
    }
  )
);

// Create a BroadcastChannel for cross-tab communication
const broadcast = new BroadcastChannel("toggle-channel");

export const useChangeMoney = create(
  persist(
    (set) => ({
      ChangeAmount: 0,

      // Function to update the state and broadcast the change
      SetChangeAmount: (data) => {
        const newState = { ChangeAmount: data };
        set(newState); // Update local state
        broadcast.postMessage(newState); // Broadcast the change to other tabs/windows
      },

      ClearChangeAmount: () => {
        set({ ChangeAmount: 0 });
      },
    }),
    {
      name: "change-money", // Persisted state key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

// Listen for updates from other tabs/windows
broadcast.onmessage = (event) => {
  const setState = useChangeMoney.setState; // Access the setState API
  setState(event.data); // Update the state with data received from other tabs/windows
};
