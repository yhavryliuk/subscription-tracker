import { createAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = { accessToken: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: { payload: string }) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
