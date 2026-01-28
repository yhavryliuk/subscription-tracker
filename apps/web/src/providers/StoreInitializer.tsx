'use client';

import { useEffect } from "react";
import {
  initFromStorage,
  UserShortInfo,
} from "@/features/account/model/account.slice";
import { storage, StorageKeys } from "@/shared/lib/storage";
import { useAppDispatch } from "@/shared/hooks/store-hooks";

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
