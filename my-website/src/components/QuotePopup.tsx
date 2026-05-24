"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface QuotePopupProps {
  open: boolean;
  onClose: () => void;
}

export default function QuotePopup({ open, onClose }: QuotePopupProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  // Set isMounted to true on client mount to safely render Portal without SSR hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focused Escape key listener & Body scroll-locking (Active only when modal is open)
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Calculate scrollbar width to prevent page shift layout jump on overflow: hidden
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add("modal-open");

    window.addEventListener("keydown", handleEscape);
    
    // Auto-focus the first field beautifully
    const focusTimeout = setTimeout(() => nameRef.current?.focus(), 120);

    return () => {
      clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose]);

  // Clean form fields on open/close
  useEffect(() => {
    if (!open) {
      setName("");
      setMobile("");
      setMessage("");
      setStatus("idle");
      setErrorMsg("");
    }
  }, [open]);

  if (!open || !isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      setErrorMsg("Name and mobile number are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobileNumber: mobile.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      if (data.whatsappUrl) {
        // Direct location change bypasses browser popup blockers and triggers native WhatsApp seamlessly!
        window.location.href = data.whatsappUrl;
      }

      // Close the modal cleanly after showing the success state
      setTimeout(() => {
        onClose();
      }, 2300);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const modalJSX = (
    <div
      className="qp-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="qp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qp-title"
      >
        {/* Head */}
        <div className="qp-head">
          <div className="qp-head-copy">
            <h3 id="qp-title">
              <i className="fab fa-whatsapp" style={{ marginRight: 8 }}></i>
              Get a Quick Quote
            </h3>
            <p>Fill in details — we will open WhatsApp with your message.</p>
          </div>
          <button className="qp-x" onClick={onClose} aria-label="Close modal">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="qp-body">
          {status === "success" ? (
            <div className="qp-ok">
              <div className="qp-ok-icon">
                <i className="fas fa-check"></i>
              </div>
              <h4>Submission Successful!</h4>
              <p>WhatsApp is launching natively with your custom quote message.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="qp-field">
                <label htmlFor="qp-name">
                  Full Name <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <input
                  ref={nameRef}
                  id="qp-name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="qp-field">
                <label htmlFor="qp-mobile">
                  Mobile Number <span style={{ color: "#c0392b" }}>*</span>
                </label>
                <input
                  id="qp-mobile"
                  type="tel"
                  placeholder="e.g. +91 XXXXX XXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="qp-field">
                <label htmlFor="qp-msg">Message / Requirement</label>
                <textarea
                  id="qp-msg"
                  placeholder="Tell us about the elevator parts or wiring harnesses you need..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <div className="qp-err">
                  <i className="fas fa-exclamation-circle"></i>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="qp-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <div className="qp-spin"></div> Sending...
                  </>
                ) : (
                  <>
                    <i className="fab fa-whatsapp"></i> Send Quote Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
