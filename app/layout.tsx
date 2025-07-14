import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/toaster";
import Script from "next/script";

export const metadata = {
  title: "Blog",
  description: "A modern blogging platform for writers and readers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
