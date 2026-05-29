import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "APB Enterprise | Lift Control Panel & Harness Manufacturer",
  description:
    "APB Enterprise is a leading manufacturer of elevator controllers and elevator harnesses. Trusted by clients across India, UAE, Nepal, Nigeria, Brazil & more. ISO-certified quality, built to international standards.",
  icons: {
    icon: "/logo.jpg",
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
