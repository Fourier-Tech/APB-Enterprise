"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Review {
  id: string | number;
  name: string;
  companyName: string;
  position: string;
  location: string;
  rating: number;
  message: string;
}

function getInitials(nameStr: string) {
  const clean = nameStr.trim();
  if (!clean) return "??";
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="feedback-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={i < rating ? "fas fa-star" : "far fa-star"}
          style={{ color: i < rating ? "var(--gold)" : "var(--gray-light)" }}
        />
      ))}
    </div>
  );
}

function FeedbackCard({ review }: { review: Review }) {
  const role =
    [review.position, review.companyName].filter(Boolean).join(", ") +
    (review.location ? ` — ${review.location}` : "");

  return (
    <div className="feedback-card fc-slide-card">
      <span className="feedback-quote-mark">"</span>
      <StarRating rating={review.rating} />
      <p className="feedback-text">{review.message}</p>
      <div className="feedback-divider" />
      <div className="feedback-author">
        <div className="feedback-avatar">{getInitials(review.name)}</div>
        <div className="feedback-author-info">
          <div className="feedback-author-name">{review.name}</div>
          <div className="feedback-author-role">{role}</div>
        </div>
        <span className="feedback-verified">
          <i className="fas fa-check" /> Verified
        </span>
      </div>
    </div>
  );
}

export default function FeedbackCarousel({ reviews }: { reviews: Review[] }) {
  // Determine cards per view based on width
  const [perView, setPerView] = useState(3);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = reviews.length;
  const maxIndex = Math.max(0, total - perView);

  // Reset current if perView changes
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, total - perView)));
  }, [perView, total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  }, [maxIndex]);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  // Auto-advance
  useEffect(() => {
    if (total <= perView) return;
    autoRef.current = setInterval(next, 5000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [next, total, perView]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 5000);
  };

  const handlePrev = () => {
    prev();
    resetAuto();
  };
  const handleNext = () => {
    next();
    resetAuto();
  };

  if (!reviews.length) return null;

  const cardWidthPct = 100 / perView;
  const gapPx = 24;
  const translateX =
    current * (cardWidthPct + gapPx / (perView > 1 ? perView : 1));

  return (
    <div className="fc-carousel-root">
      {/* Header */}
      <div className="fc-header">
        <div>
          <div className="section-eyebrow">Client Feedback</div>
          <h2 className="section-title">Trusted by elevator professionals</h2>
        </div>
        {total > perView && (
          <div className="fc-nav-btns">
            <button
              className="fc-nav-btn"
              onClick={handlePrev}
              aria-label="Previous reviews"
            >
              <i className="fas fa-arrow-left" />
            </button>
            <button
              className="fc-nav-btn"
              onClick={handleNext}
              aria-label="Next reviews"
            >
              <i className="fas fa-arrow-right" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Track */}
      <div className="fc-viewport">
        <div
          ref={trackRef}
          className="fc-track"
          style={{
            transform: `translateX(calc(-${current * cardWidthPct}% - ${current * gapPx}px))`,
            gridTemplateColumns: `repeat(${total}, calc(${cardWidthPct}% - ${(gapPx * (perView - 1)) / perView}px))`,
          }}
        >
          {reviews.map((review) => (
            <FeedbackCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Rating Summary */}
      {total >= 3 && (
        <div className="fc-rating-bar-section">
          <div className="fc-avg-block">
            <div className="fc-avg-num">
              {(reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)}
            </div>
            <div className="fc-avg-label">/ 5</div>
            <div>
              <StarRating
                rating={Math.round(
                  reviews.reduce((s, r) => s + r.rating, 0) / total,
                )}
              />
              <div className="fc-avg-count">
                Based on {total} verified reviews
              </div>
            </div>
          </div>

          <div className="fc-bars">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={star} className="fc-bar-row">
                  <span className="fc-bar-label">{star}</span>
                  <div className="fc-bar-track">
                    <div className="fc-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="fc-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
