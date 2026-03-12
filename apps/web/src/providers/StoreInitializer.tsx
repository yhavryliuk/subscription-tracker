"use client";

import { useEffect } from "react";
import {
  initFromStorage,
  type UserShortInfo,
} from "@/features/account/model/account.slice";
import { useAppDispatch } from "@/shared/hooks/store-hooks";
import { StorageKeys, storage } from "@/shared/lib/storage";

// To avoid rehydration errors
export const StoreInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      initFromStorage({
        isMobileSidebarOpened:
          storage.getItem<boolean>(StorageKeys.IS_MOBILE_SIDEBAR_OPEN, true) ??
          false,
        userShortInfo:
          storage.getItem<UserShortInfo>(StorageKeys.USER_SHORT_INFO, true) ??
          null,
      }),
    );
  }, [dispatch]);

  return null;
};
