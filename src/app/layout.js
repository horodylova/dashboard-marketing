import "@progress/kendo-theme-default/dist/all.css"
import "@progress/kendo-theme-utils/dist/all.css"
import "./globals.css";

export const metadata = {
  title: "Social Media Marketing Dashboard",
  description: "Comprehensive social media marketing dashboard with campaign performance analytics, real-time tracking, and interactive data visualizations built with Next.js and Kendo UI.",
  keywords: "social media, marketing, dashboard, analytics, campaign tracking, Next.js, React",
  authors: [{ name: "Svitlana Horodylova" }],
  openGraph: {
    title: "Social Media Marketing Dashboard",
    description: "Comprehensive social media marketing dashboard with campaign performance analytics, real-time tracking, and interactive data visualizations.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Social Media Marketing Dashboard"
      }
    ],
    locale: "en_UK",
    type: "website",
    siteName: "Marketing Dashboard"
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media Marketing Dashboard",
    description: "Comprehensive social media marketing dashboard with campaign performance analytics and real-time tracking.",
    images: ["/logo.svg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0078d4" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}