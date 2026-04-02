import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Store, User, Mail, Phone, FileText, MapPin, Clock, Building,
  CreditCard, Shield, Zap, TrendingUp, Users, Check, ChevronRight,
  Upload, X, AlertCircle, Copy, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { registerVendor } from "@/lib/store";

// Category data
const categories = [
  { id: "groceries", name: "Groceries & Kirana", icon: "🛒", description: "Fresh vegetables, fruits, staples" },
  { id: "electronics", name: "Electronics & Gadgets", icon: "💻", description: "Mobile phones, laptops, accessories" },
  { id: "pharmacy", name: "Pharmacy", icon: "💊", description: "Medicines, health supplements" },
  { id: "beauty", name: "Beauty & Personal Care", icon: "✨", description: "Cosmetics, skincare, haircare" },
  { id: "clothing", name: "Clothing & Fashion", icon: "👕", description: "Apparel, footwear, accessories" },
  { id: "home", name: "Home & Kitchen", icon: "🏠", description: "Furniture, cookware, decor" },
  { id: "books", name: "Books & Stationery", icon: "📚", description: "Books, notebooks, office supplies" },
  { id: "sports", name: "Sports & Fitness", icon: "🏃", description: "Sports equipment, fitness gear" },
  { id: "toys", name: "Toys & Games", icon: "🎮", description: "Toys, games, educational items" },
  { id: "pet_supplies", name: "Pet Supplies", icon: "🐕", description: "Pet food, toys, care products" },
];

const steps = ["Business Details", "Category Selection", "Location & KYC", "Bank Details"];

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedVendorId, setGeneratedVendorId] = useState("");
  const [vendorPassword, setVendorPassword] = useState("");

  // Step 1: Business Details
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  // Step 2: Category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryDesc, setCustomCategoryDesc] = useState("");

  // Step 3: Location & KYC
  const [storeAddress, setStoreAddress] = useState("");
  const [storeArea, setStoreArea] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storePincode, setStorePincode] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("21:00");
  const [deliveryRadius, setDeliveryRadius] = useState([5]);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [bankProof, setBankProof] = useState<File | null>(null);
  const [storeCertificate, setStoreCertificate] = useState<File | null>(null);

  // Step 4: Bank Details
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!storeName || storeName.length < 3) newErrors.storeName = "Store name must be at least 3 characters";
      if (!ownerName || ownerName.length < 2) newErrors.ownerName = "Owner name must be at least 2 characters";
      if (!storeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeEmail)) newErrors.storeEmail = "Invalid email format";
      if (!storePhone || !/^[0-9]{10}$/.test(storePhone)) newErrors.storePhone = "Phone must be 10 digits";
      if (!storeDescription || storeDescription.length < 20) newErrors.storeDescription = "Description must be at least 20 characters";
    }

    if (step === 2) {
      if (!selectedCategory && !useCustomCategory) {
        newErrors.category = "Please select a category";
      }
      if (useCustomCategory) {
        if (!customCategoryName) newErrors.customCategoryName = "Category name is required";
        if (!customCategoryDesc) newErrors.customCategoryDesc = "Category description is required";
      }
    }

    if (step === 3) {
      if (!storeAddress) newErrors.storeAddress = "Store address is required";
      if (!storeCity) newErrors.storeCity = "City is required";
      if (!storePincode || !/^[0-9]{6}$/.test(storePincode)) newErrors.storePincode = "Pincode must be 6 digits";
      if (!panCard) newErrors.panCard = "PAN Card is required";
      if (!aadharCard) newErrors.aadharCard = "Aadhar Card is required";
      if (!bankProof) newErrors.bankProof = "Bank account proof is required";
    }

    if (step === 4) {
      if (!accountHolderName || accountHolderName.length < 3) newErrors.accountHolderName = "Account holder name is required";
      if (!accountNumber) newErrors.accountNumber = "Account number is required";
      if (!ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) newErrors.ifscCode = "Invalid IFSC code format";
      if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleIfscChange = (value: string) => {
    const formatted = value.toUpperCase().slice(0, 11);
    setIfscCode(formatted);

    // Auto-fill bank details (mock)
    if (formatted.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formatted)) {
      setBankName("HDFC Bank");
      setBranchName("Koramangala Branch");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    if (!vendorPassword || vendorPassword.length < 6) {
      setErrors({ ...errors, vendorPassword: "Password must be at least 6 characters" });
      return;
    }

    setIsSubmitting(true);

    // Register the vendor in localStorage
    setTimeout(() => {
      const categoryName = useCustomCategory
        ? customCategoryName
        : categories.find((c) => c.id === selectedCategory)?.name || "General";

      const result = registerVendor({
        name: storeName,
        category: categoryName,
        description: storeDescription,
        ownerName: ownerName,
        email: storeEmail,
        phone: storePhone,
        password: vendorPassword,
      });

      setGeneratedVendorId(result.vendorId);
      setIsSubmitting(false);
      setCurrentStep(5); // Go to success screen
    }, 2000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      setter(file);
    }
  };

  const benefits = [
    { icon: Zap, title: "Fast Growth", description: "Reach customers in your area instantly" },
    { icon: Shield, title: "Secure Payments", description: "Get payments directly to your bank account" },
    { icon: TrendingUp, title: "Analytics", description: "Track sales, inventory, and feedback" },
    { icon: Users, title: "Support", description: "24/7 seller support team available" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form */}
      <div className="flex-1 bg-background py-8 px-4 md:px-8 lg:px-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-2xl font-bold text-primary">Quick</span>
            <span className="text-2xl font-bold text-secondary">Kart</span>
            <span className="text-sm text-muted-foreground ml-2">for Sellers</span>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > index + 1 ? "bg-success text-white" :
                      currentStep === index + 1 ? "bg-primary text-white" :
                        "bg-muted text-muted-foreground"
                  )}>
                    {currentStep > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "hidden sm:block w-12 lg:w-24 h-0.5 mx-2",
                      currentStep > index + 1 ? "bg-success" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="hidden sm:flex justify-between mt-2">
              {steps.map((step, index) => (
                <span key={step} className={cn(
                  "text-xs",
                  currentStep === index + 1 ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Business Details</h2>
                  <p className="text-muted-foreground text-sm">Tell us about your store</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="storeName"
                        placeholder="Enter your store name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="pl-10"
                        maxLength={50}
                      />
                    </div>
                    {errors.storeName && <p className="text-sm text-destructive">{errors.storeName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="ownerName"
                        placeholder="Enter your full name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="pl-10"
                        maxLength={60}
                      />
                    </div>
                    {errors.ownerName && <p className="text-sm text-destructive">{errors.ownerName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="storeEmail"
                        type="email"
                        placeholder="Enter store email"
                        value={storeEmail}
                        onChange={(e) => setStoreEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.storeEmail && <p className="text-sm text-destructive">{errors.storeEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Store Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="storePhone"
                        type="tel"
                        placeholder="10-digit phone number"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="pl-10"
                      />
                    </div>
                    {errors.storePhone && <p className="text-sm text-destructive">{errors.storePhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description *</Label>
                    <Textarea
                      id="storeDescription"
                      placeholder="Describe your store (what you sell, specialty, etc.)"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {errors.storeDescription && <span className="text-destructive">{errors.storeDescription}</span>}
                      <span className="ml-auto">{storeDescription.length}/500</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" fullWidth onClick={() => toast({ title: "Draft saved!" })}>
                    Save Draft
                  </Button>
                  <Button fullWidth onClick={handleNext}>
                    Continue to Category
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Category Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Select Category</h2>
                  <p className="text-muted-foreground text-sm">What type of store are you?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setUseCustomCategory(false);
                      }}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:border-primary hover:shadow-md",
                        selectedCategory === category.id
                          ? "border-primary bg-primary-light"
                          : "border-border"
                      )}
                    >
                      <span className="text-2xl mb-2 block">{category.icon}</span>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      {selectedCategory === category.id && (
                        <Check className="w-4 h-4 text-primary mt-2" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Category */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      setUseCustomCategory(true);
                      setSelectedCategory(null);
                    }}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 text-left transition-all",
                      useCustomCategory ? "border-primary bg-primary-light" : "border-dashed border-border"
                    )}
                  >
                    <p className="font-medium">Don't see your category?</p>
                    <p className="text-sm text-muted-foreground">Create a custom category</p>
                  </button>

                  {useCustomCategory && (
                    <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label>Category Name *</Label>
                        <Input
                          placeholder="e.g., Bakery, Jewelry, etc."
                          value={customCategoryName}
                          onChange={(e) => setCustomCategoryName(e.target.value)}
                          maxLength={50}
                        />
                        {errors.customCategoryName && <p className="text-sm text-destructive">{errors.customCategoryName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          placeholder="What products do you sell?"
                          value={customCategoryDesc}
                          onChange={(e) => setCustomCategoryDesc(e.target.value)}
                          rows={3}
                          maxLength={200}
                        />
                        {errors.customCategoryDesc && <p className="text-sm text-destructive">{errors.customCategoryDesc}</p>}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Custom categories are reviewed within 24 hours
                      </p>
                    </div>
                  )}
                </div>

                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button fullWidth onClick={handleNext}>
                    Continue to Verification
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location & KYC */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Location & KYC Verification</h2>
                  <p className="text-muted-foreground text-sm">Help customers find you and verify your business</p>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Store Location
                  </h3>

                  <div className="space-y-2">
                    <Label>Store Address *</Label>
                    <Input
                      placeholder="Street address"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                    />
                    {errors.storeAddress && <p className="text-sm text-destructive">{errors.storeAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Area/Locality</Label>
                      <Input
                        placeholder="e.g., Koramangala"
                        value={storeArea}
                        onChange={(e) => setStoreArea(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input
                        placeholder="City name"
                        value={storeCity}
                        onChange={(e) => setStoreCity(e.target.value)}
                      />
                      {errors.storeCity && <p className="text-sm text-destructive">{errors.storeCity}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pincode *</Label>
                    <Input
                      placeholder="6-digit pincode"
                      value={storePincode}
                      onChange={(e) => setStorePincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    {errors.storePincode && <p className="text-sm text-destructive">{errors.storePincode}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Opening Time *</Label>
                      <Input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Closing Time *</Label>
                      <Input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Radius: {deliveryRadius[0]} km</Label>
                    <Slider
                      value={deliveryRadius}
                      onValueChange={setDeliveryRadius}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                </div>

                {/* KYC Section */}
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      KYC Verification
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-success">
                      <Shield className="w-4 h-4" />
                      Your documents are secured with 256-bit encryption
                    </div>
                  </div>

                  {/* File Uploads */}
                  {[
                    { label: "PAN Card *", file: panCard, setFile: setPanCard, error: errors.panCard, hint: "Upload PAN card image" },
                    { label: "Aadhar Card *", file: aadharCard, setFile: setAadharCard, error: errors.aadharCard, hint: "Upload Aadhar card (both sides)" },
                    { label: "Bank Account Proof *", file: bankProof, setFile: setBankProof, error: errors.bankProof, hint: "Bank statement or cancelled check" },
                    { label: "Store Registration (Optional)", file: storeCertificate, setFile: setStoreCertificate, hint: "GST certificate if available" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <Label>{item.label}</Label>
                      <div className={cn(
                        "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
                        item.file ? "border-success bg-success/5" : "border-border hover:border-primary"
                      )}>
                        {item.file ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{item.file.name}</span>
                            <button onClick={() => item.setFile(null)} className="text-muted-foreground hover:text-destructive">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">{item.hint}</p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, item.setFile)}
                            />
                          </label>
                        )}
                      </div>
                      {item.error && <p className="text-sm text-destructive">{item.error}</p>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button fullWidth onClick={handleNext}>
                    Continue to Bank Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Bank Details */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Bank Details & Commission</h2>
                  <p className="text-muted-foreground text-sm">Where we'll send your earnings</p>
                </div>

                {/* Bank Account Section */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Bank Account Information
                  </h3>

                  <div className="space-y-2">
                    <Label>Account Holder Name *</Label>
                    <Input
                      placeholder="As per bank records"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                    />
                    {errors.accountHolderName && <p className="text-sm text-destructive">{errors.accountHolderName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Account Number *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>IFSC Code *</Label>
                    <Input
                      placeholder="e.g., HDFC0000001"
                      value={ifscCode}
                      onChange={(e) => handleIfscChange(e.target.value)}
                      maxLength={11}
                    />
                    {errors.ifscCode && <p className="text-sm text-destructive">{errors.ifscCode}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input
                        placeholder="Auto-fills from IFSC"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        disabled={!ifscCode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch Name</Label>
                      <Input
                        placeholder="Auto-fills from IFSC"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        disabled={!ifscCode}
                      />
                    </div>
                  </div>
                </div>

                {/* Commission Section */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium">How Commissions Work</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5" />
                      You prepay wallet balance to Qwiksy
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5" />
                      Commission auto-deducted on each sale
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5" />
                      Earnings transferred within 24-48 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5" />
                      Typical commission: 8-12% (varies by category)
                    </li>
                  </ul>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-card rounded-lg">
                      <p className="text-sm text-muted-foreground">Your Commission Rate</p>
                      <p className="text-xl font-bold text-primary">10%</p>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <p className="text-sm text-muted-foreground">Min Wallet Balance</p>
                      <p className="text-xl font-bold">₹5,000</p>
                    </div>
                  </div>
                </div>

                {/* Create Password */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Set Your Login Password
                  </h3>
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={vendorPassword}
                      onChange={(e) => setVendorPassword(e.target.value)}
                    />
                    {errors.vendorPassword && <p className="text-sm text-destructive">{errors.vendorPassword}</p>}
                    <p className="text-xs text-muted-foreground">This will be your password to log in to the Vendor Portal</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to Qwiksy's{" "}
                    <a href="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/commission-policy" className="text-primary hover:underline">
                      Commission Policy
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms}</p>}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button fullWidth size="lg" onClick={handleSubmit} isLoading={isSubmitting}>
                    Complete Registration
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success - Show Vendor ID */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <PartyPopper className="w-8 h-8 text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">Registration Successful!</h2>
                  <p className="text-muted-foreground mt-2">Your store has been registered on Qwiksy</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <p className="text-sm font-medium text-foreground">Your Vendor ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold font-mono text-primary tracking-widest">
                      {generatedVendorId}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedVendorId);
                        toast({ title: "Copied!", description: "Vendor ID copied to clipboard" });
                      }}
                      className="p-2 rounded-lg hover:bg-muted transition"
                    >
                      <Copy className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 font-medium">⚠️ Save this Vendor ID!</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      You'll need this ID to log in to the Vendor Portal. Keep it safe.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Link to="/vendor/login">
                    <Button size="lg">
                      Go to Vendor Login
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Benefits (Desktop Only) */}
      <div className="hidden lg:flex w-[40%] gradient-primary items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md text-primary-foreground"
        >
          <h2 className="text-3xl font-bold mb-4">Why Become a Qwiksy Seller?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Join thousands of local sellers who are growing their business with Qwiksy.
          </p>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-primary-foreground/80">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeSeller;
