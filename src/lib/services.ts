import {
  Building2,
  Cable,
  Globe,
  Home,
  Network,
  PhoneCall,
  Server,
  Store,
  Sun,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "Internet Connectivity",
    title: "Internet Connectivity",
    description: "Fast, reliable fibre internet for your home, with 24/7 support.",
    icon: Home,
  },
  {
    slug: "Networking & Wi-Fi Solutions",
    title: "Networking & Wi-Fi Solutions",
    description: "Network design, cabling, routers, switches and Wi-Fi coverage for homes and businesses.",
    icon: Network,
  },
  {
    slug: "Intercom & Telephone Systems",
    title: "Intercom & Telephone Systems",
    description: "Modern intercom and telephone systems for homes and businesses.",
    icon: PhoneCall,
  },
  {
    slug: "wifi-hotspots-events",
    title: "Wi-Fi Hotspots & Event Connectivity",
    description: "Wi-Fi for events, venues and public spaces, so everyone stays connected.",
    icon: Wifi,
  },
  {
    slug: "CCTV & Surveillance Systems",
    title: "CCTV & Surveillance Systems",
    description: "Complete security solutions with cameras, recording, and monitoring for your property.",
    icon: Server,
  },
];