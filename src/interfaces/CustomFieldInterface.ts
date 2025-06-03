export type FieldType =
  | "text"
  | "number"
  | "email"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "textarea"; // Adicione textarea aqui, se for necessário no form

export type MaskType =
  | "none"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "date"
  | "currency"
  | "custom";

export default interface CustomFieldInterface {
  _id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  maskType: MaskType,
  mask: string,
}
