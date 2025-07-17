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

export const formatDateTimeForInput = (dateString: string) => {
  console.log(dateString);
  
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Formatar para YYYY-MM-DDTHH:mm (formato do datetime-local)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    console.log(`${year}-${month}-${day}T${hours}:${minutes}`)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
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

export const truncateTextByScreenSize = (
  text: string,
  maxLength: number = 50
): string => {
  if (typeof window === "undefined") return text;

  const screenWidth = window.innerWidth;

  // Ajusta o limite baseado no tamanho da tela
  if (screenWidth < 640) {
    // mobile
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  } else if (screenWidth < 768) {
    // tablet
    return text.length > 40 ? text.slice(0, 40) + "..." : text;
  } else if (screenWidth < 1024) {
    // small desktop
    return text.length > 50 ? text.slice(0, 50) + "..." : text;
  } else {
    // large desktop
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
};

export const truncateTextResponsive = (text: string): string => {
  if (typeof window === "undefined") return text;

  const screenWidth = window.innerWidth;

  // Limites aumentados para mobile
  if (screenWidth < 480) {
    // mobile pequeno
    return text.length > 40 ? text.slice(0, 40) + "..." : text;
  } else if (screenWidth < 640) {
    // mobile
    return text.length > 50 ? text.slice(0, 50) + "..." : text;
  } else if (screenWidth < 768) {
    // tablet
    return text.length > 45 ? text.slice(0, 45) + "..." : text;
  } else {
    // desktop
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }
};
