import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts, deleteCategory } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AdminCategories = () => {
    const [categories, setCategoryList] = useState(getCategories());
    const products = getProducts();
    const { toast } = useToast();

    const refresh = () => setCategoryList(getCategories());

    const getProductCount = (categoryId: string) =>
        products.filter((p) => p.category_id === categoryId).length;

    const handleDelete = (id: string, name: string) => {
        const count = getProductCount(id);
        if (count > 0) {
            toast({
                title: "Cannot delete",
                description: `"${name}" has ${count} product(s). Remove them first.`,
                variant: "destructive",
            });
            return;
        }
        if (window.confirm(`Delete category "${name}"?`)) {
            deleteCategory(id);
            refresh();
            toast({ title: "Category deleted", description: `"${name}" has been removed.` });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categories</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage product categories ({categories.length} total)
                    </p>
                </div>
                <Link to="/admin/categories/new">
                    <Button>
                        <Plus className="w-4 h-4" /> Add Category
                    </Button>
                </Link>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category, idx) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                {category.icon}
                            </div>
                            <div className="flex gap-1">
                                <Link to={`/admin/categories/edit/${category.id}`}>
                                    <Button variant="ghost" size="icon-sm">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(category.id, category.name)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Package className="w-3.5 h-3.5" />
                            <span>{getProductCount(category.id)} products</span>
                        </div>
                    </motion.div>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No categories yet. Add your first category!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
