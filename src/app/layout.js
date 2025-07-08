import "./globals.css";

export const metadata = {
  title: " ",
  description: " ",
  openGraph: {
    title: " ",
    description: " ",
    images: [
      {
        url: "/ ",
        width: 1200,
        height: 630,
        alt: " "
      }
    ],
    locale: "en_UK",
    type: "website",
    siteName: "Marketing Dashboard"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}