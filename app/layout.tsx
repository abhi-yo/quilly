import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/toaster";
import Script from "next/script";

export const metadata = {
  title: "Quilly",
  description: "A modern blogging platform for writers and readers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/favicon.png" />
        <meta property="og:title" content="Quilly" />
        <meta property="og:description" content="A modern blogging platform for writers and readers" />
        <meta property="og:image" content="/images/og.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quilly" />
        <meta name="twitter:description" content="A modern blogging platform for writers and readers" />
        <meta name="twitter:image" content="/images/og.png" />
      </head>
      <body
        className={`${GeistSans.className} antialiased bg-black text-white`}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
