import React from 'react'; // Required for React.ReactNode type in DashboardStat

export interface Product {
  id: number; // Changed to number based on data.ts
  name: string;
  price: string; // Price is a string like "₹32,999"
  cut?: string; // Optional property
  save?: string; // Optional property
  discount?: string; // Optional property
  img?: string | React.ComponentType<any>; // Could be string path or imported image module (React.ComponentType for img source)
  image?: string; // For the essential array items
  category: string;
  description?: string; // Optional property
  stock?: number; // Optional property, number as per current usage
  alt?: string; // For the essentials array items
}

export interface HeroSlide {
  titleTop: string;
  titleMain: string;
  subtitle: string;
  img: string | React.ComponentType<any>;
  bg: string;
}

export interface Category {
  name: string;
  img: string | React.ComponentType<any>;
}

export interface BrandSlide {
  title: string;
  subtitle: string;
  img: string | React.ComponentType<any>;
  bg: string;
  color: string;
}

export interface EssentialItem {
  name: string;
  img: string | React.ComponentType<any>;
  alt: string;
}

export interface PopularCategoryItem {
  id: number;
  title: string;
}

// For DashboardStats, which was defined in src/types/dashboard.d.ts,
// I'll include it here for completeness, assuming it's related to display data.
export interface DashboardStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// For Orders, which was defined in src/types/order.d.ts
export interface Order {
  id: number;
  customer: string;
  total: string;
  status: "Delivered" | "Pending";
}

// For Users, which was defined in src/types/user.d.ts
export interface UserData {
  id: number;
  name: string;
  email: string;
  orders: number;
  status: "Active" | "Inactive";
}
