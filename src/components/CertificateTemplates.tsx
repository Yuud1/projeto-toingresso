export const CertificateTemplates = {
  modern: {
    name: "Moderno",
    description: "Design limpo e contemporâneo",
    colors: {
      primary: "#3b82f6",
      secondary: "#1e40af",
      accent: "#60a5fa",
      text: "#1f2937",
      background: "#f8fafc",
    },
    fonts: {
      title: "bold 48px sans-serif",
      subtitle: "24px sans-serif",
      body: "20px sans-serif",
      small: "16px sans-serif",
    },
  },
  classic: {
    name: "Clássico",
    description: "Estilo tradicional e elegante",
    colors: {
      primary: "#8b5a2b",
      secondary: "#d4af37",
      accent: "#f4e4bc",
      text: "#2d1810",
      background: "#fefefe",
    },
    fonts: {
      title: "bold 48px serif",
      subtitle: "24px serif",
      body: "20px serif",
      small: "16px serif",
    },
  },
  minimal: {
    name: "Minimalista",
    description: "Design simples e focado",
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#9ca3af",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      title: "bold 42px sans-serif",
      subtitle: "22px sans-serif",
      body: "18px sans-serif",
      small: "14px sans-serif",
    },
  },
  elegant: {
    name: "Elegante",
    description: "Sofisticado com detalhes dourados",
    colors: {
      primary: "#d4af37",
      secondary: "#b8860b",
      accent: "#ffd700",
      text: "#1a1a1a",
      background: "#fefefe",
    },
    fonts: {
      title: "bold 50px serif",
      subtitle: "26px serif",
      body: "22px serif",
      small: "18px serif",
    },
  },
}

export type TemplateType = keyof typeof CertificateTemplates
