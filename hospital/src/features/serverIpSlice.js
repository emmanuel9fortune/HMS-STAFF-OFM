import { createSlice } from '@reduxjs/toolkit';
// reduxSlice.js
const initialState = {
  serverip: false, // or a timestamp/counter
};

const slice = createSlice({
  name: 'serverip',
  initialState,
  reducers: {
    setserverips: (state, action) => {
      state.serverip = action.payload;
    },
  },
});

export const { setserverips } = slice.actions;
export default slice.reducer;
