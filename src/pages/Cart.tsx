import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, Tag, Shield, Truck, RotateCcw, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: "cart1",
    product_id: "1",
    product_name: "Fresh Organic Bananas",
    product_image: "/placeholder.svg",
    quantity: 2,
    price: 49,
    total: 98,
    store_id: "store2",
    store_name: "Green Valley Organics",
    added_at: new Date().toISOString(),
    available_quantity: 50,
  },
  {
    id: "cart2",
    product_id: "2",
    product_name: "Amul Butter 500g",
    product_image: "/placeholder.svg",
    quantity: 1,
    price: 275,
    total: 275,
    store_id: "store1",
    store_name: "Fresh Mart Kirana",
    added_at: new Date().toISOString(),
    available_quantity: 25,
  },
  {
    id: "cart3",
    product_id: "6",
    product_name: "Surf Excel Detergent 1kg",
    product_image: "/placeholder.svg",
    quantity: 1,
    price: 199,
    total: 199,
    store_id: "store3",
    store_name: "Daily Needs Express",
    added_at: new Date().toISOString(),
    available_quantity: 30,
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + deliveryCharge - discount;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const removeItem = (item: CartItem) => {
    setCartItems((items) => items.filter((i) => i.id !== item.id));
    setItemToRemove(null);
    toast({
      title: "Item removed",
      description: `${item.product_name} removed from cart`,
    });
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsApplyingCoupon(false);
      
      if (couponCode.toUpperCase() === "QUICK20") {
        const discountAmount = Math.round(subtotal * 0.2);
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: discountAmount });
        setCouponCode("");
        toast({
          title: "Coupon applied!",
          description: `You saved ₹${discountAmount}`,
        });
      } else if (couponCode.toUpperCase() === "FLAT50") {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 50 });
        setCouponCode("");
        toast({
          title: "Coupon applied!",
          description: "You saved ₹50",
        });
      } else {
        toast({
          title: "Invalid coupon",
          description: "This coupon code is not valid",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon removed",
      description: "Discount has been removed",
    });
  };

  const handleCheckout = () => {
    // In a real app, check authentication first
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} wishlistCount={2} />
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add items from stores near you to get started
            </p>
            <Button size="lg" onClick={() => navigate("/")}>
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
      <Header cartItemCount={cartItems.length} wishlistCount={2} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">You have {cartItems.length} items</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="bg-card rounded-lg border border-border p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.store_name}
                      </p>
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                        {item.product_name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => setItemToRemove(item)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.id, Math.min(item.available_quantity, item.quantity + 1))}
                          disabled={item.quantity >= item.available_quantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Total: ₹{item.total}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>

              {/* Summary Rows */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Delivery
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Free delivery on orders above ₹500</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className={`font-medium ${deliveryCharge === 0 ? 'text-success' : ''}`}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Discount</span>
                    <span className="text-success font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Promo Code</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">
                        {appliedCoupon.code} applied - ₹{appliedCoupon.discount} off
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="pl-10"
                        maxLength={20}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      isLoading={isApplyingCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Try: QUICK20 or FLAT50
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                fullWidth
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                fullWidth
                className="mt-3"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <Shield className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Secure Checkout</p>
                </div>
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Dialog */}
      <AlertDialog open={!!itemToRemove} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.product_name}" from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToRemove && removeItem(itemToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Cart;
