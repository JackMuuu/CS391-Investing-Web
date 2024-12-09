import React from "react";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Investing Website",
  description: "",
};

export default function RootLayout(
  { children, }:
    Readonly<{ children: React.ReactNode; }>
) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}