import { useState } from "react";
import { motion } from "framer-motion";
import {
    RotateCcw,
    Search,
    AlertTriangle,
    Truck,
    PackageX,
    CheckCircle,
    Clock,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type IssueType = "return" | "damage" | "delivery" | "compliance";
type IssueStatus = "open" | "in_progress" | "resolved";

interface Issue {
    id: string;
    orderId: string;
    type: IssueType;
    title: string;
    description: string;
    status: IssueStatus;
    customerName: string;
    vendorName: string;
    createdAt: string;
    resolvedAt: string | null;
}

const mockIssues: Issue[] = [
    {
        id: "ISS-001",
        orderId: "ORD-001",
        type: "return",
        title: "Customer requested return",
        description: "Item received damaged, customer wants a full refund.",
        status: "open",
        customerName: "Rahul Sharma",
        vendorName: "Fresh Mart Kirana",
        createdAt: "2026-03-28",
        resolvedAt: null,
    },
    {
        id: "ISS-002",
        orderId: "ORD-002",
        type: "damage",
        title: "Product arrived broken",
        description: "Glass jar cracked during transit.",
        status: "in_progress",
        customerName: "Priya Patel",
        vendorName: "Green Valley Organics",
        createdAt: "2026-03-30",
        resolvedAt: null,
    },
    {
        id: "ISS-003",
        orderId: "ORD-003",
        type: "delivery",
        title: "Delivery delayed by 2 hours",
        description: "Rider had vehicle issues, late delivery reported by customer.",
        status: "resolved",
        customerName: "Amit Kumar",
        vendorName: "Daily Needs Express",
        createdAt: "2026-03-25",
        resolvedAt: "2026-03-26",
    },
    {
        id: "ISS-004",
        orderId: "ORD-001",
        type: "compliance",
        title: "Non-compliant product listing",
        description: "Product 'Organic Honey' missing mandatory FSSAI number and expiry date.",
        status: "open",
        customerName: "—",
        vendorName: "Fresh Mart Kirana",
        createdAt: "2026-04-01",
        resolvedAt: null,
    },
    {
        id: "ISS-005",
        orderId: "ORD-002",
        type: "return",
        title: "RTO - Return to Origin",
        description: "Customer not available at delivery address. Item returned to vendor.",
        status: "resolved",
        customerName: "Vikram Singh",
        vendorName: "Green Valley Organics",
        createdAt: "2026-03-20",
        resolvedAt: "2026-03-22",
    },
];

const typeConfig: Record<IssueType, { label: string; color: string; icon: typeof RotateCcw }> = {
    return: { label: "Return / RTO", color: "bg-orange-100 text-orange-800", icon: RotateCcw },
    damage: { label: "Damage", color: "bg-red-100 text-red-800", icon: PackageX },
    delivery: { label: "Delivery", color: "bg-blue-100 text-blue-800", icon: Truck },
    compliance: { label: "Compliance", color: "bg-purple-100 text-purple-800", icon: AlertTriangle },
};

const statusConfig: Record<IssueStatus, { label: string; color: string; icon: typeof Clock }> = {
    open: { label: "Open", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Clock },
    resolved: { label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle },
};

const AdminReturns = () => {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<IssueType | "all">("all");

    const filtered = mockIssues.filter((issue) => {
        const matchesSearch =
            issue.title.toLowerCase().includes(search.toLowerCase()) ||
            issue.orderId.toLowerCase().includes(search.toLowerCase()) ||
            issue.customerName.toLowerCase().includes(search.toLowerCase()) ||
            issue.vendorName.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "all" || issue.type === filterType;
        return matchesSearch && matchesType;
    });

    const openCount = mockIssues.filter((i) => i.status === "open").length;
    const inProgressCount = mockIssues.filter((i) => i.status === "in_progress").length;
    const resolvedCount = mockIssues.filter((i) => i.status === "resolved").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Returns & Issues</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Track returns, damages, delivery problems, and non-compliant items
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
                    <p className="text-2xl font-bold">{mockIssues.length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Open</p>
                    <p className="text-2xl font-bold text-yellow-600">{openCount}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, order ID, customer, or vendor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "return", "damage", "delivery", "compliance"] as const).map((type) => (
                        <Button
                            key={type}
                            variant={filterType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterType(type)}
                            className="capitalize"
                        >
                            {type === "all" ? "All" : typeConfig[type].label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Issues Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Issue</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Customer</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Vendor</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((issue, idx) => {
                                const tCfg = typeConfig[issue.type];
                                const sCfg = statusConfig[issue.status];
                                return (
                                    <motion.tr
                                        key={issue.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-foreground">{issue.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                    {issue.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge className={tCfg.color}>
                                                <tCfg.icon className="w-3 h-3 mr-1" />
                                                {tCfg.label}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4">
                                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                                                {issue.orderId}
                                            </code>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground">{issue.customerName}</td>
                                        <td className="px-5 py-4 text-muted-foreground">{issue.vendorName}</td>
                                        <td className="px-5 py-4">
                                            <Badge className={sCfg.color}>{sCfg.label}</Badge>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground text-xs">
                                            {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                                        No issues found.
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

export default AdminReturns;
