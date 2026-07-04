import { createSlice } from '@reduxjs/toolkit';

const loadUtilsFromLocalStorage = () => {
  const savedUtils = localStorage.getItem('Utils');
  return savedUtils ? JSON.parse(savedUtils) : { items: [] };
};

const saveUtilsToLocalStorage = (items) => {
  localStorage.setItem('Utils', JSON.stringify({ items }));
};

const UtilsSlice = createSlice({
  name: 'Utils',
  initialState: loadUtilsFromLocalStorage(),
  reducers: {
    addToUtils(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
  
      if (!existingItem) {
        state.items.push(action.payload);
        saveUtilsToLocalStorage(state.items);
      }
    },
    removeFromUtils(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveUtilsToLocalStorage(state.items);
    },
    emptyUtils(state, action) {
      state.items = [];
      saveUtilsToLocalStorage(state.items);
    },
    editUtilsItem(state, action) {
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

        saveUtilsToLocalStorage(state.items);
      }
    }
  },
});
export const selectUtilsTotalPrice = (state) => {
  return state.Utils.items.reduce((total, item) => total + item.totalPrice, 0);
};
export const selectUtilsactualPrice = (state) => {
  return state.Utils.items.reduce((total, item) => total + item.actualPrice, 0);
};
export const { addToUtils, editUtilsItem, removeFromUtils, emptyUtils } = UtilsSlice.actions; 
export default UtilsSlice.reducer;
