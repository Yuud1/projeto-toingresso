import OrganizerInterface from "./OrganizerInterface";
import TicketInterface from "./TicketInterface";

export default interface EventInterface{
    _id:  string,
    title:  string,
    image:  string,
    imageId:  string,
    category:  string,
    startDate:  Date,
    startTime:  string,
    endDate:  Date,
    endTime:  string,
    description:  string,
    venueName:  string,
    zipCode:  string,
    street:  string,
    number:  string,
    complement:  string,
    neighborhood:  string,
    city:  string,
    state:  string,
    tickets: [TicketInterface],
    organizer: OrganizerInterface
    acceptedTerms:  Boolean,
    policy: string,
  }
