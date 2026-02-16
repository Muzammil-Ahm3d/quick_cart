import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Star, Clock, MapPin, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist, onClick }: ProductCardProps) => {
  const [isWishlist, setIsWishlist] = useState(product.is_wishlist);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    // Simulate add to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      setJustAdded(true);
      onAddToCart?.(product);

      setTimeout(() => setJustAdded(false), 2000);
    }, 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlist(!isWishlist);
    onToggleWishlist?.(product);
  };

  const isOutOfStock = product.status === "out_of_stock" || product.quantity_available === 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-border cursor-pointer"
      onClick={() => onClick?.(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discount_percentage && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold">
            {product.discount_percentage}% OFF
          </Badge>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-sm transition-colors",
            isWishlist ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          )}
        >
          <Heart className={cn("w-4 h-4", isWishlist && "fill-current")} />
        </motion.button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Store Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium truncate">{product.store_name}</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{product.store_distance_km} km</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground leading-tight">
          {product.name}
        </h3>

        {/* Rating & Delivery */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-warning-foreground">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="font-medium text-card-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.review_count})</span>
          </div>
          <div className="flex items-center gap-1 text-success">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{product.delivery_time_minutes} min</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="bg-primary px-2 py-0.5 rounded-md">
            <span className="text-sm font-bold text-primary-foreground">₹{product.price}</span>
          </div>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{product.original_price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant={justAdded ? "success" : "cta"}
          size="sm"
          fullWidth
          disabled={isOutOfStock || isAddingToCart}
          isLoading={isAddingToCart}
          onClick={handleAddToCart}
          className="mt-2"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
