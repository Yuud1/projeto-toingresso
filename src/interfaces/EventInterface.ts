import CustomFieldInterface from "./CustomFieldInterface";
import { Batch } from "./FormDataInterface";
import OrganizerInterface from "./OrganizerInterface";
import TicketInterface from "./TicketInterface";
import UserInterface from "./UserInterface";

export default interface EventInterface {
  _id: string;
  title: string;
  image: string;
  imageId: string;
  category: string;
  // Novo campo para múltiplos períodos
  dates: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    periodName?: string;
    attractions: { name: string; social?: string; description?: string; startTime?: string; endTime?: string }[];
    _id?: string;
  }[];      
  description: string;
  venueName: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;  
  organizer: OrganizerInterface;
  acceptedTerms: boolean;
  policy: string;
  status: "active" | "finished" | "editing";
  formTitle?: string;
  isFree: boolean;
  customFields: CustomFieldInterface[];
  ticketActivationToken: string;
  mapUrl: string;
  subscribers: {
    userId: string;
    fields: Record<string, string>;
    subscribedAt: Date;
  }[];
  participants: UserInterface[];
  certificateCount: number,
  batches: Batch[];
  // Novo campo para ingressos disponíveis no momento
  currentTickets: TicketInterface[];
}
