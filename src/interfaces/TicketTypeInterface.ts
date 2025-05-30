export default interface TicketType {
  name: string;
  price: number;
  quantity: number;
  description: string;
  type: "regular" | "student" | "senior" | "free";
}
