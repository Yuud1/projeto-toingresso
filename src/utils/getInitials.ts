export default function getInitials(name?: string): string {
  // Verifica se o nome existe e é uma string
  if (!name || typeof name !== 'string') {
    return '?';
  }
  
  // Remove espaços em branco e verifica se ainda tem conteúdo
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return '?';
  }
  
  // Divide o nome em palavras
  const words = trimmedName.split(" ");
  
  // Se tem apenas uma palavra
  if (words.length === 1) {
    const firstChar = words[0][0];
    return firstChar ? firstChar.toUpperCase() : '?';
  }
  
  // Se tem duas ou mais palavras, pega a primeira letra de cada
  const firstInitial = words[0][0] ? words[0][0].toUpperCase() : '';
  const secondInitial = words[1][0] ? words[1][0].toUpperCase() : '';
  
  // Retorna as iniciais ou '?' se não conseguir extrair
  return (firstInitial + secondInitial) || '?';
}