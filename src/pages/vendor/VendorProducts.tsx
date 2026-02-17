import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getVendorSession, getProductsByStore, deleteProduct } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const VendorProducts = () => {
    const session = getVendorSession()!;
    const [products, setProductList] = useState(getProductsByStore(session.storeId));
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const refresh = () => setProductList(getProductsByStore(session.storeId));

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            deleteProduct(id);
            refresh();
            toast({ title: "Product deleted", description: `"${name}" removed.` });
        }
    };

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

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
                    <h1 className="text-2xl font-bold text-foreground">Your Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">{products.length} products listed</p>
                </div>
                <Link to="/vendor/products/new">
                    <Button>
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            {/* Product Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
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
                                                src={product.images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-muted"
                                            />
                                            <div>
                                                <p className="font-medium text-foreground truncate max-w-[200px]">{product.name}</p>
                                                <p className="text-xs text-muted-foreground sm:hidden">{product.category_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{product.category_name}</td>
                                    <td className="px-4 py-3 font-medium">₹{product.price}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">{product.quantity_available}</td>
                                    <td className="px-4 py-3">
                                        <Badge className={`${statusColors[product.status]} text-xs capitalize`}>
                                            {product.status.replace(/_/g, " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(product.id, product.name)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        No products found. Add your first product!
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

export default VendorProducts;
