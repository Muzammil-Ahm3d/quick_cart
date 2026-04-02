import { useState } from "react";
import { motion } from "framer-motion";
import {
    Store,
    Search,
    MoreHorizontal,
    Eye,
    Ban,
    CheckCircle,
    MapPin,
    Phone,
    Mail,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStores, getProductsByStore, getOrdersByStore } from "@/lib/store";

const AdminVendors = () => {
    const stores = getStores();
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = stores.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.vendorId?.toLowerCase().includes(search.toLowerCase()) ||
            s.ownerName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage all registered sellers and KiranaMarts
                    </p>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1.5 self-start">
                    {stores.length} Registered Vendors
                </Badge>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, vendor ID, or owner..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Vendors Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Vendor</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">ID</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Products</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Orders</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((store, idx) => {
                                const productCount = getProductsByStore(store.id).length;
                                const orderCount = getOrdersByStore(store.id).length;
                                const isExpanded = expandedId === store.id;

                                return (
                                    <motion.tr
                                        key={store.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : store.id)}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Store className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{store.name}</p>
                                                    {store.ownerName && (
                                                        <p className="text-xs text-muted-foreground">{store.ownerName}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                                                {store.vendorId || "—"}
                                            </code>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground capitalize">
                                            {store.category || "General"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>{productCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-medium">{orderCount}</td>
                                        <td className="px-5 py-4">
                                            <Badge
                                                className={
                                                    store.is_open
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {store.is_open ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 ${store.is_open ? "text-destructive" : "text-green-600"}`}
                                                >
                                                    {store.is_open ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                                        No vendors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total Vendors</p>
                    <p className="text-2xl font-bold">{stores.length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Active Vendors</p>
                    <p className="text-2xl font-bold text-green-600">
                        {stores.filter((s) => s.is_open).length}
                    </p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Inactive Vendors</p>
                    <p className="text-2xl font-bold text-red-600">
                        {stores.filter((s) => !s.is_open).length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminVendors;
