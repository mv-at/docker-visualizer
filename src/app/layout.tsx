import type { Metadata } from "next";
import "../styles/globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Docker visualizer",
  description: "Visualize running docker containers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='w-full h-screen'>
        {children}
      </body>
    </html>
  );
}
