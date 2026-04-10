import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  /** true once the bootstrap refresh has completed (success or failure) */
  isInitialized: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isInitialized: false,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAccessToken, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
