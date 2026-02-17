import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getVendorSession, getOrdersByStore, updateOrderStatus } from "@/lib/store";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statusOptions: Order["status"][] = [
    "pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled",
];

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    packed: "bg-indigo-100 text-indigo-800",
    out_for_delivery: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const VendorOrders = () => {
    const session = getVendorSession()!;
    const [orders, setOrderList] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    // Poll every 3 seconds for new orders
    useEffect(() => {
        const poll = () => setOrderList(getOrdersByStore(session.storeId));
        poll();
        const interval = setInterval(poll, 3000);
        return () => clearInterval(interval);
    }, [session.storeId]);

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        updateOrderStatus(orderId, newStatus);
        setOrderList(getOrdersByStore(session.storeId));
        toast({ title: "Order updated", description: `Order ${orderId} → "${newStatus.replace(/_/g, " ")}"` });
    };

    const filtered = orders.filter((o) => {
        const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Orders</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Orders containing your products ({orders.length} total)
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", ...statusOptions].map((s) => (
                        <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm"
                            onClick={() => setStatusFilter(s)} className="capitalize text-xs">
                            {s === "all" ? "All" : s.replace(/_/g, " ")}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Your Items</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Your Total</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order, idx) => {
                                const vendorItems = order.items.filter((i) => i.store_id === session.storeId);
                                const vendorTotal = vendorItems.reduce((s, i) => s + i.total, 0);
                                return (
                                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{order.id}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{vendorItems.length} item(s)</td>
                                        <td className="px-4 py-3 font-medium">₹{vendorTotal}</td>
                                        <td className="px-4 py-3">
                                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                                                className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer ${statusColors[order.status]}`}>
                                                {statusOptions.map((s) => (
                                                    <option key={s} value={s} className="bg-white text-black">{s.replace(/_/g, " ")}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                                <Eye className="w-4 h-4" /> View
                                            </Button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-xl border border-border p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg">Order {selectedOrder.id}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>✕</Button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge className={`${statusColors[selectedOrder.status]} capitalize`}>
                                    {selectedOrder.status.replace(/_/g, " ")}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment</span>
                                <span className="uppercase font-medium">{selectedOrder.payment_method}</span>
                            </div>
                            <hr className="border-border" />
                            <h3 className="font-semibold">Your Items</h3>
                            {selectedOrder.items
                                .filter((i) => i.store_id === session.storeId)
                                .map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 py-2">
                                        <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <span className="font-medium">₹{item.total}</span>
                                    </div>
                                ))}
                            <hr className="border-border" />
                            <h3 className="font-semibold">Delivery Address</h3>
                            <p className="text-muted-foreground">
                                {selectedOrder.delivery_address.label} — {selectedOrder.delivery_address.address},{" "}
                                {selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state}{" "}
                                {selectedOrder.delivery_address.pincode}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default VendorOrders;
