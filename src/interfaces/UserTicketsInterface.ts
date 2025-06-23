import EventInterface from "./EventInterface";
import UserInterface from "./UserInterface";

export default interface UserTicketsInterface {
  _id: string;
  Event: EventInterface;
  eventTitle: string;
  subscribedAt: string;
  Owner: UserInterface;
  qrCode: string;
  used: boolean;
  status: "ativo" | "encerrado";
}
