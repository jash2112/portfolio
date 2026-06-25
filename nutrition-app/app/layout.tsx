import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriAI — Smart Nutrition Tracker",
  description: "AI-powered nutrition tracking with grocery & pantry integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
