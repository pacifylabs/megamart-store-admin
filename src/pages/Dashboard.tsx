import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { usePageTitle } from "../context/PageTitleContext";
interface DashboardStat {
  icon: React.ReactNode;
  label: string;
  value: string;  // Ensured value is always a string
  iconBgColor: string;
  iconColor: string;
  onClick: () => void;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Dashboard Overview');
  }, [setPageTitle]);

  // Memoize stats to prevent unnecessary recalculations
  const stats: DashboardStat[] = useMemo(
    () => [
      {
        icon: <Package className="w-5 h-5" />,
        label: "Products",
        value: "120",
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        onClick: () => navigate(`/products`),
      },
      {
        icon: <ShoppingCart className="w-5 h-5" />,
        label: "Orders",
        value: "320",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600",
        onClick: () => navigate(`/orders`),
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: "Customers",
        value: "250",
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        onClick: () => navigate(`/users`),
      },
      {
        icon: <DollarSign className="w-5 h-5" />,
        label: "Revenue",
        value: "$10,100",
        iconBgColor: "bg-amber-100",
        iconColor: "text-amber-600",
        onClick: () => navigate(`/finance`),
      },
    ],
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1> */}
          <p className="text-gray-600">
            Welcome back! Here's what's happening with MegaMart today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={`${stat.label}-${index}`}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              iconBgColor={stat.iconBgColor}
              iconColor={stat.iconColor}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Additional Dashboard Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-500 text-sm">
              Activity feed will be displayed here
            </p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/products')}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 font-medium"
              >
                Add New Product
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200 font-medium"
              >
                View Orders
              </button>
              <button 
                onClick={() => navigate('/users')}
                className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors duration-200 font-medium"
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}