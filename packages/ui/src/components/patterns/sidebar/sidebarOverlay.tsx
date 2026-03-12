import clsx from "clsx";
import { type KeyboardEventHandler, useCallback } from "react";

type SidebarOverlayProps = {
  onClose?: () => void;
  closeOnEscape?: boolean;
};

export function SidebarOverlay({
  onClose,
  closeOnEscape = false,
}: SidebarOverlayProps) {
  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (closeOnEscape || onClose === undefined) {
        return;
      }
      if (event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: <explanation>
    <div
      aria-label="Sidebar Overlay"
      className={clsx("absolute inset-0 bg-black/50 dark:bg-white/50")}
      onClick={onClose}
      onKeyUp={handleKeyUp}
    />
  );
}
