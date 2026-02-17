// localStorage abstraction layer for QuickKart Admin
import { Product, Category, Store, Order } from "@/types";
import { SiteSettings } from "@/types/siteSettings";

// ─── Storage Keys ───────────────────────────────────────────
const KEYS = {
    products: "qk_products",
    categories: "qk_categories",
    stores: "qk_stores",
    orders: "qk_orders",
    siteSettings: "qk_site_settings",
    adminSession: "qk_admin_session",
    vendorSession: "qk_vendor_session",
    vendorNotifications: "qk_vendor_notifications",
    initialized: "qk_initialized",
} as const;

// ─── Vendor Types ───────────────────────────────────────────
export interface VendorSession {
    storeId: string;
    storeName: string;
}

export interface VendorNotification {
    id: string;
    storeId: string;
    type: "new_order" | "order_update" | "info";
    title: string;
    message: string;
    orderId?: string;
    isRead: boolean;
    createdAt: string;
}

// ─── Generic Helpers ────────────────────────────────────────
function getItem<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

function setItem<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// ─── Products ───────────────────────────────────────────────
export function getProducts(): Product[] {
    return getItem<Product[]>(KEYS.products) ?? [];
}

export function setProducts(products: Product[]): void {
    setItem(KEYS.products, products);
}

export function getProductById(id: string): Product | undefined {
    return getProducts().find((p) => p.id === id);
}

export function addProduct(product: Product): void {
    const products = getProducts();
    products.push(product);
    setProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): void {
    const products = getProducts().map((p) =>
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    setProducts(products);
}

export function deleteProduct(id: string): void {
    setProducts(getProducts().filter((p) => p.id !== id));
}

// ─── Categories ─────────────────────────────────────────────
export function getCategories(): Category[] {
    return getItem<Category[]>(KEYS.categories) ?? [];
}

export function setCategories(categories: Category[]): void {
    setItem(KEYS.categories, categories);
}

export function getCategoryById(id: string): Category | undefined {
    return getCategories().find((c) => c.id === id);
}

export function addCategory(category: Category): void {
    const categories = getCategories();
    categories.push(category);
    setCategories(categories);
}

export function updateCategory(id: string, updates: Partial<Category>): void {
    const categories = getCategories().map((c) =>
        c.id === id ? { ...c, ...updates } : c
    );
    setCategories(categories);
}

export function deleteCategory(id: string): void {
    setCategories(getCategories().filter((c) => c.id !== id));
}

// ─── Stores ─────────────────────────────────────────────────
export function getStores(): Store[] {
    return getItem<Store[]>(KEYS.stores) ?? [];
}

export function setStores(stores: Store[]): void {
    setItem(KEYS.stores, stores);
}

// ─── Orders ─────────────────────────────────────────────────
export function getOrders(): Order[] {
    return getItem<Order[]>(KEYS.orders) ?? [];
}

export function setOrders(orders: Order[]): void {
    setItem(KEYS.orders, orders);
}

export function updateOrderStatus(
    id: string,
    status: Order["status"]
): void {
    const orders = getOrders().map((o) =>
        o.id === id
            ? {
                ...o,
                status,
                delivered_at: status === "delivered" ? new Date().toISOString() : o.delivered_at,
            }
            : o
    );
    setOrders(orders);
}

// ─── Site Settings ──────────────────────────────────────────
export function getSiteSettings(): SiteSettings {
    return getItem<SiteSettings>(KEYS.siteSettings) ?? getDefaultSiteSettings();
}

export function setSiteSettings(settings: SiteSettings): void {
    setItem(KEYS.siteSettings, settings);
}

export function getDefaultSiteSettings(): SiteSettings {
    return {
        header: {
            brandName: "QuickKart",
            logoUrl: "",
            navLinks: [
                { label: "Home", href: "/", isActive: true },
                { label: "Products", href: "/products", isActive: true },
                { label: "Orders", href: "/orders", isActive: true },
                { label: "Become a Seller", href: "/become-seller", isActive: true },
            ],
        },
        footer: {
            brandName: "QuickKart",
            tagline: "Empowering Local Stores. Delivering at Speed.",
            phone: "+91 1800-123-4567",
            email: "support@quickkart.in",
            address: "Bengaluru, India",
            socialLinks: {
                facebook: "#",
                twitter: "#",
                instagram: "#",
                youtube: "#",
            },
            newsletterTitle: "Subscribe to our newsletter",
            newsletterSubtitle: "Get updates on exclusive deals and new arrivals",
        },
        heroBanner: {
            id: "hero-1",
            imageUrl: "/src/assets/hero-main.png",
            title: "Farm Fresh",
            subtitle: "Get fresh vegetables, fruits, and dairy delivered directly from local farmers to your table.",
            highlightText: "Daily Essentials",
            badgeText: "🚀 Delivery in 8 minutes",
            ctaText: "Shop Now",
            ctaLink: "/products",
            isActive: true,
        },
        promoBanners: [
            {
                id: "promo-1",
                imageUrl: "/src/assets/promo-pharmacy.png",
                title: "Pharmacy at your doorstep",
                ctaText: "Order Medicines",
                ctaLink: "/products?category=pharmacy",
                ctaColor: "teal",
                isActive: true,
            },
            {
                id: "promo-2",
                imageUrl: "/src/assets/promo-pet-care.png",
                title: "Pet Care Supplies",
                ctaText: "Shop Pet Supplies",
                ctaLink: "/products?category=pet-care",
                ctaColor: "orange",
                isActive: true,
            },
        ],
        statsBar: [
            { value: "10K+", label: "Local Stores" },
            { value: "1M+", label: "Happy Customers" },
            { value: "15 min", label: "Avg Delivery" },
            { value: "50+", label: "Cities" },
        ],
    };
}

// ─── Admin Auth ─────────────────────────────────────────────
export function isAdminLoggedIn(): boolean {
    return getItem<boolean>(KEYS.adminSession) === true;
}

export function loginAdmin(username: string, password: string): boolean {
    if (username === "admin" && password === "admin123") {
        setItem(KEYS.adminSession, true);
        return true;
    }
    return false;
}

export function logoutAdmin(): void {
    localStorage.removeItem(KEYS.adminSession);
}

// ─── Initialize Store ───────────────────────────────────────
export function initializeStore(
    seedProducts: Product[],
    seedCategories: Category[],
    seedStores: Store[]
): void {
    const alreadyInitialized = getItem<boolean>(KEYS.initialized);
    if (alreadyInitialized) return;

    setProducts(seedProducts);
    setCategories(seedCategories);
    setStores(seedStores);
    setSiteSettings(getDefaultSiteSettings());
    setOrders(generateSampleOrders());
    setItem(KEYS.initialized, true);
}

// ─── Sample Orders ──────────────────────────────────────────
function generateSampleOrders(): Order[] {
    return [
        {
            id: "ORD-001",
            user_id: "user1",
            items: [
                {
                    id: "ci-1", product_id: "1", product_name: "Fresh Organic Bananas",
                    product_image: "/images/bananas.png", quantity: 2, price: 49, total: 98,
                    store_id: "store2", store_name: "Green Valley Organics",
                    added_at: new Date().toISOString(), available_quantity: 50,
                },
            ],
            subtotal: 98, delivery_charge: 20, discount_amount: 0, total: 118,
            status: "delivered",
            delivery_address: {
                id: "addr1", label: "Home", address: "123 Main St", city: "Bengaluru",
                state: "Karnataka", pincode: "560001", latitude: 12.97, longitude: 77.59,
                is_default: true, created_at: new Date().toISOString(),
            },
            delivery_time_estimate: 15,
            payment_method: "upi",
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            delivered_at: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
        },
        {
            id: "ORD-002",
            user_id: "user2",
            items: [
                {
                    id: "ci-2", product_id: "3", product_name: "Tata Salt 1kg",
                    product_image: "/images/salt.png", quantity: 1, price: 28, total: 28,
                    store_id: "store3", store_name: "Daily Needs Express",
                    added_at: new Date().toISOString(), available_quantity: 100,
                },
                {
                    id: "ci-3", product_id: "7", product_name: "Coca-Cola 2L",
                    product_image: "/images/coke.png", quantity: 2, price: 95, total: 190,
                    store_id: "store1", store_name: "Fresh Mart Kirana",
                    added_at: new Date().toISOString(), available_quantity: 60,
                },
            ],
            subtotal: 218, delivery_charge: 15, discount_amount: 10, total: 223,
            status: "out_for_delivery",
            delivery_address: {
                id: "addr2", label: "Office", address: "456 Tech Park", city: "Bengaluru",
                state: "Karnataka", pincode: "560100", latitude: 12.93, longitude: 77.61,
                is_default: false, created_at: new Date().toISOString(),
            },
            delivery_time_estimate: 20,
            payment_method: "card",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            delivered_at: null,
        },
        {
            id: "ORD-003",
            user_id: "user1",
            items: [
                {
                    id: "ci-4", product_id: "2", product_name: "Amul Butter 500g",
                    product_image: "/images/butter.png", quantity: 1, price: 275, total: 275,
                    store_id: "store1", store_name: "Fresh Mart Kirana",
                    added_at: new Date().toISOString(), available_quantity: 25,
                },
            ],
            subtotal: 275, delivery_charge: 0, discount_amount: 25, total: 250,
            status: "pending",
            delivery_address: {
                id: "addr1", label: "Home", address: "123 Main St", city: "Bengaluru",
                state: "Karnataka", pincode: "560001", latitude: 12.97, longitude: 77.59,
                is_default: true, created_at: new Date().toISOString(),
            },
            delivery_time_estimate: 10,
            payment_method: "cod",
            created_at: new Date().toISOString(),
            delivered_at: null,
        },
    ];
}

// ─── Vendor Auth ────────────────────────────────────────────
export function getVendorSession(): VendorSession | null {
    return getItem<VendorSession>(KEYS.vendorSession);
}

export function isVendorLoggedIn(): boolean {
    return getVendorSession() !== null;
}

export function loginVendor(vendorId: string, password: string): boolean {
    const store = getStores().find((s) => s.vendorId === vendorId);
    if (!store) return false;
    if (store.password !== password) return false;
    setItem<VendorSession>(KEYS.vendorSession, {
        storeId: store.id,
        storeName: store.name,
    });
    return true;
}

export function logoutVendor(): void {
    localStorage.removeItem(KEYS.vendorSession);
}

// Generate a unique vendor ID in QK-XXXXX format
export function generateVendorId(): string {
    const stores = getStores();
    let num = 10001 + stores.length;
    // Ensure uniqueness
    const existingIds = new Set(stores.map((s) => s.vendorId));
    while (existingIds.has(`QK-${num}`)) num++;
    return `QK-${num}`;
}

// Register a new vendor (called from Become a Seller flow)
export function registerVendor(data: {
    name: string;
    category: string;
    description?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    password: string;
}): { vendorId: string; storeId: string } {
    const vendorId = generateVendorId();
    const storeId = generateId();
    const newStore: Store = {
        id: storeId,
        vendorId,
        password: data.password,
        name: data.name,
        logo: null,
        distance_km: Math.round(Math.random() * 30 + 1) / 10,
        rating: 0,
        review_count: 0,
        opening_hours: { monday: "09:00-21:00", tuesday: "09:00-21:00" },
        is_open: true,
        category: data.category,
        description: data.description,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
    };
    const stores = getStores();
    stores.push(newStore);
    setStores(stores);
    return { vendorId, storeId };
}

// ─── Vendor Scoped Queries ──────────────────────────────────
export function getProductsByStore(storeId: string): Product[] {
    return getProducts().filter((p) => p.store_id === storeId);
}

export function getOrdersByStore(storeId: string): Order[] {
    return getOrders().filter((o) =>
        o.items.some((item) => item.store_id === storeId)
    );
}

// ─── Vendor Notifications ───────────────────────────────────
export function getVendorNotifications(storeId: string): VendorNotification[] {
    const all = getItem<VendorNotification[]>(KEYS.vendorNotifications) ?? [];
    return all
        .filter((n) => n.storeId === storeId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addVendorNotification(
    notification: Omit<VendorNotification, "id" | "isRead" | "createdAt">
): VendorNotification {
    const all = getItem<VendorNotification[]>(KEYS.vendorNotifications) ?? [];
    const newNotif: VendorNotification = {
        ...notification,
        id: generateId(),
        isRead: false,
        createdAt: new Date().toISOString(),
    };
    all.push(newNotif);
    setItem(KEYS.vendorNotifications, all);
    return newNotif;
}

export function markNotificationRead(id: string): void {
    const all = getItem<VendorNotification[]>(KEYS.vendorNotifications) ?? [];
    const updated = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setItem(KEYS.vendorNotifications, updated);
}

export function markAllNotificationsRead(storeId: string): void {
    const all = getItem<VendorNotification[]>(KEYS.vendorNotifications) ?? [];
    const updated = all.map((n) =>
        n.storeId === storeId ? { ...n, isRead: true } : n
    );
    setItem(KEYS.vendorNotifications, updated);
}

export function clearVendorNotifications(storeId: string): void {
    const all = getItem<VendorNotification[]>(KEYS.vendorNotifications) ?? [];
    setItem(
        KEYS.vendorNotifications,
        all.filter((n) => n.storeId !== storeId)
    );
}

// Helper: fire notifications for each vendor whose items are in an order
export function notifyVendorsForOrder(order: Order): void {
    // Group items by store
    const storeGroups = new Map<string, { storeName: string; itemCount: number; total: number }>();
    for (const item of order.items) {
        const existing = storeGroups.get(item.store_id);
        if (existing) {
            existing.itemCount += item.quantity;
            existing.total += item.total;
        } else {
            storeGroups.set(item.store_id, {
                storeName: item.store_name,
                itemCount: item.quantity,
                total: item.total,
            });
        }
    }
    storeGroups.forEach((data, storeId) => {
        addVendorNotification({
            storeId,
            type: "new_order",
            title: "🛒 New Order Received!",
            message: `Order #${order.id} — ${data.itemCount} item(s) worth ₹${data.total}`,
            orderId: order.id,
        });
    });
}

// ─── Utility: Generate Unique ID ────────────────────────────
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
