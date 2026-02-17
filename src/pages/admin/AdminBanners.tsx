import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Image, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteSettings, setSiteSettings } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { HeroBanner, PromoBanner } from "@/types/siteSettings";

const AdminBanners = () => {
    const [settings, setSettings] = useState(getSiteSettings());
    const [showPreview, setShowPreview] = useState(false);
    const { toast } = useToast();

    const handleHeroChange = (field: keyof HeroBanner, value: string | boolean) => {
        setSettings({
            ...settings,
            heroBanner: { ...settings.heroBanner, [field]: value },
        });
    };

    const handlePromoChange = (index: number, field: keyof PromoBanner, value: string | boolean) => {
        const updated = [...settings.promoBanners];
        updated[index] = { ...updated[index], [field]: value };
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
                    <h3 className="font-semibold flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</h3>
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

            {/* Hero Banner Section */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Hero Banner
                </h2>

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
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Background Image URL</label>
                        <Input value={settings.heroBanner.imageUrl} onChange={(e) => handleHeroChange("imageUrl", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Promo Banners */}
            {settings.promoBanners.map((promo, index) => (
                <div key={promo.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
                    <h2 className="font-semibold text-foreground">Promo Card {index + 1}</h2>
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
                            <label className="text-sm font-medium">Image URL</label>
                            <Input value={promo.imageUrl} onChange={(e) => handlePromoChange(index, "imageUrl", e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminBanners;
