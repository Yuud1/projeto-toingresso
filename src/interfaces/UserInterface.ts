import UserTicketsInterface from "./UserTicketsInterface";

export default interface UserInterface {
  _id: string;
  name: string;
  cpf: string;
  email: string;
  emailVerified: boolean;
  birthdaydata: string;
  type: "user" | "superUser" | "admin";
  mysite: string;
  instagram: string;
  facebook: string;
  phoneNumber: string;
  avatar: string,
  tickets: UserTicketsInterface[]
  likedEvents: string[]
  isPublic: boolean;
}
