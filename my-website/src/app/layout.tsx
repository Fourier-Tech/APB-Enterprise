import type { Metadata } from "next";
import { Space_Grotesk, Epilogue } from "next/font/google";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-epilogue",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://apb-enterprise.vercel.app";

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
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${epilogue.variable}`}>
      <head>
        {/* Font Awesome */}
        <link
          rel="preload"
          as="style"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          media="print"
          data-async-css="true"
        />
        {/* jsVectorMap CSS */}
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css"
          rel="stylesheet"
          media="print"
          data-async-css="true"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                var links = document.querySelectorAll('link[data-async-css]');
                for (var i = 0; i < links.length; i++) {
                  links[i].media = 'all';
                }
              });
            `
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "APB Enterprise",
              "url": SITE_URL,
              "logo": `${SITE_URL}/logo.jpg`,
              "description": "APB Enterprise is an ISO-certified manufacturer of elevator controllers and harnesses. Trusted across India, UAE, Nigeria, Brazil, and globally.",
              "sameAs": []
            })
          }}
        />
        <div id="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
