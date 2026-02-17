import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X,
    Bell, ExternalLink, ChevronRight, Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    logoutVendor, getVendorSession, getVendorNotifications,
    markAllNotificationsRead, markNotificationRead,
    VendorNotification,
} from "@/lib/store";

const navItems = [
    { label: "Dashboard", href: "/vendor", icon: LayoutDashboard },
    { label: "Products", href: "/vendor/products", icon: Package },
    { label: "Orders", href: "/vendor/orders", icon: ShoppingBag },
];

const VendorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState<VendorNotification[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const session = getVendorSession();

    // Poll notifications every 3 seconds
    useEffect(() => {
        const poll = () => {
            if (session) setNotifications(getVendorNotifications(session.storeId));
        };
        poll();
        const interval = setInterval(poll, 3000);
        return () => clearInterval(interval);
    }, [session?.storeId]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleLogout = () => {
        logoutVendor();
        navigate("/vendor/login");
    };

    const handleMarkAllRead = () => {
        if (session) {
            markAllNotificationsRead(session.storeId);
            setNotifications(getVendorNotifications(session.storeId));
        }
    };

    const handleNotifClick = (notif: VendorNotification) => {
        markNotificationRead(notif.id);
        if (session) setNotifications(getVendorNotifications(session.storeId));
        if (notif.orderId) {
            navigate("/vendor/orders");
            setShowNotifs(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:static lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-sm text-foreground">Vendor Panel</span>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{session?.storeName}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/vendor"
                                ? location.pathname === "/vendor"
                                : location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="border-t border-border p-3 space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        <ExternalLink className="w-4 h-4" /> View Store
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-30">
                    <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </Button>

                    <div className="hidden lg:block">
                        <h2 className="text-sm font-semibold text-foreground">{session?.storeName}</h2>
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="relative"
                            onClick={() => setShowNotifs(!showNotifs)}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        {showNotifs && (
                            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                    <span className="font-semibold text-sm">Notifications</span>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
                                    ) : (
                                        notifications.slice(0, 15).map((n) => (
                                            <button
                                                key={n.id}
                                                onClick={() => handleNotifClick(n)}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition",
                                                    !n.isRead && "bg-primary/5"
                                                )}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                                                    <div className={cn(!n.isRead ? "" : "ml-4")}>
                                                        <p className="text-sm font-medium">{n.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1">
                                                            {new Date(n.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
