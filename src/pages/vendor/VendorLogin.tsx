import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Store, Eye, EyeOff, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginVendor } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const VendorLogin = () => {
    const [vendorId, setVendorId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId.trim()) {
            toast({ title: "Vendor ID required", description: "Please enter your vendor ID.", variant: "destructive" });
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 400));

        const success = loginVendor(vendorId.trim().toUpperCase(), password);
        if (success) {
            toast({ title: "Welcome back!", description: "You're now logged in." });
            navigate("/vendor");
        } else {
            toast({ title: "Login failed", description: "Invalid vendor ID or password.", variant: "destructive" });
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
                            Log in with your Vendor ID to manage your store
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Vendor ID */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Vendor ID</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="e.g. QK-10001"
                                    value={vendorId}
                                    onChange={(e) => setVendorId(e.target.value.toUpperCase())}
                                    className="pl-10 font-mono tracking-wider"
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                You received this ID when you enrolled as a seller
                            </p>
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
                    </form>

                    {/* Register link */}
                    <div className="mt-8 pt-6 border-t border-border space-y-4">
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have a Vendor ID?{" "}
                            <Link to="/become-seller" className="text-primary font-medium hover:underline">
                                Register as a Seller
                            </Link>
                        </div>

                        {/* Help / Demo section */}
                        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                                Demo & Help
                            </p>
                            <div className="text-xs text-muted-foreground text-center space-y-1">
                                <p>Default: <strong className="text-foreground">QK-10001</strong> / <strong className="text-foreground">vendor123</strong></p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-[10px] h-7"
                                    onClick={() => {
                                        setVendorId("QK-10001");
                                        setPassword("vendor123");
                                    }}
                                >
                                    Auto-fill Demo
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-[10px] h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.reload();
                                    }}
                                >
                                    Reset & Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VendorLogin;
