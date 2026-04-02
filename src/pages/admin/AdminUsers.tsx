import { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
    Calendar,
    UserCheck,
    UserX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock users data — in production this would come from a database
const mockUsers = [
    {
        id: "USR-001",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "rahul.sharma@gmail.com",
        city: "Bengaluru",
        orders: 12,
        totalSpent: 4520,
        status: "active" as const,
        joinedAt: "2025-11-15",
        lastActive: "2026-04-01",
    },
    {
        id: "USR-002",
        name: "Priya Patel",
        phone: "+91 91234 56789",
        email: "priya.p@gmail.com",
        city: "Bengaluru",
        orders: 8,
        totalSpent: 2890,
        status: "active" as const,
        joinedAt: "2025-12-01",
        lastActive: "2026-03-30",
    },
    {
        id: "USR-003",
        name: "Amit Kumar",
        phone: "+91 87654 32109",
        email: "amit.k@yahoo.com",
        city: "Hyderabad",
        orders: 3,
        totalSpent: 780,
        status: "active" as const,
        joinedAt: "2026-01-10",
        lastActive: "2026-03-28",
    },
    {
        id: "USR-004",
        name: "Sneha Reddy",
        phone: "+91 76543 21098",
        email: "sneha.r@outlook.com",
        city: "Mumbai",
        orders: 0,
        totalSpent: 0,
        status: "inactive" as const,
        joinedAt: "2026-02-20",
        lastActive: "2026-02-20",
    },
    {
        id: "USR-005",
        name: "Vikram Singh",
        phone: "+91 65432 10987",
        email: "vikram.s@gmail.com",
        city: "Delhi",
        orders: 22,
        totalSpent: 8950,
        status: "active" as const,
        joinedAt: "2025-10-05",
        lastActive: "2026-04-02",
    },
];

const AdminUsers = () => {
    const [search, setSearch] = useState("");

    const filtered = mockUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.phone.includes(search) ||
            u.id.toLowerCase().includes(search.toLowerCase())
    );

    const totalActive = mockUsers.filter((u) => u.status === "active").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and manage all registered customers
                    </p>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1.5 self-start">
                    {mockUsers.length} Total Users
                </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Total Users</span>
                    </div>
                    <p className="text-2xl font-bold">{mockUsers.length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{totalActive}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <UserX className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">Inactive</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                        {mockUsers.length - totalActive}
                    </p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <p className="text-2xl font-bold">
                        {mockUsers.reduce((s, u) => s + u.orders, 0)}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, phone, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">User</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Contact</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">City</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Orders</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Spent</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Joined</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border-b border-border last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-primary">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                <span className="text-xs">{user.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <span className="text-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            <span>{user.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium">{user.orders}</td>
                                    <td className="px-5 py-4 font-medium">₹{user.totalSpent.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-xs">
                                                {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge
                                            className={
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }
                                        >
                                            {user.status === "active" ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                </motion.tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                                        No users found.
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

export default AdminUsers;
