export default interface UserInterface {
  name: string;
  cpf: string;
  email: string;
  emailVerified: string;
  birthdaydata: string;
  type: {
    type: string;
    enum: ["user", "superUser", "admin"];
  };
}
