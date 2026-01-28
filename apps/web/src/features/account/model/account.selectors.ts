import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/stores";

const selectAccount =(state: RootState) => state.account;

export const getIsMobileSidebarOpened = createSelector(
  selectAccount,
  (account) => account.isMobileSidebarOpened,
);

export const getUserShortInfo = createSelector(
  selectAccount,
  (account) => account.userShortInfo,
);
