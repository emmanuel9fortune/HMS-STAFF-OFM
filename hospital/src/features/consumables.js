import { createSlice } from '@reduxjs/toolkit';

const loadConsumeFromLocalStorage = () => {
  const savedConsume = localStorage.getItem('Consume');
  return savedConsume ? JSON.parse(savedConsume) : { items: [] };
};

const saveConsumeToLocalStorage = (items) => {
  localStorage.setItem('Consume', JSON.stringify({ items }));
};

const ConsumeSlice = createSlice({
  name: 'Consume',
  initialState: loadConsumeFromLocalStorage(),
  reducers: {
    addToConsume(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
  
      if (!existingItem) {
        state.items.push(action.payload);
        saveConsumeToLocalStorage(state.items);
      }
    },
    removeFromConsume(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveConsumeToLocalStorage(state.items);
    },
    emptyConsume(state, action) {
      state.items = [];
      saveConsumeToLocalStorage(state.items);
    },
    editConsumeItem(state, action) {
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

        saveConsumeToLocalStorage(state.items);
      }
    }
  },
});
export const selectConsumeTotalPrice = (state) => {
  return state.Consume.items.reduce((total, item) => total + item.totalPrice, 0);
};
export const selectConsumeactualPrice = (state) => {
  return state.Consume.items.reduce((total, item) => total + item.actualPrice, 0);
};
export const { addToConsume, editConsumeItem, removeFromConsume, emptyConsume } = ConsumeSlice.actions; 
export default ConsumeSlice.reducer;
