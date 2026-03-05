import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Movie Insight Builder | Discover Movie Insights with AI",
  description:
    "Enter any IMDb movie ID to get detailed movie information, cast details, and AI-powered audience sentiment analysis. Beautiful, fast, and insightful.",
  keywords: ["movie", "IMDb", "AI", "sentiment analysis", "movie insights", "reviews"],
  openGraph: {
    title: "AI Movie Insight Builder",
    description: "Discover movie details and AI-powered audience sentiment analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
