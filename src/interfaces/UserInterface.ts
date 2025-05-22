export default interface UserInterface {
  _id: string
  name: string;
  cpf: string;
  email: string;
  emailVerified: string;
  birthdaydata: string;
  type: {
    type: string;
    enum: ["user", "superUser", "admin"];
  };
  mysite: string,
  instagram: string,
  facebook: string,
  phoneNumber: string,
}
