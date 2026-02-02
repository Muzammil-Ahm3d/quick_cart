import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Package, Search, Download, RotateCcw, Eye, MapPin, 
  Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle,
  SlidersHorizontal, ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Order, CartItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock order data
const mockOrders: Order[] = [
  {
    id: "ORD-20250201-001",
    user_id: "user1",
    items: [
      {
        id: "item1",
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
        id: "item2",
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
    ],
    subtotal: 373,
    delivery_charge: 0,
    discount_amount: 50,
    total: 323,
    status: "delivered",
    delivery_address: {
      id: "addr1",
      label: "Home",
      address: "123 Main Street, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      latitude: 12.9352,
      longitude: 77.6245,
      is_default: true,
      created_at: new Date().toISOString(),
    },
    delivery_time_estimate: 25,
    payment_method: "upi",
    created_at: "2025-02-01T10:30:00Z",
    delivered_at: "2025-02-01T11:00:00Z",
  },
  {
    id: "ORD-20250202-002",
    user_id: "user1",
    items: [
      {
        id: "item3",
        product_id: "6",
        product_name: "Surf Excel Detergent 1kg",
        product_image: "/placeholder.svg",
        quantity: 2,
        price: 199,
        total: 398,
        store_id: "store3",
        store_name: "Daily Needs Express",
        added_at: new Date().toISOString(),
        available_quantity: 30,
      },
    ],
    subtotal: 398,
    delivery_charge: 40,
    discount_amount: 0,
    total: 438,
    status: "out_for_delivery",
    delivery_address: {
      id: "addr1",
      label: "Home",
      address: "123 Main Street, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      latitude: 12.9352,
      longitude: 77.6245,
      is_default: true,
      created_at: new Date().toISOString(),
    },
    delivery_time_estimate: 15,
    payment_method: "card",
    created_at: "2025-02-02T09:00:00Z",
    delivered_at: null,
  },
  {
    id: "ORD-20250130-003",
    user_id: "user1",
    items: [
      {
        id: "item4",
        product_id: "4",
        product_name: "Britannia Good Day Cookies",
        product_image: "/placeholder.svg",
        quantity: 3,
        price: 45,
        total: 135,
        store_id: "store1",
        store_name: "Fresh Mart Kirana",
        added_at: new Date().toISOString(),
        available_quantity: 75,
      },
    ],
    subtotal: 135,
    delivery_charge: 40,
    discount_amount: 0,
    total: 175,
    status: "cancelled",
    delivery_address: {
      id: "addr1",
      label: "Home",
      address: "123 Main Street, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      latitude: 12.9352,
      longitude: 77.6245,
      is_default: true,
      created_at: new Date().toISOString(),
    },
    delivery_time_estimate: 20,
    payment_method: "cod",
    created_at: "2025-01-30T14:00:00Z",
    delivered_at: null,
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  pending: { bg: "bg-warning/20", text: "text-warning", icon: Clock, label: "Pending" },
  confirmed: { bg: "bg-secondary/20", text: "text-secondary", icon: CheckCircle, label: "Confirmed" },
  packed: { bg: "bg-secondary/20", text: "text-secondary", icon: Package, label: "Packed" },
  out_for_delivery: { bg: "bg-warning/20", text: "text-warning", icon: Truck, label: "Out for Delivery" },
  delivered: { bg: "bg-success/20", text: "text-success", icon: CheckCircle, label: "Delivered" },
  cancelled: { bg: "bg-destructive/20", text: "text-destructive", icon: XCircle, label: "Cancelled" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeTab === "active" && !["pending", "confirmed", "packed", "out_for_delivery"].includes(order.status)) {
      return false;
    }
    if (activeTab === "delivered" && order.status !== "delivered") return false;
    if (activeTab === "cancelled" && order.status !== "cancelled") return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(query);
      const matchesProduct = order.items.some(item => 
        item.product_name.toLowerCase().includes(query)
      );
      if (!matchesId && !matchesProduct) return false;
    }

    // Payment filter
    if (paymentFilter.length > 0 && !paymentFilter.includes(order.payment_method)) {
      return false;
    }

    return true;
  });

  // Get counts for tabs
  const counts = {
    all: orders.length,
    active: orders.filter(o => ["pending", "confirmed", "packed", "out_for_delivery"].includes(o.status)).length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const handleReorder = (order: Order) => {
    toast({
      title: "Items added to cart!",
      description: `${order.items.length} items from order ${order.id} added to cart`,
    });
    navigate("/cart");
  };

  const handleDownloadInvoice = (order: Order) => {
    toast({
      title: "Downloading invoice...",
      description: `Invoice for ${order.id} will be downloaded shortly`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Date Filter */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Order Date</h3>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7_days">Last 7 days</SelectItem>
            <SelectItem value="30_days">Last 30 days</SelectItem>
            <SelectItem value="3_months">Last 3 months</SelectItem>
            <SelectItem value="6_months">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Payment Method</h3>
        <div className="space-y-2">
          {["cod", "card", "upi", "wallet", "netbanking"].map(method => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={method}
                checked={paymentFilter.includes(method)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPaymentFilter([...paymentFilter, method]);
                  } else {
                    setPaymentFilter(paymentFilter.filter(m => m !== method));
                  }
                }}
              />
              <label htmlFor={method} className="text-sm capitalize cursor-pointer">
                {method === "cod" ? "Cash on Delivery" : method}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        fullWidth
        onClick={() => {
          setDateFilter("all");
          setPaymentFilter([]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  // Empty State
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={3} wishlistCount={2} />
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to place your first order
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
      <Header cartItemCount={3} wishlistCount={2} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track your orders and manage returns</p>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or product name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({counts.delivered})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({counts.cancelled})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-foreground mb-6">Filters</h2>
              <FiltersSidebar />
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)} • {formatTime(order.created_at)}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="p-4 border-b border-border">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex-shrink-0 flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-2">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium text-muted-foreground">
                            +{order.items.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-lg font-bold text-primary">₹{order.total}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {order.status === "out_for_delivery" && (
                          <Button size="sm" onClick={() => navigate(`/orders/${order.id}/track`)}>
                            <Truck className="w-4 h-4 mr-1" />
                            Track
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorder(order)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reorder
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(order)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].text}`}>
                    {statusConfig[selectedOrder.status].label}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {selectedOrder.payment_method === "cod" ? "Cash on Delivery" : selectedOrder.payment_method}
                  </p>
                </div>
              </div>

              {/* Items */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                  <h3 className="font-semibold">Items Ordered</h3>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 mt-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">{item.store_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.total}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedOrder.delivery_address.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.delivery_address.address}, {selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state} - {selectedOrder.delivery_address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Price Details</h3>
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{selectedOrder.delivery_charge === 0 ? "FREE" : `₹${selectedOrder.delivery_charge}`}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Discount</span>
                      <span className="text-success">-₹{selectedOrder.discount_amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Orders;
