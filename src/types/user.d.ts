export interface UserData {
  lastActive: string | number | Date; // Renamed to UserData to avoid conflict with `lucide-react`'s User icon
  id: number;
  name: string;
  email: string;
  orders: number;
  status: "Active" | "Inactive" | "Suspended"; // Using a union type for specific statuses
}
