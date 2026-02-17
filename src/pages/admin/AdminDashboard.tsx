import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Package,
    FolderTree,
    ShoppingBag,
    IndianRupee,
    Plus,
    ArrowRight,
    TrendingUp,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts, getCategories, getOrders } from "@/lib/store";

const AdminDashboard = () => {
    const products = getProducts();
    const categories = getCategories();
    const orders = getOrders();

    const totalRevenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const activeProducts = products.filter((p) => p.status === "active").length;

    const stats = [
        {
            label: "Total Products",
            value: products.length,
            icon: Package,
            color: "text-primary",
            bg: "bg-primary/10",
            href: "/admin/products",
        },
        {
            label: "Categories",
            value: categories.length,
            icon: FolderTree,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/admin/categories",
        },
        {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: "/admin/orders",
        },
        {
            label: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            href: "/admin/orders",
        },
    ];

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        packed: "bg-indigo-100 text-indigo-800",
        out_for_delivery: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome back! Here's your store overview.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/products/new">
                        <Button size="sm">
                            <Plus className="w-4 h-4" /> Add Product
                        </Button>
                    </Link>
                    <Link to="/admin/categories/new">
                        <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" /> Add Category
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link to={stat.href}>
                            <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Active Products</span>
                    </div>
                    <p className="text-xl font-bold">{activeProducts} <span className="text-sm font-normal text-muted-foreground">/ {products.length}</span></p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Pending Orders</span>
                    </div>
                    <p className="text-xl font-bold">{pendingOrders}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <FolderTree className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Categories</span>
                    </div>
                    <p className="text-xl font-bold">{categories.length}</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Recent Orders</h2>
                    <Link to="/admin/orders">
                        <Button variant="ghost" size="sm">
                            View All <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order ID</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Items</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Total</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                    <td className="px-5 py-3 font-medium">{order.id}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{order.items.length} item(s)</td>
                                    <td className="px-5 py-3 font-medium">₹{order.total}</td>
                                    <td className="px-5 py-3">
                                        <Badge
                                            className={`${statusColors[order.status] || "bg-gray-100 text-gray-800"} text-xs capitalize`}
                                        >
                                            {order.status.replace(/_/g, " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                                        No orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
