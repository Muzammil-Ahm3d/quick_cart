import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Store, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStores, loginVendor } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const VendorLogin = () => {
    const stores = getStores();
    const [storeId, setStoreId] = useState(stores[0]?.id || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 400));

        const success = loginVendor(storeId, password);
        if (success) {
            toast({ title: "Welcome back!", description: "You're now logged in." });
            navigate("/vendor");
        } else {
            toast({ title: "Login failed", description: "Invalid credentials.", variant: "destructive" });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                            <Store className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Vendor Portal</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Log in to manage your store
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Store Picker */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Select Store</label>
                            <select
                                value={storeId}
                                onChange={(e) => setStoreId(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            >
                                {stores.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            Default password: <span className="font-mono bg-muted px-1.5 py-0.5 rounded">vendor123</span>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VendorLogin;
