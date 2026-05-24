"use client";

import { useState, CSSProperties } from "react";
import QuotePopup from "@/components/QuotePopup";

interface QuoteButtonProps {
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function QuoteButton({
  label = "Get a Quote",
  className = "btn-gold-cta",
  style,
}: QuoteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} style={style} onClick={() => setOpen(true)}>
        <i className="fab fa-whatsapp" style={{ marginRight: "7px" }}></i>
        {label}
      </button>
      <QuotePopup open={open} onClose={() => setOpen(false)} />
    </>
  );
}
