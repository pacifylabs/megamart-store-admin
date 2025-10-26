import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  icon,
  label,
  value,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-600",
  className = "",
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div
          className={cn(
            "p-3 rounded-lg flex-shrink-0",
            iconBgColor,
            iconColor
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
