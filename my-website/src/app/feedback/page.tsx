import { Metadata } from "next";
import FeedbackForm from "@/components/FeedbackForm";
import PageReadySignal from "@/components/PageReadySignal";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Submit Client Feedback & Product Reviews",
  description:
    "Submit reviews and ratings for APB Enterprise to help us continuously improve our elevator controllers and wiring harnesses.",
  openGraph: {
    title: "Submit Client Feedback | APB Enterprise",
    description:
      "Submit reviews and ratings for APB Enterprise to help us continuously improve our elevator controllers and wiring harnesses.",
  },
  alternates: {
    canonical: "/feedback",
  },
};

export const revalidate = 0; // Dynamic server component to load latest contact credentials

export default function FeedbackPage() {
  return (
    <>
      <Loader />
      <Suspense fallback={null}>
        <FeedbackPageContent />
      </Suspense>
    </>
  );
}

async function FeedbackPageContent() {
  return (
    <>
      <main className="feedback-page-wrapper">
        {/* Background glow effects for premium styling */}
        <div className="feedback-hero-glow"></div>

        <div className="container">
          <FeedbackForm />
        </div>
      </main>
      <PageReadySignal />
    </>
  );
}
