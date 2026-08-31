import { createSlice } from '@reduxjs/toolkit';

export const fidSlice = createSlice({
  name: 'fid',
  initialState: {
    fid: null,
  },
  reducers: {
    setfids: (state, action) => {
      state.fid = action.payload;
    },
  },
});

export const { setfids } = fidSlice.actions;

export const selectfid = (state) => state.fid.fid;

export default fidSlice.reducer;