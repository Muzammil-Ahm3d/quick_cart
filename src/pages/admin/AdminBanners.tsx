import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image, Eye, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteSettings, setSiteSettings, generateId } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { HeroBanner, PromoBanner } from "@/types/siteSettings";

const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const AdminBanners = () => {
    const [settings, setSettings] = useState(getSiteSettings());
    const [showPreview, setShowPreview] = useState(false);
    const { toast } = useToast();
    const heroFileRef = useRef<HTMLInputElement>(null);
    const promoFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const handleHeroChange = (field: keyof HeroBanner, value: string | boolean) => {
        setSettings({
            ...settings,
            heroBanner: { ...settings.heroBanner, [field]: value },
        });
    };

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 2MB.", variant: "destructive" });
            return;
        }
        const dataUrl = await fileToDataUrl(file);
        handleHeroChange("imageUrl", dataUrl);
    };

    const handlePromoChange = (index: number, field: keyof PromoBanner, value: string | boolean) => {
        const updated = [...settings.promoBanners];
        updated[index] = { ...updated[index], [field]: value };
        setSettings({ ...settings, promoBanners: updated });
    };

    const handlePromoImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max 2MB.", variant: "destructive" });
            return;
        }
        const dataUrl = await fileToDataUrl(file);
        handlePromoChange(index, "imageUrl", dataUrl);
    };

    const addNewPromo = () => {
        const newPromo: PromoBanner = {
            id: generateId(),
            imageUrl: "",
            title: "New Promo Banner",
            ctaText: "Shop Now",
            ctaLink: "/products",
            ctaColor: "teal",
            isActive: true,
        };
        setSettings({
            ...settings,
            promoBanners: [...settings.promoBanners, newPromo],
        });
        toast({ title: "Banner added", description: "A new promo card has been created. Fill in the details and save." });
    };

    const removePromo = (index: number) => {
        if (!window.confirm("Delete this promo banner?")) return;
        const updated = settings.promoBanners.filter((_, i) => i !== index);
        setSettings({ ...settings, promoBanners: updated });
    };

    const handleSave = () => {
        setSiteSettings(settings);
        toast({ title: "Banners saved!", description: "Your banner changes are now live." });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Banners</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage hero and promotional banners</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        <Eye className="w-4 h-4" /> {showPreview ? "Hide" : "Show"} Preview
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Preview */}
            {showPreview && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-card rounded-xl border border-border p-4 space-y-4"
                >
                    <h3 className="font-semibold flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Live Preview
                    </h3>
                    {/* Hero Preview */}
                    <div className="relative rounded-xl overflow-hidden aspect-[3/1] bg-muted">
                        {settings.heroBanner.imageUrl && (
                            <img src={settings.heroBanner.imageUrl} alt="Hero" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex flex-col justify-center px-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-xs font-bold w-fit mb-2">
                                {settings.heroBanner.badgeText}
                            </span>
                            <h2 className="text-2xl font-bold text-white">
                                {settings.heroBanner.title}{" "}
                                <span className="text-lime-300">{settings.heroBanner.highlightText}</span>
                            </h2>
                            <p className="text-white/80 text-sm mt-1 max-w-md">{settings.heroBanner.subtitle}</p>
                        </div>
                    </div>

                    {/* Promo Previews */}
                    <div className="grid grid-cols-2 gap-3">
                        {settings.promoBanners.map((promo) => (
                            <div key={promo.id} className="relative rounded-lg overflow-hidden aspect-[2/1] bg-muted">
                                {promo.imageUrl && (
                                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                                    <span className="text-white text-xs font-bold bg-white/20 rounded px-2 py-1 backdrop-blur-sm">
                                        {promo.ctaText}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ═══════ Hero Banner Section ═══════ */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Hero Banner
                </h2>

                {/* Hero Image Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Background Image</label>
                    {settings.heroBanner.imageUrl ? (
                        <div className="relative group rounded-xl overflow-hidden aspect-[3/1]">
                            <img
                                src={settings.heroBanner.imageUrl}
                                alt="Hero banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => heroFileRef.current?.click()}
                                    className="px-3 py-1.5 rounded-lg bg-white/90 text-sm font-medium hover:bg-white transition"
                                >
                                    Replace
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleHeroChange("imageUrl", "")}
                                    className="p-1.5 rounded-full bg-white/90 hover:bg-white transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => heroFileRef.current?.click()}
                            className="w-full aspect-[3/1] rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Upload Hero Image</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG up to 2MB</span>
                        </button>
                    )}
                    <Input
                        value={settings.heroBanner.imageUrl.startsWith("data:") ? "" : settings.heroBanner.imageUrl}
                        onChange={(e) => handleHeroChange("imageUrl", e.target.value)}
                        placeholder="Or paste image URL..."
                        className="text-xs"
                    />
                    <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Title</label>
                        <Input value={settings.heroBanner.title} onChange={(e) => handleHeroChange("title", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Highlight Text</label>
                        <Input value={settings.heroBanner.highlightText} onChange={(e) => handleHeroChange("highlightText", e.target.value)} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium">Subtitle</label>
                        <Input value={settings.heroBanner.subtitle} onChange={(e) => handleHeroChange("subtitle", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Badge Text</label>
                        <Input value={settings.heroBanner.badgeText} onChange={(e) => handleHeroChange("badgeText", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">CTA Button Text</label>
                        <Input value={settings.heroBanner.ctaText} onChange={(e) => handleHeroChange("ctaText", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">CTA Link</label>
                        <Input value={settings.heroBanner.ctaLink} onChange={(e) => handleHeroChange("ctaLink", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* ═══════ Promo Banners ═══════ */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Promo Banners ({settings.promoBanners.length})</h2>
                <Button variant="outline" onClick={addNewPromo}>
                    <Plus className="w-4 h-4" /> Add New Banner
                </Button>
            </div>

            {settings.promoBanners.map((promo, index) => (
                <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl border border-border p-6 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                            Promo Card {index + 1}
                            {!promo.imageUrl && !promo.title && (
                                <span className="ml-2 text-xs text-muted-foreground">(New)</span>
                            )}
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removePromo(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Promo Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image</label>
                        {promo.imageUrl ? (
                            <div className="relative group rounded-lg overflow-hidden aspect-[2/1] max-w-sm">
                                <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => promoFileRefs.current[promo.id]?.click()}
                                        className="px-3 py-1.5 rounded-lg bg-white/90 text-sm font-medium hover:bg-white transition"
                                    >
                                        Replace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handlePromoChange(index, "imageUrl", "")}
                                        className="p-1.5 rounded-full bg-white/90 hover:bg-white transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => promoFileRefs.current[promo.id]?.click()}
                                className="w-full max-w-sm aspect-[2/1] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <Upload className="w-6 h-6 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload Banner Image</span>
                            </button>
                        )}
                        <Input
                            value={promo.imageUrl.startsWith("data:") ? "" : promo.imageUrl}
                            onChange={(e) => handlePromoChange(index, "imageUrl", e.target.value)}
                            placeholder="Or paste image URL..."
                            className="text-xs max-w-sm"
                        />
                        <input
                            ref={(el) => { promoFileRefs.current[promo.id] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePromoImageUpload(index, e)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Title</label>
                            <Input value={promo.title} onChange={(e) => handlePromoChange(index, "title", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">CTA Text</label>
                            <Input value={promo.ctaText} onChange={(e) => handlePromoChange(index, "ctaText", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">CTA Link</label>
                            <Input value={promo.ctaLink} onChange={(e) => handlePromoChange(index, "ctaLink", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">CTA Color Theme</label>
                            <select
                                value={promo.ctaColor}
                                onChange={(e) => handlePromoChange(index, "ctaColor", e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            >
                                <option value="teal">Teal</option>
                                <option value="orange">Orange</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="pink">Pink</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            ))}

            {settings.promoBanners.length === 0 && (
                <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                    No promo banners yet. Click "Add New Banner" to create one.
                </div>
            )}
        </div>
    );
};

export default AdminBanners;
