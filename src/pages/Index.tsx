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
import heroBanner from "@/assets/hero-banner.jpg";

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="QuickKart - Fresh groceries delivered fast"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                🚀 Delivery in 15-30 minutes
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4">
                Fresh Groceries,
                <br />
                <span className="text-primary">Lightning Fast</span>
              </h1>
              <p className="text-lg text-secondary-foreground/80 mb-8">
                Get essentials from your favorite local stores delivered to your doorstep in minutes. Empowering local stores, delivering at speed.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for groceries, fruits, snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 text-base bg-card border-0 shadow-lg"
                />
              </div>
              <Button size="xl" className="shadow-lg">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </motion.div>

            {/* Location Hint */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 mt-4 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Delivering to <strong className="text-secondary-foreground">Bengaluru, Karnataka</strong></span>
            </motion.button>
          </div>
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

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
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
      <section className="py-12 md:py-16 bg-muted/50">
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
              How QuickKart Works
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

      {/* Download App CTA */}
      <section className="py-16 md:py-24 gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
                Get the QuickKart App
              </h2>
              <p className="text-lg text-secondary-foreground/80 mb-8">
                Download now for exclusive deals, faster checkout, and real-time order tracking
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="hero" className="min-w-[180px]">
                  App Store
                </Button>
                <Button size="xl" variant="hero" className="min-w-[180px]">
                  Play Store
                </Button>
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
