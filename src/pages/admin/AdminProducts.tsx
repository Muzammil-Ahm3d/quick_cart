import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProducts, deleteProduct } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AdminProducts = () => {
    const [products, setProductList] = useState(getProducts());
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { toast } = useToast();

    const refresh = () => setProductList(getProducts());

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteProduct(id);
            refresh();
            toast({ title: "Product deleted", description: `"${name}" has been removed.` });
        }
    };

    const filtered = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category_name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        out_of_stock: "bg-red-100 text-red-800",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your product catalog ({products.length} total)
                    </p>
                </div>
                <Link to="/admin/products/new">
                    <Button>
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "active", "inactive", "out_of_stock"].map((s) => (
                        <Button
                            key={s}
                            variant={statusFilter === s ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(s)}
                            className="capitalize"
                        >
                            {s === "all" ? "All" : s.replace(/_/g, " ")}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((product, idx) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="border-b border-border last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-muted"
                                            />
                                            <div>
                                                <p className="font-medium text-foreground truncate max-w-[200px]">{product.name}</p>
                                                <p className="text-xs text-muted-foreground md:hidden">{product.category_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{product.category_name}</td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium">₹{product.price}</span>
                                        {product.original_price && (
                                            <span className="text-xs text-muted-foreground line-through ml-1">
                                                ₹{product.original_price}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">{product.quantity_available}</td>
                                    <td className="px-4 py-3">
                                        <Badge className={`${statusColors[product.status]} text-xs capitalize`}>
                                            {product.status.replace(/_/g, " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link to={`/admin/products/edit/${product.id}`}>
                                                <Button variant="ghost" size="icon-sm">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(product.id, product.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        No products found.
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

export default AdminProducts;
