import UserInterface from "./UserInterface";

export default interface ArrivalInterface {
  userId?: string;
  fields: Record<string, string>;
  subscribedAt: string;
  arrivalTime: string;
  user?: UserInterface  
}
