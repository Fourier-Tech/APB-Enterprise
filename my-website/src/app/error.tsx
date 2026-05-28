"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  return (
    <>
      <Header />
      <div id="page-wrapper" className="page-shell">
        <main
          style={{
            paddingTop: "72px",
            minHeight: "calc(100vh - 72px - 300px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <section className="container" style={{ textAlign: "center", padding: "5rem 1.25rem" }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "5rem",
                fontWeight: 700,
                color: "var(--teal)",
                lineHeight: 1,
                marginBottom: "1rem",
              }}
            >
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h1 className="section-title" style={{ marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <p
              style={{
                color: "var(--gray-mid)",
                maxWidth: "500px",
                margin: "0 auto 2.5rem",
                fontSize: "1.05rem",
              }}
            >
              An unexpected error has occurred. We've been notified and are working to fix the issue. Please try again.
            </p>

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
            >
              <button onClick={() => reset()} className="btn-primary">
                <i className="fas fa-sync-alt"></i> Try Again
              </button>
              <Link href="/" className="btn-ghost">
                <i className="fas fa-home"></i> Go Back Home
              </Link>
            </div>
          </section>
        </main>
        {/* Pass null for contact since we can't do an async DB fetch in a client component easily without fetching from an API */}
        <Footer contact={null} />
      </div>
    </>
  );
}
