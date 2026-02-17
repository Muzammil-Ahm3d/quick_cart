import { Product, Category, Store } from "@/types";
import {
  getProducts,
  getCategories,
  getStores,
  initializeStore,
} from "@/lib/store";

// ─── Seed Data (used only on first load) ────────────────────

const seedCategories: Category[] = [
  { id: "1", name: "Groceries", icon: "🛒", image: "/images/groceries.png", product_count: 1250 },
  { id: "2", name: "Fruits & Vegetables", icon: "🥬", image: "/images/fruits-vegetables.png", product_count: 450 },
  { id: "3", name: "Dairy & Eggs", icon: "🥛", image: "/images/dairy-eggs.png", product_count: 180 },
  { id: "4", name: "Bakery", icon: "🍞", image: "/images/bakery.png", product_count: 95 },
  { id: "5", name: "Snacks", icon: "🍿", image: "/images/snacks.png", product_count: 320 },
  { id: "6", name: "Beverages", icon: "🥤", image: "/images/beverages.png", product_count: 275 },
  { id: "7", name: "Personal Care", icon: "🧴", image: "/images/personal-care.png", product_count: 410 },
  { id: "8", name: "Household", icon: "🏠", image: "/images/household.png", product_count: 380 },
];

const seedStores: Store[] = [
  {
    id: "store1", vendorId: "QK-10001", password: "vendor123",
    name: "Fresh Mart Kirana", logo: null, distance_km: 0.8,
    rating: 4.5, review_count: 234, opening_hours: { monday: "08:00-22:00", tuesday: "08:00-22:00" },
    is_open: true, category: "Kirana Store", description: "Your neighborhood grocery store",
  },
  {
    id: "store2", vendorId: "QK-10002", password: "vendor123",
    name: "Green Valley Organics", logo: null, distance_km: 1.2,
    rating: 4.8, review_count: 156, opening_hours: { monday: "09:00-21:00", tuesday: "09:00-21:00" },
    is_open: true, category: "Organic Store",
  },
  {
    id: "store3", vendorId: "QK-10003", password: "vendor123",
    name: "Daily Needs Express", logo: null, distance_km: 0.5,
    rating: 4.2, review_count: 89, opening_hours: { monday: "07:00-23:00", tuesday: "07:00-23:00" },
    is_open: true, category: "Convenience Store",
  },
];

const seedProducts: Product[] = [
  {
    id: "1", name: "Fresh Organic Bananas",
    description: "Sweet and ripe organic bananas, perfect for breakfast or a healthy snack",
    category_id: "2", category_name: "Fruits & Vegetables", store_id: "store2",
    store_name: "Green Valley Organics", store_distance_km: 1.2, price: 49,
    original_price: 65, discount_percentage: 25, images: ["/images/bananas.png"],
    rating: 4.6, review_count: 128, quantity_available: 50, status: "active",
    delivery_time_minutes: 20, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "2", name: "Amul Butter 500g",
    description: "Premium quality butter for your daily cooking needs",
    category_id: "3", category_name: "Dairy & Eggs", store_id: "store1",
    store_name: "Fresh Mart Kirana", store_distance_km: 0.8, price: 275,
    original_price: null, discount_percentage: null, images: ["/images/butter.png"],
    rating: 4.8, review_count: 342, quantity_available: 25, status: "active",
    delivery_time_minutes: 15, is_wishlist: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "3", name: "Tata Salt 1kg",
    description: "India's most trusted salt brand",
    category_id: "1", category_name: "Groceries", store_id: "store3",
    store_name: "Daily Needs Express", store_distance_km: 0.5, price: 28,
    original_price: 32, discount_percentage: 12, images: ["/images/salt.png"],
    rating: 4.9, review_count: 567, quantity_available: 100, status: "active",
    delivery_time_minutes: 10, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "4", name: "Britannia Good Day Cookies",
    description: "Delicious butter cookies that make your day better",
    category_id: "5", category_name: "Snacks", store_id: "store1",
    store_name: "Fresh Mart Kirana", store_distance_km: 0.8, price: 45,
    original_price: 50, discount_percentage: 10, images: ["/images/cookies.png"],
    rating: 4.4, review_count: 198, quantity_available: 75, status: "active",
    delivery_time_minutes: 15, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "5", name: "Fresh Farm Eggs (12 pcs)",
    description: "Farm fresh eggs, rich in protein and nutrients",
    category_id: "3", category_name: "Dairy & Eggs", store_id: "store2",
    store_name: "Green Valley Organics", store_distance_km: 1.2, price: 89,
    original_price: 99, discount_percentage: 10, images: ["/images/eggs.png"],
    rating: 4.7, review_count: 256, quantity_available: 40, status: "active",
    delivery_time_minutes: 20, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "6", name: "Surf Excel Detergent 1kg",
    description: "Powerful stain removal for sparkling clean clothes",
    category_id: "8", category_name: "Household", store_id: "store3",
    store_name: "Daily Needs Express", store_distance_km: 0.5, price: 199,
    original_price: 249, discount_percentage: 20, images: ["/images/detergent.png"],
    rating: 4.5, review_count: 423, quantity_available: 30, status: "active",
    delivery_time_minutes: 10, is_wishlist: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "7", name: "Coca-Cola 2L",
    description: "Refreshing cola drink for any occasion",
    category_id: "6", category_name: "Beverages", store_id: "store1",
    store_name: "Fresh Mart Kirana", store_distance_km: 0.8, price: 95,
    original_price: null, discount_percentage: null, images: ["/images/coke.png"],
    rating: 4.3, review_count: 189, quantity_available: 60, status: "active",
    delivery_time_minutes: 15, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "8", name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat bread, soft and nutritious",
    category_id: "4", category_name: "Bakery", store_id: "store2",
    store_name: "Green Valley Organics", store_distance_km: 1.2, price: 45,
    original_price: null, discount_percentage: null, images: ["/images/bread.png"],
    rating: 4.6, review_count: 145, quantity_available: 20, status: "active",
    delivery_time_minutes: 20, is_wishlist: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

// ─── Initialize on first load ───────────────────────────────
initializeStore(seedProducts, seedCategories, seedStores);

// ─── Public API (reads from localStorage) ───────────────────

export const mockCategories: Category[] = getCategories();
export const mockProducts: Product[] = getProducts();
export const mockStores: Store[] = getStores();

export const getFeaturedProducts = (): Product[] => {
  return getProducts().slice(0, 8);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return getProducts().filter((p) => p.category_id === categoryId);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return getProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category_name.toLowerCase().includes(lowerQuery)
  );
};
