import { createSlice } from '@reduxjs/toolkit';

const loadPayFromLocalStorage = () => {
  const savedPay = localStorage.getItem('Pay');
  return savedPay ? JSON.parse(savedPay) : { items: [] };
};

const savePayToLocalStorage = (items) => {
  localStorage.setItem('Pay', JSON.stringify({ items }));
};

const PaySlice = createSlice({
  name: 'Pay',
  initialState: loadPayFromLocalStorage(),
  reducers: {
    addToPay(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
  
      if (!existingItem) {
        state.items.push(action.payload);
        savePayToLocalStorage(state.items);
      }
    },
    removeFromPay(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      savePayToLocalStorage(state.items);
    },
    emptyPay(state, action) {
      state.items = [];
      savePayToLocalStorage(state.items);
    },
    editPayItem(state, action) {
      const { id, quantity, totalPrice, actualPrice } = action.payload;
      const index = state.items.findIndex(item => item.id === id);

      if (index !== -1) {
        // ✅ update directly via index — ensures mutation is tracked
        state.items[index] = {
          ...state.items[index],
          quantity,
          totalPrice,
          actualPrice,
        };

        savePayToLocalStorage(state.items);
      }
    }
  },
});
export const selectPayTotalPrice = (state) => {
  return state.Pay.items.reduce((total, item) => total + item.totalPrice, 0);
};
export const selectPayactualPrice = (state) => {
  return state.Pay.items.reduce((total, item) => total + item.actualPrice, 0);
};
export const { addToPay, editPayItem, removeFromPay, emptyPay } = PaySlice.actions; 
export default PaySlice.reducer;
