export interface MaterialDetectionResult {
  detected: boolean;
  material?: string;
  category?: "metal" | "plastic" | "paper" | "glass" | "e-waste" | "textile" | "other";
  confidence?: number;
  pricePerKg?: number;
  description?: string;
  recyclingMethod?: string;
  environmentalImpact?: string;
  tips?: string[];
  message?: string;
}

export interface ScrapPrice {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue?: string;
  icon?: string;
}

export const SCRAP_CATEGORIES = [
  { id: "all", label: "All", icon: "♻️" },
  { id: "metal", label: "Metals", icon: "🔩" },
  { id: "plastic", label: "Plastics", icon: "🧴" },
  { id: "paper", label: "Paper", icon: "📄" },
  { id: "e-waste", label: "E-Waste", icon: "💻" },
  { id: "glass", label: "Glass", icon: "🫙" },
  { id: "textile", label: "Textiles", icon: "👕" },
] as const;

export const MOCK_SCRAP_PRICES: ScrapPrice[] = [
  // Metals
  { id: "1", name: "Iron/Steel", category: "metal", pricePerKg: 28, unit: "/kg", trend: "up", trendValue: "+₹2", icon: "🔩" },
  { id: "2", name: "Copper Wire", category: "metal", pricePerKg: 450, unit: "/kg", trend: "up", trendValue: "+₹15", icon: "🔌" },
  { id: "3", name: "Aluminum", category: "metal", pricePerKg: 95, unit: "/kg", trend: "stable", icon: "🥫" },
  { id: "4", name: "Brass", category: "metal", pricePerKg: 350, unit: "/kg", trend: "up", trendValue: "+₹10", icon: "🔔" },
  { id: "5", name: "Stainless Steel", category: "metal", pricePerKg: 45, unit: "/kg", trend: "stable", icon: "🍴" },
  
  // Plastics
  { id: "6", name: "PET Bottles", category: "plastic", pricePerKg: 18, unit: "/kg", trend: "down", trendValue: "-₹1", icon: "🧴" },
  { id: "7", name: "HDPE", category: "plastic", pricePerKg: 25, unit: "/kg", trend: "stable", icon: "🪣" },
  { id: "8", name: "PP Plastic", category: "plastic", pricePerKg: 22, unit: "/kg", trend: "up", trendValue: "+₹2", icon: "📦" },
  { id: "9", name: "PVC", category: "plastic", pricePerKg: 15, unit: "/kg", trend: "down", trendValue: "-₹2", icon: "🔧" },
  
  // Paper
  { id: "10", name: "Newspaper", category: "paper", pricePerKg: 12, unit: "/kg", trend: "stable", icon: "📰" },
  { id: "11", name: "Cardboard", category: "paper", pricePerKg: 10, unit: "/kg", trend: "down", trendValue: "-₹1", icon: "📦" },
  { id: "12", name: "Office Paper", category: "paper", pricePerKg: 14, unit: "/kg", trend: "up", trendValue: "+₹1", icon: "📄" },
  { id: "13", name: "Books/Magazines", category: "paper", pricePerKg: 8, unit: "/kg", trend: "stable", icon: "📚" },
  
  // E-waste
  { id: "14", name: "Circuit Boards", category: "e-waste", pricePerKg: 200, unit: "/kg", trend: "up", trendValue: "+₹25", icon: "🔲" },
  { id: "15", name: "Old Phones", category: "e-waste", pricePerKg: 150, unit: "/piece", trend: "stable", icon: "📱" },
  { id: "16", name: "Laptop/Computer", category: "e-waste", pricePerKg: 80, unit: "/kg", trend: "up", trendValue: "+₹5", icon: "💻" },
  { id: "17", name: "Batteries", category: "e-waste", pricePerKg: 75, unit: "/kg", trend: "stable", icon: "🔋" },
  
  // Glass
  { id: "18", name: "Glass Bottles", category: "glass", pricePerKg: 3, unit: "/kg", trend: "stable", icon: "🍾" },
  { id: "19", name: "Broken Glass", category: "glass", pricePerKg: 2, unit: "/kg", trend: "down", trendValue: "-₹0.5", icon: "🫙" },
  
  // Textiles
  { id: "20", name: "Cotton Clothes", category: "textile", pricePerKg: 20, unit: "/kg", trend: "stable", icon: "👕" },
  { id: "21", name: "Denim/Jeans", category: "textile", pricePerKg: 25, unit: "/kg", trend: "up", trendValue: "+₹3", icon: "👖" },
  { id: "22", name: "Synthetic Fabric", category: "textile", pricePerKg: 15, unit: "/kg", trend: "stable", icon: "🧥" },
];
