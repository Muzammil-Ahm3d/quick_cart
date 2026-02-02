import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, X, Star, ShoppingCart, Eye, SlidersHorizontal, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { mockProducts } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get wishlist items from mock data
  const [wishlistItems, setWishlistItems] = useState<Product[]>(
    mockProducts.filter(p => p.is_wishlist)
  );
  
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [distanceRange, setDistanceRange] = useState([0, 50]);
  const [itemToRemove, setItemToRemove] = useState<Product | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // Get unique categories from wishlist
  const categories = [...new Set(wishlistItems.map(p => p.category_name))];

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter(item => {
      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category_name)) {
        return false;
      }
      if (selectedRating && item.rating < selectedRating) return false;
      if (item.store_distance_km < distanceRange[0] || item.store_distance_km > distanceRange[1]) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "store_name":
          return a.store_name.localeCompare(b.store_name);
        default:
          return 0;
      }
    });

  const removeFromWishlist = (item: Product) => {
    setWishlistItems(items => items.filter(i => i.id !== item.id));
    setItemToRemove(null);
    toast({
      title: "Removed from wishlist",
      description: `${item.name} has been removed`,
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setShowClearAllDialog(false);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed",
    });
  };

  const addToCart = (item: Product) => {
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart`,
    });
  };

  const addAllToCart = () => {
    toast({
      title: "All items added to cart!",
      description: `${wishlistItems.length} items have been added to your cart`,
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedRating(null);
    setDistanceRange([0, 50]);
  };

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={50}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-medium text-foreground mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                />
                <label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRating === rating}
                onCheckedChange={(checked) => setSelectedRating(checked ? rating : null)}
              />
              <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                {rating}★+
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Distance</h3>
        <Slider
          value={distanceRange}
          onValueChange={setDistanceRange}
          min={0}
          max={50}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{distanceRange[0]} km</span>
          <span>{distanceRange[1]} km</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <Button fullWidth onClick={clearFilters} variant="outline">
          Clear All
        </Button>
      </div>
    </div>
  );

  // Empty State
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={3} wishlistCount={0} />
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save products to view them later
            </p>
            <Button size="lg" onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Header cartItemCount={3} wishlistCount={wishlistItems.length} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Wishlist</h1>
              <p className="text-muted-foreground">
                Your saved items ({wishlistItems.length} items)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="price_low">Lowest Price</SelectItem>
                <SelectItem value="price_high">Highest Price</SelectItem>
                <SelectItem value="store_name">Store Name</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowClearAllDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Wishlist
          </Button>
          <Button
            size="sm"
            onClick={addAllToCart}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add All to Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-foreground mb-6">Filters</h2>
              <FiltersSidebar />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card rounded-lg border border-border overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-muted">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Remove Button */}
                      <button
                        onClick={() => setItemToRemove(item)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 hover:bg-destructive hover:text-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Discount Badge */}
                      {item.discount_percentage && (
                        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                          {item.discount_percentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.store_name} • {item.store_distance_km}km
                      </p>
                      <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2">
                        {item.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">₹{item.price}</span>
                        {item.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.original_price}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span>{item.rating}</span>
                        <span>({item.review_count} reviews)</span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          fullWidth
                          size="sm"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          fullWidth
                          size="sm"
                          onClick={() => navigate(`/products/${item.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items match your filters</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Item Dialog */}
      <AlertDialog open={!!itemToRemove} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.name}" from your wishlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToRemove && removeFromWishlist(itemToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {wishlistItems.length} items from your wishlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearWishlist}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Wishlist;
