"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
/**
 * Custom hook to track network status and show toast notifications.
 * Only shows a toast when the status actually changes (not on mount).
 * Only shows toast if the online status changes, not if already online.
 */
export function useNetworkStatusToast() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof window !== "undefined" && typeof navigator !== "undefined"
      ? navigator.onLine
      : true
  );
  const hasMounted = useRef(false);
  const prevOnline = useRef(isOnline);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    hasMounted.current = true;

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      prevOnline.current = isOnline;
      return;
    }
    if (prevOnline.current !== isOnline) {
      if (isOnline) {
        toast.success("You're back online");
      } else {
        toast.info("You are offline 🔌");
      }
      prevOnline.current = isOnline;
    }
  }, [isOnline]);

  return isOnline;
}
