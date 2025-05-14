export default interface TicketInterface  {
  _id: string,
  name:  string,
  price: number,
  description: string,
  quantity: number,
  type: string, enum: ["regular", "student"],
};
