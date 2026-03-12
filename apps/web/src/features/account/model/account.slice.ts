import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mergeDefined } from "@/shared/helpers/merge-defined";
import { StorageKeys, storage } from "@/shared/lib/storage";

export interface UserShortInfo {
  email: string;
}

export interface AccountState {
  isLoaded: boolean;
  isMobileSidebarOpened: boolean;
  userShortInfo: UserShortInfo | null;
}

export type InitFromStoreProps = Pick<
  AccountState,
  "isMobileSidebarOpened" | "userShortInfo"
>;

const initialState: AccountState = {
  isLoaded: false,
  isMobileSidebarOpened: false,
  userShortInfo: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    initFromStorage: (state, action: PayloadAction<InitFromStoreProps>) => {
      if (state.isLoaded) {
        console.warn("accountSlice already loaded (Normal in Dev)"); // In dev - normal state, in prod - may not appear!
      }
      mergeDefined(state, action.payload);
      state.isLoaded = true;
    },
    setIsMobileSidebarOpened: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpened = action.payload;
      storage.setItem(
        StorageKeys.IS_MOBILE_SIDEBAR_OPEN,
        state.isMobileSidebarOpened,
        true,
      );
    },
    setUserShortInfo: (state, action: PayloadAction<UserShortInfo>) => {
      state.userShortInfo = action.payload;
      storage.setItem(StorageKeys.USER_SHORT_INFO, state.userShortInfo, true);
    },
  },
});

export const { setIsMobileSidebarOpened, initFromStorage, setUserShortInfo } =
  accountSlice.actions;
export default accountSlice.reducer;
