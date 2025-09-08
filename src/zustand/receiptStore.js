import { create } from 'zustand';

export const useReceiptStore = create((set) => ({
  businessName: 'Appzap POS',
  address: 'Chanthabuly, Vientiane, Laos',
  phone: '+856 20 5555 8899',
  email: 'info@chainpos.com',
  footerText: 'Thank you for your business!',
  showTaxInfo: false,
  showQRCode: false,
  showSizeRate: false,
  showPrice: true,
  showUserName: false,
  nameCodeSize: 'medium', // 'small', 'medium', 'large'
  userName: 'John Doe',
  setBusinessName: (businessName) => set({ businessName }),
  setAddress: (address) => set({ address }),
  setPhone: (phone) => set({ phone }),
  setEmail: (email) => set({ email }),
  setFooterText: (footerText) => set({ footerText }),
  setShowTaxInfo: (showTaxInfo) => set({ showTaxInfo }),
  setShowQRCode: (showQRCode) => set({ showQRCode }),
  setShowSizeRate: (showSizeRate) => set({ showSizeRate }),
  setShowPrice: (showPrice) => set({ showPrice }),
  setShowUserName: (showUserName) => set({ showUserName }),
  setNameCodeSize: (nameCodeSize) => set({ nameCodeSize }),
  setUserName: (userName) => set({ userName }),
}));