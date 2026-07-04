import { createSlice } from '@reduxjs/toolkit';

const loadPrescribeFromLocalStorage = () => {
  const savedPrescribe = localStorage.getItem('Prescribe');
  return savedPrescribe ? JSON.parse(savedPrescribe) : { items: [] };
};

const savePrescribeToLocalStorage = (items) => {
  localStorage.setItem('Prescribe', JSON.stringify({ items }));
};

const PrescribeSlice = createSlice({
  name: 'Prescribe',
  initialState: loadPrescribeFromLocalStorage(),
  reducers: {
    addToPrescribe(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
  
      if (!existingItem) {
        state.items.push(action.payload);
        savePrescribeToLocalStorage(state.items);
      }
    },
    removeFromPrescribe(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      savePrescribeToLocalStorage(state.items);
    },
    emptyPrescribe(state, action) {
      state.items = [];
      savePrescribeToLocalStorage(state.items);
    },
    editPrescribeItem(state, action) {
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

        savePrescribeToLocalStorage(state.items);
      }
    }
  },
});
export const selectPrescribeTotalPrice = (state) => {
  return state.prescribe.items.reduce((total, item) => total + item.totalPrice, 0);
};
export const selectPrescribeactualPrice = (state) => {
  return state.prescribe.items.reduce((total, item) => total + item.actualPrice, 0);
};
export const { addToPrescribe, editPrescribeItem, removeFromPrescribe, emptyPrescribe } = PrescribeSlice.actions; 
export default PrescribeSlice.reducer;
