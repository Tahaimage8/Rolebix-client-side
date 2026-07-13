import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ToastProvider from "@/components/ToastProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rolebix",
  description: "Rolebix job platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white antialiased">
 <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <ToastProvider />
      </body>
    </html>
  );
}