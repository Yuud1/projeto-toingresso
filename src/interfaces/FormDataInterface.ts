import CustomFieldInterface from "./CustomFieldInterface";
import TicketInterface from "./TicketInterface";

export interface Batch {
  batchName: string;
  saleStart: string;
  saleEnd: string;
  tickets: TicketInterface[];
}

export default interface FormDataInterface {
  title: string;
  image: File | null;
  category: string;
  dates: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    periodName?: string;
    attractions: { name: string; social?: string, description?: string, startTime?: string, endTime?: string }[];
  }[];
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
  latitude: string;
  longitude: string;
  mapUrl?: string;
  batches: Batch[];
  status: "active" | "finished" | "editing";
  isFree: boolean;
  acceptedTerms: boolean;
  token: string | null;
  formTitle: string;
  customFields: CustomFieldInterface[];
}
