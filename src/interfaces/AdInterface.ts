export default interface AdInterface {
  _id: string;
  title: string;
  urlImage: string;
  redirectUrl: string;
  active: boolean;
  type: "banner" | "carousel";
}