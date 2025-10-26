import { ReactNode } from "react";

export interface DashboardStat {
  icon: ReactNode;
  label: string;
  value: string | number;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface DashboardData {
  stats: DashboardStat[];
  recentOrders?: Order[];
  recentActivities?: Activity[];
}

export interface Activity {
  id: string;
  type: "order" | "product" | "user" | "system";
  message: string;
  timestamp: Date | string;
  user?: string;
}

