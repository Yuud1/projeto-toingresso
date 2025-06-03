import CustomFieldInterface from "./CustomFieldInterface";
import OrganizerInterface from "./OrganizerInterface";
import TicketInterface from "./TicketInterface";

export default interface EventInterface {
  _id: string;
  title: string;
  image: string;
  imageId: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  venueName: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  tickets: TicketInterface[];
  organizer: OrganizerInterface;
  acceptedTerms: boolean;
  policy: string;
  status: "active" | "finished" | "editing";
  formTitle?: string;
  isFree: boolean;
  customFields: CustomFieldInterface[];
  ticketActivationToken: string
}
