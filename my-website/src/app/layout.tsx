import type { Metadata } from "next";
import "../styles/globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://apb-enterprise.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "APB Enterprise | Lift Control Panel & Harness Manufacturer",
    template: "%s | APB Enterprise",
  },
  description:
    "APB Enterprise is an ISO-certified manufacturer of elevator controllers and harnesses. Trusted across India, UAE, Nigeria, Brazil, and globally.",
  keywords: [
    "elevator controller",
    "elevator harness",
    "lift control panel manufacturer",
    "elevator wiring harness",
    "elevator control panel",
    "APB Enterprise",
    "APB"
  ],
  icons: {
    icon: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "APB Enterprise",
    title: "APB Enterprise | Lift Control Panel & Harness Manufacturer",
    description:
      "Leading manufacturer of ISO-certified elevator controllers and harnesses, serving India, UAE, Nigeria, and globally.",
    images: [
      {
        url: "/logo.jpg",
        width: 400,
        height: 400,
        alt: "APB Enterprise Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "APB Enterprise | Lift Control Panel & Harness Manufacturer",
    description:
      "Leading manufacturer of ISO-certified elevator controllers and harnesses, serving India, UAE, Nigeria, and globally.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Epilogue:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        {/* jsVectorMap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
