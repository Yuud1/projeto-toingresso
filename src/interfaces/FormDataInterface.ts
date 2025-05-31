import CustomFieldInterface from "./CustomFieldInterface";
import TicketType from "./TicketTypeInterface";

export default interface FormDataInterface {
  title: string;
  image: File | null;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  policy: string;
  venueName: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  tickets: TicketType[];
  status: "active" | "finished" | "editing";
  isFree: boolean;
  acceptedTerms: boolean;
  token: string | null;
  formTitle: string;
  customFields: CustomFieldInterface[];
}
