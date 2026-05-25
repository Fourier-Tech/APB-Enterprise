import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";
import PageReadySignal from "@/components/PageReadySignal";
import Loader from "@/components/Loader";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export const revalidate = 0; // Dynamic server component to load latest contact credentials

export default function FeedbackPage() {
  return (
    <>
      <Loader />
      {/* Header hidden as requested for standalone view */}
      {/* <Header /> */}
      <Suspense fallback={null}>
        <FeedbackPageContent />
      </Suspense>
    </>
  );
}

async function FeedbackPageContent() {
  // Retrieve business contact information to render fully-functional footer links
  const contact = await prisma.contact.findFirst();

  return (
    <>
      <main className="feedback-page-wrapper">
        {/* Background glow effects for premium styling */}
        <div className="feedback-hero-glow"></div>

        <div className="container">
          <FeedbackForm />
        </div>
      </main>
      {/* Footer hidden as requested for standalone view */}
      {/* <Footer contact={contact} /> */}
      <PageReadySignal />
    </>
  );
}
