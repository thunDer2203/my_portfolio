import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PortfolioProvider from "../components/PortfolioProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio Provider",
  description: "A portfolio to provide all with a portfolio site",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <PortfolioProvider>
        {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
