"use client";

import { useEffect } from "react";

export default function PageReadySignal() {
  useEffect(() => {
    (window as any).__pageDataReady = true;
    document.dispatchEvent(new CustomEvent("pageDataReady"));

    return () => {
      (window as any).__pageDataReady = false;
      (window as any).__loaderDone = false;
    };
  }, []);
  return null;
}
