/* Mock listings for Apply page - real housing visuals */
/* landlord: Sui address for on-chain contract (demo - use your second wallet) */
/** Default landlord for demo - set VITE_DEMO_LANDLORD in .env to override */
export const DEMO_LANDLORD = import.meta.env.VITE_DEMO_LANDLORD || "0x0000000000000000000000000000000000000000000000000000000000000001";

export const MOCK_LISTINGS = [
  {
    id: "1",
    landlord: DEMO_LANDLORD,
    title: "2BHK • Chennai • ₹18,000/month",
    fullTitle: "Spacious 2BHK Apartment on Oak Street",
    rent: "₹18,000/mo",
    location: "Oak Street, Chennai",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    trustScore: 70,
    trustLabel: "Responds to 70% of applicants",
  },
  {
    id: "2",
    landlord: DEMO_LANDLORD,
    title: "Cozy Studio Downtown",
    fullTitle: "Cozy Studio in Central Business District",
    rent: "₹12,500/mo",
    location: "Downtown, Chennai",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    trustScore: 85,
    trustLabel: "Responds to 85% of applicants",
  },
  {
    id: "3",
    landlord: DEMO_LANDLORD,
    title: "3BR House — West Side",
    fullTitle: "Family 3BR House with Garden",
    rent: "₹28,000/mo",
    location: "West Side, Chennai",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    trustScore: 62,
    trustLabel: "Responds to 62% of applicants",
  },
];
