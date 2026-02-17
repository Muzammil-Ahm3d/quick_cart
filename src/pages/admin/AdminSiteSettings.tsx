import { useState } from "react";
import { Save, Globe, Phone, Mail, MapPin, Link as LinkIcon, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteSettings, setSiteSettings } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AdminSiteSettings = () => {
    const [settings, setSettings] = useState(getSiteSettings());
    const { toast } = useToast();

    const handleHeaderChange = (field: string, value: string) => {
        setSettings({
            ...settings,
            header: { ...settings.header, [field]: value },
        });
    };

    const handleFooterChange = (field: string, value: string) => {
        setSettings({
            ...settings,
            footer: { ...settings.footer, [field]: value },
        });
    };

    const handleSocialChange = (platform: string, value: string) => {
        setSettings({
            ...settings,
            footer: {
                ...settings.footer,
                socialLinks: { ...settings.footer.socialLinks, [platform]: value },
            },
        });
    };

    const handleStatChange = (index: number, field: "value" | "label", value: string) => {
        const updated = [...settings.statsBar];
        updated[index] = { ...updated[index], [field]: value };
        setSettings({ ...settings, statsBar: updated });
    };

    const handleSave = () => {
        setSiteSettings(settings);
        toast({ title: "Settings saved!", description: "Site settings have been updated." });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage header, footer, and site-wide settings</p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4" /> Save All Changes
                </Button>
            </div>

            {/* Header Settings */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Header Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Brand Name</label>
                        <Input value={settings.header.brandName} onChange={(e) => handleHeaderChange("brandName", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input value={settings.header.logoUrl} onChange={(e) => handleHeaderChange("logoUrl", e.target.value)} placeholder="/logo.png" />
                    </div>
                </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-500" /> Footer Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Brand Name</label>
                        <Input value={settings.footer.brandName} onChange={(e) => handleFooterChange("brandName", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Tagline</label>
                        <Input value={settings.footer.tagline} onChange={(e) => handleFooterChange("tagline", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</label>
                        <Input value={settings.footer.phone} onChange={(e) => handleFooterChange("phone", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
                        <Input value={settings.footer.email} onChange={(e) => handleFooterChange("email", e.target.value)} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</label>
                        <Input value={settings.footer.address} onChange={(e) => handleFooterChange("address", e.target.value)} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium">Newsletter Title</label>
                        <Input value={settings.footer.newsletterTitle} onChange={(e) => handleFooterChange("newsletterTitle", e.target.value)} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium">Newsletter Subtitle</label>
                        <Input value={settings.footer.newsletterSubtitle} onChange={(e) => handleFooterChange("newsletterSubtitle", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-pink-500" /> Social Media Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(settings.footer.socialLinks).map(([platform, url]) => (
                        <div key={platform} className="space-y-1.5">
                            <label className="text-sm font-medium capitalize">{platform}</label>
                            <Input value={url} onChange={(e) => handleSocialChange(platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Stats Bar</h2>
                <p className="text-sm text-muted-foreground">These stats appear on the homepage below the hero section.</p>
                <div className="space-y-3">
                    {settings.statsBar.map((stat, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3">
                            <Input
                                value={stat.value}
                                onChange={(e) => handleStatChange(index, "value", e.target.value)}
                                placeholder="10K+"
                            />
                            <Input
                                value={stat.label}
                                onChange={(e) => handleStatChange(index, "label", e.target.value)}
                                placeholder="Local Stores"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSiteSettings;
