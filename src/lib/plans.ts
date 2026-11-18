export type Plan = {
  slug: string;
  tier?: string; // optional label shown on the card
  speed: number; // Mbps
  price: number; // KSH
  period?: string; // shown after the price; defaults to "/month"
  features: string[];
  icon: string; // image path, or "builtin:graduation"
};

const common = ["Fibre connection", "Free installation", "24/7 support"];
export const plans: Plan[] = [
  {
    slug: "komrades-10",
    tier: "Komrades",
    speed: 10,
    price: 4500,
    period: "per semester",
    features: ["Students pay KSH 4,500 and enjoy 3 months", "Free installation", "24/7 support"],
    icon: "builtin:graduation",
  },
  { slug: "plan-30", speed: 30, price: 1999, features: common, icon: "/images/animals/mammal.png" },
  { slug: "plan-50", speed: 50, price: 2299, features: common, icon: "/images/animals/lion.png" },
  { slug: "plan-80", speed: 80, price: 2999, features: common, icon: "/images/animals/cheetah.png" },
];

export const planLabel = (p: Plan) => (p.tier ? `${p.tier} ${p.speed} Mbps` : `${p.speed} Mbps`);

export const formatKSH = (n: number) => `KSH ${n.toLocaleString("en-US")}`;

export const priceLabel = (p: Plan) =>
  p.period ? `${formatKSH(p.price)} ${p.period}` : `${formatKSH(p.price)}/month`;