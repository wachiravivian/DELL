import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-outfit" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dmsans" });

export const metadata: Metadata = {
  title: "Maranet – Fast, reliable fibre internet in Narok",
  description:
"Maranet Solutions Limited: fibre internet plans from 10 to 80 Mbps in Narok with free installation and 24/7 support.",};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="pb-[72px] md:pb-0">
        <SplashScreen />
        <TopBar />
        <Navbar />
        {children}
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}