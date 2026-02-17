// Product types for QuickKart
export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category_name: string;
  store_id: string;
  store_name: string;
  store_distance_km: number;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  images: string[];
  rating: number;
  review_count: number;
  quantity_available: number;
  status: "active" | "inactive" | "out_of_stock";
  delivery_time_minutes: number;
  is_wishlist: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  vendorId: string;
  password: string;
  name: string;
  logo: string | null;
  distance_km: number;
  rating: number;
  review_count: number;
  opening_hours: Record<string, string>;
  is_open: boolean;
  category: string;
  description?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
  store_id: string;
  store_name: string;
  added_at: string;
  available_quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  product_count: number;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  profile_photo: string | null;
  saved_addresses: Address[];
  preferences: {
    language: string;
    theme: "light" | "dark" | "auto";
    notifications_enabled: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total: number;
  status: "pending" | "confirmed" | "packed" | "out_for_delivery" | "delivered" | "cancelled";
  delivery_address: Address;
  delivery_time_estimate: number;
  payment_method: "cod" | "card" | "upi" | "netbanking" | "wallet";
  created_at: string;
  delivered_at: string | null;
  notes?: string;
}
