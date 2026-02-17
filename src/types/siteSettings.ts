// Site Settings types for Admin Panel

export interface HeroBanner {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    highlightText: string;
    badgeText: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
}

export interface PromoBanner {
    id: string;
    imageUrl: string;
    title: string;
    ctaText: string;
    ctaLink: string;
    ctaColor: string;
    isActive: boolean;
}

export interface FooterSettings {
    brandName: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    socialLinks: {
        facebook: string;
        twitter: string;
        instagram: string;
        youtube: string;
    };
    newsletterTitle: string;
    newsletterSubtitle: string;
}

export interface HeaderSettings {
    brandName: string;
    logoUrl: string;
    navLinks: { label: string; href: string; isActive: boolean }[];
}

export interface StatItem {
    value: string;
    label: string;
}

export interface SiteSettings {
    header: HeaderSettings;
    footer: FooterSettings;
    heroBanner: HeroBanner;
    promoBanners: PromoBanner[];
    statsBar: StatItem[];
}
