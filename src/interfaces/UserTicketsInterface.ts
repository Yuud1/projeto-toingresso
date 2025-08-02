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
  ticketType?: {
    name: string;
    activateAt?: string; // Data de ativação do tipo de ingresso
  };
  activatedAt?: string; // Data em que o ingresso foi ativado
}
