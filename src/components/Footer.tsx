import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    categories: [
      { label: "Groceries", href: "/products?category=groceries" },
      { label: "Fruits & Vegetables", href: "/products?category=fruits" },
      { label: "Dairy & Eggs", href: "/products?category=dairy" },
      { label: "Bakery", href: "/products?category=bakery" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Center", href: "/safety" },
      { label: "Community Guidelines", href: "/guidelines" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    partner: [
      { label: "Become a Partner", href: "/partner" },
      { label: "Partner Portal", href: "/partner-portal" },
      { label: "Delivery Partner", href: "/delivery-partner" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Subscribe to our newsletter</h3>
              <p className="text-sm text-white/70">
                Get updates on exclusive deals and new arrivals
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-white/30"
              />
              <Button variant="default" className="shrink-0 bg-white text-primary hover:bg-neutral-100 font-bold border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative h-28 md:h-32 flex items-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/logo-full.jpeg" 
                  alt="Qwiksy Full Logo" 
                  className="h-full object-contain rounded-2xl shadow-2xl border-2 border-white/20"
                />
              </div>
            </Link>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Empowering Local Stores. <br />
              Delivering at Speed.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@qwiksy.in</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Bengaluru, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Partner</h4>
            <ul className="space-y-3">
              {footerLinks.partner.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/40 font-medium">
              © {currentYear} Qwiksy. Empowering Local Commerce.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* App Download Buttons - Small version */}
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0 h-9 px-4 font-bold text-xs ring-1 ring-white/20">
                App Store
              </Button>
              <Button size="sm" className="bg-white/10 text-white hover:bg-white/20 border-0 h-9 px-4 font-bold text-xs ring-1 ring-white/20">
                Play Store
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
