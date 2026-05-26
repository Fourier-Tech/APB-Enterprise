"use client";

import React, { useState } from "react";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Dynamic initials helper
  const getInitials = (nameStr: string) => {
    const clean = nameStr.trim();
    if (!clean) return "??";
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    return (first + last).toUpperCase();
  };

  const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, var(--teal) 0%, var(--near-black) 100%)", // Brand Teal-to-Black
    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", // Ocean Blue
    "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)", // Royal Amethyst
    "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)", // Amber Copper
    "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", // Forest Emerald
    "linear-gradient(135deg, #374151 0%, #9ca3af 100%)", // Slate Steel
  ];

  const getAvatarBackground = (nameStr: string) => {
    const cleanName = nameStr.trim();
    if (!cleanName) {
      return AVATAR_GRADIENTS[0]; // Default brand gradient
    }
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return AVATAR_GRADIENTS[index];
  };

  // Get description for star ratings
  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "Excellent - 5 stars";
      case 4:
        return "Great - 4 stars";
      case 3:
        return "Good - 3 stars";
      case 2:
        return "Fair - 2 stars";
      case 1:
        return "Poor - 1 star";
      default:
        return "";
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!name.trim()) return setError("Please enter your name.");
    if (!companyName.trim()) return setError("Please enter your company name.");
    if (!position.trim()) return setError("Please enter your job title/position.");
    if (!location.trim()) return setError("Please enter your service location city (e.g. Pune or Singapore).");
    if (!message.trim()) return setError("Please write your review message.");

    setLoading(true);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          position,
          location,
          rating,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-success-card reveal-fade-in">
        <div className="feedback-success-icon-wrap">
          <div className="feedback-success-pulse"></div>
          <i className="fas fa-check-circle feedback-check-icon"></i>
        </div>
        <h2>Thank You!</h2>
        <p className="feedback-success-subtitle">
          Your verified feedback has been submitted successfully.
        </p>
        <div className="feedback-success-divider"></div>
        <p className="feedback-success-note">
          We appreciate your partnership. Your insights help us continuously engineer reliable elevator components.
        </p>
      </div>
    );
  }

  const initials = getInitials(name);
  const formattedRole = [
    position.trim() || "Position",
    companyName.trim() || "Company",
  ].filter(Boolean).join(", ") + (location.trim() ? ` — ${location.trim()}` : "");

  return (
    <>
      <div className="feedback-header-section">
        <div className="feedback-eyebrow">
          <span className="feedback-eyebrow-line"></span>
          <span className="feedback-eyebrow-text">Client Portal</span>
        </div>
        <h1 className="feedback-title">Share Your Experience</h1>
        <p className="feedback-description">
          At APB Enterprise, we pride ourselves on engineering elite-level elevator components. 
          We invite our valued partners to share their verified review. Your insights help us 
          maintain world-class standards of reliability, performance, and craftsmanship.
        </p>
      </div>

      <div className="feedback-grid">
        {/* LEFT: Submission Form */}
        <div className="feedback-form-column">
          <form onSubmit={handleSubmit} className="feedback-form-card">
            <div className="feedback-form-header">
              <h3>Verified Feedback Form</h3>
              <p>Please share your professional experience working with APB Enterprise.</p>
            </div>

            {error && (
              <div className="feedback-form-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            {/* RATING SELECTOR */}
            <div className="feedback-form-group">
              <label className="feedback-field-label">Your Rating out of 5 Stars *</label>
              <div className="feedback-stars-container">
                <div className="feedback-stars-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`feedback-star-btn ${star <= activeRating ? "active" : ""}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
                <span className="feedback-rating-label">
                  {getRatingLabel(activeRating)}
                </span>
              </div>
            </div>

            <div className="feedback-form-row">
              {/* FULL NAME */}
              <div className="feedback-form-group">
                <label htmlFor="client-name" className="feedback-field-label">
                  Full Name *
                </label>
                <input
                  id="client-name"
                  type="text"
                  className="feedback-input"
                  placeholder="e.g. James Ng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>

              {/* SERVICE LOCATION */}
              <div className="feedback-form-group">
                <label htmlFor="client-location" className="feedback-field-label">
                  Service Location *
                </label>
                <input
                  id="client-location"
                  type="text"
                  className="feedback-input"
                  placeholder="e.g. Singapore or Pune, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
            </div>

            <div className="feedback-form-row">
              {/* COMPANY NAME */}
              <div className="feedback-form-group">
                <label htmlFor="client-company" className="feedback-field-label">
                  Company Name *
                </label>
                <input
                  id="client-company"
                  type="text"
                  className="feedback-input"
                  placeholder="e.g. ElevatePro"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>

              {/* POSITION */}
              <div className="feedback-form-group">
                <label htmlFor="client-position" className="feedback-field-label">
                  Position / Job Title *
                </label>
                <input
                  id="client-position"
                  type="text"
                  className="feedback-input"
                  placeholder="e.g. Technical Director"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  maxLength={80}
                  required
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="feedback-form-group">
              <label htmlFor="client-message" className="feedback-field-label">
                Review Message *
              </label>
              <textarea
                id="client-message"
                className="feedback-textarea"
                placeholder="Tell us about the quality, specifications, reliability of products, or service experience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={2000}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary feedback-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting Feedback...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Verified Review
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="feedback-preview-column">
          <div className="feedback-sticky-wrapper">
            <div className="feedback-preview-header">
              <h4>Live Preview</h4>
              <p>This is exactly how your review will appear on the homepage.</p>
            </div>

            {/* Replica of the home page feedback-card structure */}
            <div className="feedback-card feedback-preview-card-element">
              <span className="feedback-quote-mark">"</span>
              <div className="feedback-stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <i
                    key={idx}
                    className={`${idx < rating ? "fas" : "far"} fa-star`}
                    style={{ color: idx < rating ? "var(--gold)" : "var(--gray-light)", marginRight: "2px" }}
                  ></i>
                ))}
              </div>
              <p className="feedback-text">
                {message.trim() ||
                  "Your review message will render here in real-time. Share comments about pricing, customization, timing, or engineering details."}
              </p>
              <div className="feedback-divider"></div>
              <div className="feedback-author">
                <div className="feedback-avatar" style={{ background: getAvatarBackground(name) }}>{initials}</div>
                <div className="feedback-author-info">
                  <div className="feedback-author-name">{name.trim() || "Client Name"}</div>
                  <div className="feedback-author-role">{formattedRole}</div>
                </div>
                <span className="feedback-verified">
                  <i className="fas fa-check"></i> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
