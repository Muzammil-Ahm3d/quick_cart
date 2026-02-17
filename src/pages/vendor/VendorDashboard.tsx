import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ShoppingBag, IndianRupee, Clock, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    getVendorSession, getProductsByStore, getOrdersByStore,
    getVendorNotifications, markNotificationRead,
    VendorNotification,
} from "@/lib/store";

const VendorDashboard = () => {
    const session = getVendorSession()!;
    const [products, setProducts] = useState(getProductsByStore(session.storeId));
    const [orders, setOrders] = useState(getOrdersByStore(session.storeId));
    const [notifications, setNotifications] = useState<VendorNotification[]>([]);

    // Poll for fresh data every 3 seconds
    useEffect(() => {
        const poll = () => {
            setProducts(getProductsByStore(session.storeId));
            setOrders(getOrdersByStore(session.storeId));
            setNotifications(getVendorNotifications(session.storeId));
        };
        poll();
        const interval = setInterval(poll, 3000);
        return () => clearInterval(interval);
    }, [session.storeId]);

    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => {
            const vendorItems = o.items.filter((i) => i.store_id === session.storeId);
            return sum + vendorItems.reduce((s, i) => s + i.total, 0);
        }, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
    const recentOrders = orders.slice(0, 5);
    const unreadNotifs = notifications.filter((n) => !n.isRead);

    const stats = [
        { label: "Total Products", value: products.length, icon: Package, color: "from-blue-500 to-blue-600" },
        { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "from-indigo-500 to-purple-600" },
        { label: "Pending Orders", value: pendingOrders, icon: Clock, color: "from-amber-500 to-orange-600" },
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "from-emerald-500 to-green-600" },
    ];

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        packed: "bg-indigo-100 text-indigo-800",
        out_for_delivery: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    const handleNotifClick = (n: VendorNotification) => {
        markNotificationRead(n.id);
        setNotifications(getVendorNotifications(session.storeId));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome back, <span className="font-semibold text-foreground">{session.storeName}</span>
                    </p>
                </div>
                <Link to="/vendor/products/new">
                    <Button>
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card rounded-xl border border-border p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Recent Orders</h2>
                        <Link to="/vendor/orders" className="text-xs text-primary hover:underline">View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 text-muted-foreground">
                                    <th className="text-left px-4 py-2.5 font-medium">Order</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Items</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Total</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => {
                                    const vendorItems = order.items.filter((i) => i.store_id === session.storeId);
                                    const vendorTotal = vendorItems.reduce((s, i) => s + i.total, 0);
                                    return (
                                        <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{order.id}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{vendorItems.length}</td>
                                            <td className="px-4 py-3 font-medium">₹{vendorTotal}</td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${statusColors[order.status]} capitalize text-xs`}>
                                                    {order.status.replace(/_/g, " ")}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No orders yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Notifications
                            {unreadNotifs.length > 0 && (
                                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                                    {unreadNotifs.length}
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
                        ) : (
                            notifications.slice(0, 10).map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => handleNotifClick(n)}
                                    className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition ${!n.isRead ? "bg-primary/5" : ""
                                        }`}
                                >
                                    <p className="text-sm font-medium">{n.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
