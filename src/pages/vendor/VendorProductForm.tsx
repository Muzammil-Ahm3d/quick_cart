import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, ImageIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct, getCategories, getVendorSession, getStores, generateId } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";

const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const VendorProductForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const session = getVendorSession()!;
    const categories = getCategories();
    const store = getStores().find((s) => s.id === session.storeId);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        category_id: categories[0]?.id || "",
        price: "",
        original_price: "",
        quantity_available: "",
        status: "active" as Product["status"],
        delivery_time_minutes: "",
    });

    const [coverImage, setCoverImage] = useState("");
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 2MB.", variant: "destructive" });
            return;
        }
        setCoverImage(await fileToDataUrl(file));
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newImages: string[] = [];
        for (const file of Array.from(files)) {
            if (file.size > 2 * 1024 * 1024) continue;
            newImages.push(await fileToDataUrl(file));
        }
        setGalleryImages((prev) => [...prev, ...newImages]);
        if (galleryInputRef.current) galleryInputRef.current.value = "";
    };

    const removeGalleryImage = (idx: number) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const category = categories.find((c) => c.id === form.category_id);
        const price = Number(form.price);
        const originalPrice = form.original_price ? Number(form.original_price) : null;
        const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
        const allImages = [coverImage, ...galleryImages].filter(Boolean);

        const newProduct: Product = {
            id: generateId(),
            name: form.name,
            description: form.description,
            category_id: form.category_id,
            category_name: category?.name || "",
            store_id: session.storeId,
            store_name: session.storeName,
            store_distance_km: store?.distance_km || 0,
            price,
            original_price: originalPrice,
            discount_percentage: discount,
            images: allImages,
            quantity_available: Number(form.quantity_available),
            status: form.status,
            delivery_time_minutes: Number(form.delivery_time_minutes),
            rating: 4 + Math.random() * 0.9,
            review_count: Math.floor(Math.random() * 200) + 10,
            is_wishlist: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        addProduct(newProduct);
        toast({ title: "Product added!", description: `"${form.name}" is now listed.` });
        navigate("/vendor/products");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Add Product</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Add a new product to <span className="font-semibold">{session.storeName}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Image */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <Star className="w-5 h-5 text-cta" /> Cover Image
                    </h2>
                    {coverImage ? (
                        <div className="relative group w-full max-w-xs">
                            <img src={coverImage} alt="Cover" className="w-full aspect-square rounded-xl object-cover border border-border" />
                            <button type="button" onClick={() => setCoverImage("")}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => coverInputRef.current?.click()}
                            className="w-full max-w-xs aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Upload Cover Image</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG up to 2MB</span>
                        </button>
                    )}
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </div>

                {/* Gallery */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" /> Additional Images
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square">
                                <img src={img} alt="" className="w-full h-full rounded-lg object-cover border border-border" />
                                <button type="button" onClick={() => removeGalleryImage(idx)}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => galleryInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-1 cursor-pointer">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add</span>
                        </button>
                    </div>
                    <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </div>

                {/* Product Details */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                    <h2 className="font-semibold text-foreground">Product Details</h2>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Product Name *</label>
                        <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Fresh Bananas" required />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                            placeholder="Product description..." className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Category *</label>
                        <select name="category_id" value={form.category_id} onChange={handleChange}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Selling Price (₹) *</label>
                            <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="49" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Original Price (₹)</label>
                            <Input name="original_price" type="number" value={form.original_price} onChange={handleChange} placeholder="65 (optional)" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Quantity Available *</label>
                            <Input name="quantity_available" type="number" value={form.quantity_available} onChange={handleChange} placeholder="50" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Delivery Time (minutes) *</label>
                            <Input name="delivery_time_minutes" type="number" value={form.delivery_time_minutes} onChange={handleChange} placeholder="15" required />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Status</label>
                        <select name="status" value={form.status} onChange={handleChange}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button type="submit" className="min-w-[120px]">
                        <Save className="w-4 h-4" /> Add Product
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default VendorProductForm;
