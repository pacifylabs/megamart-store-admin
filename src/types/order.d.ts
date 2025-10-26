export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: Date | string;
}