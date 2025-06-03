export default interface TicketInterface  {
  _id: string,
  name:  string,
  price: number,
  description: string,
  quantity: number,
  soldQuantity: number,
  type: "regular" | "student" | "senior" | "free";
};
