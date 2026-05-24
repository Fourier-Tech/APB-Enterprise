"use client";

import { useState, useEffect, useRef } from "react";

interface QuotePopupProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function QuotePopup({ open, onClose }: QuotePopupProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Auto-focus name field when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 80);
    } else {
      setName("");
      setMobile("");
      setMessage("");
      setStatus("idle");
      setErrorMsg("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll WITHOUT shifting layout
  // Measure the scrollbar width and pad the body by that amount so
  // the page doesn't jump when the scrollbar disappears.
  useEffect(() => {
    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber: mobile, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      if (data.whatsappUrl)
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      setTimeout(onClose, 2200);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <>
      <style>{`
        .qp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.48);backdrop-filter:blur(4px);z-index:1200;display:flex;align-items:center;justify-content:center;padding:1rem;animation:qpFade .18s ease}
        @keyframes qpFade{from{opacity:0}to{opacity:1}}
        .qp-modal{background:#fff;border-radius:16px;width:100%;max-width:430px;box-shadow:0 28px 70px rgba(0,0,0,.16);overflow:hidden;animation:qpUp .22s cubic-bezier(.34,1.56,.64,1)}
        @keyframes qpUp{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:none}}
        .qp-head{background:var(--teal,#0f6978);padding:1.35rem 1.5rem 1.15rem;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
        .qp-head-copy h3{color:#fff;font-size:1.05rem;font-weight:700;margin:0 0 .2rem;line-height:1.3}
        .qp-head-copy p{color:rgba(255,255,255,.7);font-size:.78rem;margin:0;line-height:1.4}
        .qp-x{background:rgba(255,255,255,.15);border:none;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-size:.95rem;flex-shrink:0;transition:background .15s;margin-top:2px}
        .qp-x:hover{background:rgba(255,255,255,.28)}
        .qp-body{padding:1.5rem}
        .qp-field{margin-bottom:.95rem}
        .qp-field label{display:block;font-size:.72rem;font-weight:600;color:var(--gray-dark,#444);margin-bottom:.38rem;letter-spacing:.02em}
        .qp-field input,.qp-field textarea{width:100%;border:1.5px solid var(--gray-light,#ddd);border-radius:8px;padding:.58rem .82rem;font-size:.88rem;font-family:inherit;color:var(--gray-dark,#333);background:var(--off-white,#fafafa);transition:border-color .15s,box-shadow .15s;outline:none;box-sizing:border-box}
        .qp-field input:focus,.qp-field textarea:focus{border-color:var(--teal,#0f6978);box-shadow:0 0 0 3px rgba(15,105,120,.1);background:#fff}
        .qp-field textarea{height:84px;resize:none}
        .qp-err{font-size:.76rem;color:#c0392b;margin-bottom:.8rem;display:flex;align-items:center;gap:6px}
        .qp-submit{width:100%;background:var(--teal,#0f6978);color:#fff;border:none;border-radius:8px;padding:.68rem 1rem;font-size:.88rem;font-weight:600;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s,opacity .15s}
        .qp-submit:hover:not(:disabled){background:#0a5060}
        .qp-submit:disabled{opacity:.62;cursor:not-allowed}
        .qp-spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .qp-ok{text-align:center;padding:.75rem 0 .25rem}
        .qp-ok-icon{width:50px;height:50px;background:rgba(15,105,120,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto .8rem;font-size:1.35rem;color:var(--teal,#0f6978)}
        .qp-ok h4{font-size:.98rem;font-weight:700;color:var(--gray-dark,#333);margin:0 0 .3rem}
        .qp-ok p{font-size:.8rem;color:var(--gray-mid,#777);margin:0}
        @media (max-width: 480px) {
          .qp-overlay {
      align-items: flex-end;
      padding: 0;
    }

    .qp-modal {
      max-width: 100%;
      width: 100%;
      border-radius: 20px 20px 0 0;
      max-height: 92dvh;
      overflow-y: auto;
    }

    .qp-head {
      padding: 1rem 1.1rem 0.9rem;
      align-items: center;
    }

    .qp-head-copy h3 {
      font-size: 0.95rem;
      white-space: nowrap;
    }

    .qp-head-copy p {
      font-size: 0.73rem;
      white-space: nowrap;
    }

    .qp-body {
      padding: 1.1rem;
    }

    .qp-field {
      margin-bottom: 0.75rem;
    }

    .qp-field input,
    .qp-field textarea {
      font-size: 1rem; /* prevents iOS zoom on focus */
      padding: 0.6rem 0.75rem;
    }

    .qp-field textarea {
      height: 72px;
    }

    .qp-submit {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
    }
  }
      `}</style>

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
          <div className="qp-head">
            <div className="qp-head-copy">
              <h3 id="qp-title">
                <i className="fab fa-whatsapp" style={{ marginRight: 8 }}></i>
                Get a Quick Quote
              </h3>
              <p>
                Fill the form — we'll open WhatsApp with your message ready.
              </p>
            </div>
            <button className="qp-x" onClick={onClose} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="qp-body">
            {status === "success" ? (
              <div className="qp-ok">
                <div className="qp-ok-icon">
                  <i className="fas fa-check"></i>
                </div>
                <h4>Message Sent!</h4>
                <p>
                  WhatsApp is opening with your message. We'll get back to you
                  shortly.
                </p>
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
                    placeholder="Your name"
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
                    placeholder="+91 XXXXX XXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div className="qp-field">
                  <label htmlFor="qp-msg">Message</label>
                  <textarea
                    id="qp-msg"
                    placeholder="Tell us about your requirement…"
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
                      <div className="qp-spin"></div>Sending…
                    </>
                  ) : (
                    <>
                      <i className="fab fa-whatsapp"></i>Send on WhatsApp
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
