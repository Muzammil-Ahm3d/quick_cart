import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategoryById, addCategory, updateCategory, generateId } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const emojis = ["🛒", "🥬", "🥛", "🍞", "🍿", "🥤", "🧴", "🏠", "💊", "🐾", "🧹", "🍬", "🥩", "🧊", "🌾", "🍎"];

const AdminCategoryForm = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { toast } = useToast();

    const [form, setForm] = useState({
        name: "",
        icon: "🛒",
        image: "",
    });

    useEffect(() => {
        if (isEditing && id) {
            const category = getCategoryById(id);
            if (category) {
                setForm({
                    name: category.name,
                    icon: category.icon,
                    image: category.image,
                });
            }
        }
    }, [id, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && id) {
            updateCategory(id, { name: form.name, icon: form.icon, image: form.image });
            toast({ title: "Category updated", description: `"${form.name}" has been updated.` });
        } else {
            addCategory({
                id: generateId(),
                name: form.name,
                icon: form.icon,
                image: form.image,
                product_count: 0,
            });
            toast({ title: "Category created", description: `"${form.name}" has been added.` });
        }

        navigate("/admin/categories");
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isEditing ? "Edit Category" : "Add Category"}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Category Name *</label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Fruits & Vegetables"
                        required
                    />
                </div>

                {/* Icon Picker */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Icon</label>
                    <div className="flex flex-wrap gap-2">
                        {emojis.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => setForm({ ...form, icon: emoji })}
                                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${form.icon === emoji
                                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="/images/category.png"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" className="min-w-[120px]">
                        <Save className="w-4 h-4" /> {isEditing ? "Update" : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminCategoryForm;
