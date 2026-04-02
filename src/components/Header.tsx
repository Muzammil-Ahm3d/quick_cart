import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Home,
  Grid3X3,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  cartItemCount?: number;
  wishlistCount?: number;
}

const Header = ({ cartItemCount = 0, wishlistCount = 0 }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: Grid3X3 },
    { href: "/orders", label: "Orders", icon: Package },
    { href: "/become-seller", label: "Become a Seller", icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group mr-8 shrink-0">
              <div className="relative h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img 
                  src="/logo-icon.png" 
                  alt="Qwiksy Logo" 
                  className="h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground hidden sm:block">
                Qwik<span className="text-primary font-extrabold italic">sy</span>
              </span>
            </Link>

            {/* Location Selector - Desktop */}
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Bengaluru</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products, stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Heart className="w-5 h-5 text-muted-foreground" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>

              {/* Login Button */}
              <Link to="/login" className="hidden sm:block">
                <Button variant="default" size="sm" className="px-6 shadow-sm">
                  Login
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-muted border-0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-card z-50 shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <img src="/logo-icon.png" alt="Qwiksy" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold">Qwiksy</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Location */}
                <button className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Deliver to</p>
                    <p className="font-medium">Bengaluru, Karnataka</p>
                  </div>
                </button>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
