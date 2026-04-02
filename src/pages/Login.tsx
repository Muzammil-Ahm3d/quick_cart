import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, Shield, Zap, CheckCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Email/Phone Login State
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP Login State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);

  // Validation
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string; phone?: string }>({});

  const validateEmailOrPhone = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleEmailPhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone is required";
    } else if (!validateEmailOrPhone(emailOrPhone)) {
      newErrors.emailOrPhone = "Invalid email or phone format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful!",
        description: "Welcome back to Qwiksy",
      });
      navigate("/");
    }, 1500);
  };

  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setErrors({ phone: "Phone must be 10 digits" });
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setResendCooldown(30);
      toast({
        title: "OTP Sent!",
        description: `OTP sent to ${phoneNumber}`,
      });
      
      // Start cooldown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful!",
        description: "Welcome back to Qwiksy",
      });
      navigate("/");
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendAttempts >= 3) {
      toast({
        title: "Maximum attempts reached",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }
    setResendAttempts((prev) => prev + 1);
    handleSendOtp();
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `Redirecting to ${provider}...`,
    });
  };

  const benefits = [
    { icon: Zap, title: "Fast", subtitle: "Delivery in 30 minutes" },
    { icon: CheckCircle, title: "Reliable", subtitle: "Trusted by thousands" },
    { icon: Store, title: "Local", subtitle: "Support local businesses" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <span className="text-2xl font-bold text-primary">Quick</span>
                <span className="text-2xl font-bold text-secondary">Kart</span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground mt-4">Welcome Back</h1>
              <p className="text-muted-foreground text-sm mt-1">Sign in to your Qwiksy account</p>
            </div>

            {/* Login Tabs */}
            <Tabs defaultValue="email_phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email_phone">Email/Phone</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>

              {/* Email/Phone Tab */}
              <TabsContent value="email_phone">
                <form onSubmit={handleEmailPhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="emailOrPhone"
                        type="text"
                        placeholder="Enter email or 10-digit phone"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="pl-10"
                        autoComplete="email"
                      />
                    </div>
                    {errors.emailOrPhone && (
                      <p className="text-sm text-destructive">{errors.emailOrPhone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me for 30 days
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Tab */}
              <TabsContent value="otp">
                <div className="space-y-4">
                  {!otpSent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="10-digit phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            className="pl-10"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                      </div>
                      <Button onClick={handleSendOtp} fullWidth size="lg" isLoading={isLoading}>
                        Send OTP
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <p className="text-sm text-muted-foreground">
                          We've sent a 6-digit code to {phoneNumber}
                        </p>
                        <div className="flex justify-center py-4">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                              setOtp(value);
                              if (value.length === 6) {
                                handleVerifyOtp();
                              }
                            }}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleVerifyOtp}
                        fullWidth
                        size="lg"
                        isLoading={isLoading}
                        disabled={otp.length !== 6}
                      >
                        Verify OTP
                      </Button>

                      <div className="text-center text-sm">
                        <span className="text-muted-foreground">Didn't receive OTP? </span>
                        {resendCooldown > 0 ? (
                          <span className="text-muted-foreground">Resend in {resendCooldown}s</span>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            className="text-primary hover:underline"
                            disabled={resendAttempts >= 3}
                          >
                            Resend
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="w-full text-sm text-muted-foreground hover:text-foreground"
                      >
                        Change phone number
                      </button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground mb-3">Sign in with</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                  className="h-11"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="h-11"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm mt-6">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up here
              </Link>
            </p>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-success text-sm">
              <Shield className="w-4 h-4" />
              <span>Secured with 256-bit encryption</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Benefits (Desktop Only) */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md text-primary-foreground"
        >
          <h2 className="text-3xl font-bold mb-4">Shop Local, Get Fast Delivery</h2>
          <p className="text-primary-foreground/80 mb-8">
            Join millions of happy customers who trust Qwiksy for their daily essentials.
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
                  <p className="text-sm text-primary-foreground/80">{benefit.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
