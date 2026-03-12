import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/stores";

const selectAccountState = (state: RootState) => state.account;

export const getIsMobileSidebarOpened = createSelector(
  selectAccountState,
  (account) => account.isMobileSidebarOpened,
);

export const getUserShortInfo = createSelector(
  selectAccountState,
  (account) => account.userShortInfo,
);

export const getUsername = createSelector(getUserShortInfo, (userShortInfo) => {
  return userShortInfo?.email;
});
