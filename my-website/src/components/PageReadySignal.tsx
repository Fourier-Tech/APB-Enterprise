"use client";

import { useEffect } from "react";

export default function PageReadySignal() {
  useEffect(() => {
    (window as any).__pageDataReady = true;
    document.dispatchEvent(new CustomEvent("pageDataReady"));
  }, []);
  return null;
}
