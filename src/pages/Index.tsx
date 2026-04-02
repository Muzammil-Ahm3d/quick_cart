import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, Truck, Store, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { mockCategories, getFeaturedProducts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import heroMain from "@/assets/hero-main.png";
import promoPharmacy from "@/assets/promo-pharmacy.png";
import promoPetCare from "@/assets/promo-pet-care.png";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const featuredProducts = getFeaturedProducts();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  const howItWorks = [
    {
      icon: MapPin,
      title: "Set Your Location",
      description: "Share your location to find nearby stores with lightning-fast delivery",
    },
    {
      icon: Store,
      title: "Browse Local Stores",
      description: "Explore products from trusted neighborhood stores at the best prices",
    },
    {
      icon: Truck,
      title: "Quick Delivery",
      description: "Get your essentials delivered to your doorstep in minutes",
    },
  ];

  const stats = [
    { value: "10K+", label: "Local Stores" },
    { value: "1M+", label: "Happy Customers" },
    { value: "15 min", label: "Avg Delivery" },
    { value: "50+", label: "Cities" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={3} wishlistCount={2} />

      {/* Hero Section */}
      {/* Hero Section - Redesigned */}
      <section className="container mx-auto px-4 py-6 space-y-4 md:space-y-6 mt-4">
        {/* Top Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm aspect-[24/10] md:aspect-[3/1] group"
        >
          <img
            src={heroMain}
            alt="Fresh Groceries"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
            <div className="max-w-xl space-y-2 md:space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-primary text-xs md:text-sm font-bold shadow-sm backdrop-blur-sm">
                🚀 Delivery in 8 minutes
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-sm">
                Farm Fresh <br />
                <span className="text-lime-300">Daily Essentials</span>
              </h1>
              <p className="text-white/90 text-sm md:text-lg font-medium max-w-md hidden md:block">
                Get fresh vegetables, fruits, and dairy delivered directly from local farmers to your table.
              </p>

              <div className="pt-2">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold border-0 shadow-lg">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Promo Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Pharmacy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-sm aspect-[2/1] group cursor-pointer"
          >
            <img
              src={promoPharmacy}
              alt="Pharmacy at your doorstep"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
              <Button className="bg-white/90 text-teal-700 hover:bg-white font-bold backdrop-blur-sm">
                Order Medicines
              </Button>
            </div>
          </motion.div>

          {/* Pet Care Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-sm aspect-[2/1] group cursor-pointer"
          >
            <img
              src={promoPetCare}
              alt="Pet Care Supplies"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
              <Button className="bg-white/90 text-orange-600 hover:bg-white font-bold backdrop-blur-sm">
                Shop Pet Supplies
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Search Bar - Moved below banner for better UX in this layout, or keep nicely integrated? 
            The previous design had search *inside* hero. 
            Let's put a nice search bar section just below the banners, or maybe floating on the main banner?
            The user wants "two three images one on the top... below to it two more rectangle cards".
            So let's keep the visuals clean. I'll put the Search Bar in a clean section below the promos or above?
            Common pattern is Header Search. The user entered search in the previous hero.
            Let's add a sleek Search section between Banner and Promos.
        */}
        <div className="relative z-10 -mt-6 mx-4 md:mx-auto max-w-2xl hidden hidden"> {/* Hiding for now to stick to visual request, can re-enable */}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Categories Section */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-gradient-to-b from-white to-primary/5">
        {/* Decorative background illustrations */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Fruits & Beverages Illustrations */}
          <div className="absolute top-1/4 left-10 opacity-10 rotate-12">
            <svg className="w-16 h-16 text-cta" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 Q70 20 80 50 Q75 80 50 80 Q25 80 20 50 Q30 20 50 20" />
              <path d="M50 10 L50 25" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
          
          <div className="absolute top-1/3 right-12 opacity-10 -rotate-12 translate-y-12">
            <svg className="w-20 h-20 text-primary" viewBox="0 0 100 100" fill="currentColor">
              <rect x="30" y="25" width="40" height="60" rx="8" />
              <path d="M45 15 L55 15 L60 25 L40 25 Z" opacity="0.8" />
              <circle cx="50" cy="55" r="10" fill="white" opacity="0.3" />
            </svg>
          </div>

          <div className="absolute bottom-1/4 left-1/4 opacity-[0.08] rotate-45">
            <svg className="w-14 h-14 text-green-500" viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 70 Q40 10 70 70 Z" />
              <path d="M45 40 Q55 30 65 40" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>

          <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.05]">
            <div className="flex gap-12">
              <div className="w-12 h-12 rounded-full border-4 border-cta" />
              <div className="w-12 h-12 rounded-lg border-4 border-primary rotate-45" />
            </div>
          </div>

          {/* Dots Pattern */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Browse products by category</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="text-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {mockCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 md:py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked items just for you</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="text-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              How Qwiksy Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your essentials delivered in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="w-8 h-8 mx-auto -mt-6 mb-2 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Get delivery in 15-30 minutes" },
              { icon: ShieldCheck, title: "Quality Assured", desc: "Fresh products guaranteed" },
              { icon: Store, title: "Local Stores", desc: "Support neighborhood businesses" },
              { icon: Clock, title: "24/7 Support", desc: "We're here to help anytime" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App CTA - Ultra Compact Version */}
      <section className="py-3 md:py-6 bg-primary relative overflow-hidden">
        {/* Background Decorative Elements (Ref: Image 4 style) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] border-[40px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16">
            {/* Text Content - Naukri Style (Ref: Image 2) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center lg:text-left space-y-3"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                Exclusive Mobile Access
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Get the <span className="underline decoration-white/30 underline-offset-8">Qwiksy App</span>
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
                Experience the magic of lightning-fast local delivery. 
                Get real-time alerts, one-tap ordering, and exclusive deals.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                {/* App Store Button - Naukri Style */}
                <Button size="xl" className="bg-white text-primary hover:bg-neutral-100 flex items-center gap-3 px-8 h-16 shadow-2xl transition-transform active:scale-95 group">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                    A
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-primary/60 leading-none mb-1">Download on the</p>
                    <p className="text-lg font-extrabold text-primary leading-none">App Store</p>
                  </div>
                </Button>

                {/* Google Play Button - Naukri Style */}
                <Button size="xl" className="bg-white text-primary hover:bg-neutral-100 flex items-center gap-3 px-8 h-16 shadow-2xl transition-transform active:scale-95 group">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                    G
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-primary/60 leading-none mb-1">Get it on</p>
                    <p className="text-lg font-extrabold text-primary leading-none">Google Play</p>
                  </div>
                </Button>
              </div>
            </motion.div>

            {/* 3D Animated Mobile Mockup - Resized to be smaller */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: -15 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="flex-1 w-full max-w-[210px] perspective-1000 hidden md:block lg:translate-x-12"
            >
              <div className="relative aspect-[9/18.5] bg-neutral-900 rounded-[2.5rem] p-2 dark shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-neutral-800 transform-gpu transition-all hover:rotate-y-0 duration-500">
                {/* Device hardware details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-6 bg-neutral-900 rounded-b-xl z-20" />
                
                {/* Screen Content */}
                <div className="w-full h-full bg-[#111827] rounded-[2.2rem] overflow-hidden relative flex flex-col pt-10 px-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <img src="/logo-icon.png" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="font-bold text-white/60 text-sm">Qwiksy</span>
                  </div>
                  
                  {/* Mock UI Elements */}
                  <div className="space-y-4">
                    <div className="w-full h-12 rounded-xl bg-white/5 animate-pulse" />
                    <div className="w-full h-24 rounded-2xl bg-white/5" />
                    <div className="w-full h-24 rounded-2xl bg-white/5" />
                    <div className="w-full h-24 rounded-2xl bg-white/5" />
                  </div>
                  
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
