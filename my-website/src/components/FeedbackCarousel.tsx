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
          style={{
            color: i < rating ? "var(--gold)" : "var(--gray-light)",
            marginRight: "2px",
          }}
        />
      ))}
    </div>
  );
}

// Sleek Compact Marquee Card Component (Single-line quote snippets)
function MarqueeCard({ review }: { review: Review }) {
  const roleText =
    [review.position.trim(), review.companyName.trim()]
      .filter(Boolean)
      .join(", ") +
    (review.location.trim() ? ` — ${review.location.trim()}` : "");

  return (
    <div className="fc-marquee-card">
      <div className="fc-marquee-card-header">
        <StarRating rating={review.rating} />
        <span className="feedback-verified">
          <i className="fas fa-check" /> Verified
        </span>
      </div>
      <p className="fc-marquee-text">"{review.message}"</p>
      <div className="feedback-divider" style={{ margin: "0.5rem 0" }} />
      <div className="feedback-author">
        <div
          className="feedback-avatar"
          style={{ width: "30px", height: "30px", fontSize: "0.72rem" }}
        >
          {getInitials(review.name)}
        </div>
        <div className="feedback-author-info">
          <div className="feedback-author-name" style={{ fontSize: "0.8rem" }}>
            {review.name}
          </div>
          <div className="feedback-author-role" style={{ fontSize: "0.68rem" }}>
            {roleText}
          </div>
        </div>
      </div>
    </div>
  );
}

// Full detailed Curated Showcase Card Component (Pristine, solid white background)
function FeedbackCard({ review }: { review: Review }) {
  const roleText =
    [review.position.trim(), review.companyName.trim()]
      .filter(Boolean)
      .join(", ") +
    (review.location.trim() ? ` — ${review.location.trim()}` : "");

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
          <div className="feedback-author-role">{roleText}</div>
        </div>
        <span className="feedback-verified">
          <i className="fas fa-check" /> Verified
        </span>
      </div>
    </div>
  );
}

export default function FeedbackCarousel({ reviews }: { reviews: Review[] }) {
  const [perView, setPerView] = useState(2);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 1024)
        setPerView(1); // 1 card on tablet/mobile
      else setPerView(2); // 2 wide cards on desktop for elegant ratio
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = reviews.length;

  // Buffer size for circular infinite transitions
  const BUFFER_SIZE = 2;
  const [current, setCurrent] = useState(BUFFER_SIZE);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(() => {
    if (disableTransition) return;
    setCurrent((c) => c - 1);
  }, [disableTransition]);

  const next = useCallback(() => {
    if (disableTransition) return;
    setCurrent((c) => c + 1);
  }, [disableTransition]);

  // Teleports index silently at the track boundaries on transition completion
  const handleTransitionEnd = () => {
    if (current >= total + BUFFER_SIZE) {
      setDisableTransition(true);
      setCurrent(current - total);
    } else if (current < BUFFER_SIZE) {
      setDisableTransition(true);
      setCurrent(current + total);
    }
  };

  // Triggers DOM reflow to safely clear disableTransition instantly
  useEffect(() => {
    if (disableTransition) {
      if (trackRef.current) {
        trackRef.current.offsetHeight; // triggers reflow
      }
      setDisableTransition(false);
    }
  }, [disableTransition]);

  // Autoscroll loop, halts when mouse is hovered inside the testimonials viewport
  useEffect(() => {
    if (isHovered || total <= perView) return;
    autoRef.current = setInterval(next, 3000); // Shift review every 3 seconds
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [next, total, perView, isHovered]);

  // Mobile/Tablet Touch Swipe gesture listeners
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!reviews.length) return null;

  // Build infinite marquee tracks by replicating items dynamically
  const multiplyCount = Math.max(3, Math.ceil(12 / total));
  const marqueeRow1 = Array(multiplyCount).fill(reviews).flat();
  const marqueeRow2 = Array(multiplyCount)
    .fill([...reviews].reverse())
    .flat();

  // Clone items on left and right for seamless circular slide teleportations
  const clonedReviews = [
    ...reviews.slice(-BUFFER_SIZE),
    ...reviews,
    ...reviews.slice(0, BUFFER_SIZE),
  ];

  const cardWidthPct = 100 / perView;
  const gapPx = 24;

  const averageRating = (
    reviews.reduce((s, r) => s + r.rating, 0) / total
  ).toFixed(1);

  return (
    <div className="fc-carousel-root">
      {/* ── TOP SECTION: DYNAMIC TRUST SUMMARY BANNER (With Background Marquee) ── */}
      <div className="fc-summary-banner">
        {/* Background Scrolling Reviews (Confined strictly inside the summary banner) */}
        <div className="fc-marquees-container">
          <div className="fc-marquee-row row-ltr">
            {marqueeRow1.map((review, idx) => (
              <MarqueeCard key={`m1-${review.id}-${idx}`} review={review} />
            ))}
          </div>
          <div className="fc-marquee-row row-rtl">
            {marqueeRow2.map((review, idx) => (
              <MarqueeCard key={`m2-${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>

        {/* Foreground Content Card: Glassmorphic Trust Summary */}
        <div className="fc-summary-card">
          {/* Left Column: Big Average Score */}
          <div className="fc-avg-block-new">
            <div className="fc-avg-eyebrow">Overall Rating</div>
            <div className="fc-avg-display">
              <span className="fc-avg-big-num">{averageRating}</span>
              <span className="fc-avg-max-val">/ 5</span>
            </div>
            <StarRating rating={Math.round(parseFloat(averageRating))} />
            <div className="fc-avg-count-text">
              Based on <strong>{total}</strong> verified reviews
            </div>
            <div className="fc-trust-badge">
              <i className="fas fa-shield-alt"></i> Verified Database
            </div>
          </div>

          {/* Right Column: Dynamic Star Level Bars */}
          <div className="fc-bars-new">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = total ? (count / total) * 100 : 0;
              return (
                <div key={star} className="fc-bar-row-new">
                  <span className="fc-bar-label-new">
                    {star}{" "}
                    <i
                      className="fas fa-star"
                      style={{ color: "var(--gold)", fontSize: "0.72rem" }}
                    ></i>
                  </span>
                  <div className="fc-bar-track-new">
                    <div
                      className="fc-bar-fill-new"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="fc-bar-count-new">
                    {pct.toFixed(0)}% ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: CURATED TESTIMONIALS (Solid background with no noise) ── */}
      <div className="fc-showcase-section">
        {/* Header */}
        <div className="fc-header">
          <div>
            <div className="section-eyebrow">Client Feedback</div>
            <h2 className="section-title">Trusted by elevator professionals</h2>
          </div>
        </div>

        {/* Carousel Viewport flushes bounds, pauses on hover, swipes on touch */}
        <div
          className="fc-viewport"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={trackRef}
            className="fc-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(calc(-${current} * (${cardWidthPct}% + ${gapPx / perView}px)))`,
              gridTemplateColumns: `repeat(${clonedReviews.length}, calc(${cardWidthPct}% - ${(gapPx * (perView - 1)) / perView}px))`,
              transition: disableTransition ? "none" : undefined,
            }}
          >
            {clonedReviews.map((review, idx) => (
              <FeedbackCard key={`c-${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
