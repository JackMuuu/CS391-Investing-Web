/*******************************************************************************
* app/layout.tsx
*
* Description:
*     The web project's global layout file.
*
* Author:
*     Yuanman Mu, Justin Wang, Shuwei Zhu
*     ymmu@bu.edu, justin1@bu.edu, david996@bu.edu
*
* Affiliation:
*     Boston University
*
* Creation Date:
*     December 7, 2024
*
*******************************************************************************/

import React from "react";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Investing Hub",
  description: "BU Fall 2024 CAS CS 391 Web Development Final Project.",
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