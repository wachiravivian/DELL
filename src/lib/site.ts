export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages/" },
  { label: "Services", href: "/services/" },
  { label: "Contact", href: "/contact/" },
  { label: "Support", href: "/support/" },
];

export const site = {
  name: "Maranet Solutions Limited",
  short: "Maranet",
  tagline: "Committed to fast, reliable and secure internet for Narok.",
  slogan: "Connecting Communities. Powering Possibilities.",
  routerPrice: "KES 2,000",
  paybill: "4121737",
  accountExample: "MNSXXXX", // example of a customer account number

  phone: "+254709665866",
  phoneDisplay: "0709 665 866",
  phoneAlt: "+254730988110",
  phoneAltDisplay: "0730 988 110",
  email: "info@maranet.co.ke",
  whatsapp: "254703666999", // WhatsApp and SMS only
  whatsappDisplay: "0703 666 999",

  address: ["Upper-Lenana Junction", "Along Narok–Nakuru Road, Narok, Kenya"],
  office: null as { lat: number; lng: number } | null, // add the office coordinates when you have them
  websiteUrl: "https://www.maranet.co.ke",

  // Use the file name you actually saved in public/images/photos/
  heroPhoto: "/images/photos/woman-laptop-2x.jpg",
  heroPhotoAlt: "A woman smiling with headphones and a laptop",

  nav,
  social: [
    { label: "Instagram", href: "https://www.instagram.com/maranetsolutions?dlrf=MTl0N2l1dTVteXRvNA==" },
  ],
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;