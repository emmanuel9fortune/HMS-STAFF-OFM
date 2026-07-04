import { createSlice } from '@reduxjs/toolkit';
// reduxSlice.js
const initialState = {
  reload: false, // or a timestamp/counter
};

const slice = createSlice({
  name: 'reload',
  initialState,
  reducers: {
    setreloads: (state, action) => {
      state.reload = action.payload;
    },
  },
});

export const { setreloads } = slice.actions;
export default slice.reducer;
