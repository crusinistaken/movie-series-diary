import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext"; // <--- 1. İMPORT ETTİK

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie & Series Diary",
  description: "Track what you watch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. TÜM UYGULAMAYI SARMALADIK */}
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}