import { MaskType } from "@/interfaces/CustomFieldInterface";

export const formatCPF = (numbers: string): string => {
  const limitedNumbers: string = numbers.slice(0, 11);

  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
};

export const formatCNPJ = (numbers: string): string => {
  const limitedNumbers: string = numbers.slice(0, 14);

  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(
      8,
      12
    )}-${limitedNumbers.slice(12)}`;
  }
};

export const formatPhone = (numbers: string): string => {
  const limitedNumbers: string = numbers.slice(0, 11);

  if (limitedNumbers.length <= 2) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
      2,
      7
    )}-${limitedNumbers.slice(7)}`;
  }
};

export const formatCEP = (numbers: string): string => {
  const limitedNumbers: string = numbers.slice(0, 8);

  if (limitedNumbers.length <= 5) {
    return limitedNumbers;
  } else {
    return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
  }
};

export const formatDate = (numbers: string): string => {
  const limitedNumbers: string = numbers.slice(0, 8);

  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 4) {
    return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(
      2,
      4
    )}/${limitedNumbers.slice(4)}`;
  }
};

export const formatCurrency = (numbers: string): string => {
  if (numbers === "") return "";

  // Converte para número e formata como moeda
  const amount: number = Number.parseInt(numbers) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const formatCustom = (value: string, mask: string): string => {
  if (!mask) return value;

  let result = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === "#") {
      result += value[valueIndex];
      valueIndex++;
    } else {
      result += mask[i];
      if (value[valueIndex] === mask[i]) {
        valueIndex++;
      }
    }
  }

  return result;
};

export const applyMask = (
  value: string,
  maskType: MaskType,
  customMask?: string
): string => {
  if (!value) return value;

  // Remove todos os caracteres não numéricos para aplicar a máscara
  const numbers: string = value.replace(/\D/g, "");

  switch (maskType) {
    case "cpf":
      return formatCPF(numbers);
    case "cnpj":
      return formatCNPJ(numbers);
    case "phone":
      return formatPhone(numbers);
    case "cep":
      return formatCEP(numbers);
    case "date":
      return formatDate(numbers);
    case "currency":
      return formatCurrency(numbers);
    case "custom":
      return formatCustom(value, customMask || "");
    default:
      return value;
  }
};
