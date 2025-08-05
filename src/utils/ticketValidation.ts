import TicketInterface from "@/interfaces/TicketInterface";

export function canActivateTicket(ticket: TicketInterface, currentDate?: Date): boolean {
  const now = currentDate || new Date();
  
  // Se não há restrições de ativação, pode ativar
  if (!ticket.activateAt && !ticket.expireAt) {
    return true;
  }
  
  // Verificar data de início de ativação
  if (ticket.activateAt) {
    const activationStart = new Date(ticket.activateAt);
    if (now < activationStart) {
      return false; // Ainda não chegou o momento de ativar
    }
  }
  
  // Verificar data limite de ativação
  if (ticket.expireAt) {
    const activationEnd = new Date(ticket.expireAt);
    if (now > activationEnd) {
      return false; // Já passou do prazo para ativar
    }
  }
  
  return true; // Pode ativar
}

export function getActivationStatusMessage(ticket: TicketInterface, currentDate?: Date): string {
  const now = currentDate || new Date();
  
  // Se não há restrições
  if (!ticket.activateAt && !ticket.expireAt) {
    return "Pode ser ativado a qualquer momento durante o evento";
  }
  
  // Verificar se já passou do prazo
  if (ticket.expireAt) {
    const activationEnd = new Date(ticket.expireAt);
    if (now > activationEnd) {
      return "Período de ativação expirado";
    }
  }
  
  // Verificar se ainda não chegou o momento
  if (ticket.activateAt) {
    const activationStart = new Date(ticket.activateAt);
    if (now < activationStart) {
      const timeDiff = activationStart.getTime() - now.getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        return `Poderá ser ativado em ${days} dia${days > 1 ? 's' : ''} e ${hours} hora${hours > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `Poderá ser ativado em ${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        return "Poderá ser ativado em breve";
      }
    }
  }
  
  // Se chegou aqui, está no período de ativação
  if (ticket.expireAt) {
    const activationEnd = new Date(ticket.expireAt);
    const timeDiff = activationEnd.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Pode ser ativado agora (restam ${hours}h ${minutes}min)`;
    } else {
      return `Pode ser ativado agora (restam ${minutes}min)`;
    }
  }
  
  return "Pode ser ativado agora";
}

export function formatActivationDate(activateAt?: string): string {
  if (!activateAt) return "Não definido";
  
  const date = new Date(activateAt);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatExpirationDate(expireAt?: string): string {
  if (!expireAt) return "Não definido";
  
  const date = new Date(expireAt);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getActivationPeriod(ticket: TicketInterface): string {
  if (!ticket.activateAt && !ticket.expireAt) {
    return "Ativação livre";
  }
  
  if (ticket.activateAt && ticket.expireAt) {
    return `${formatActivationDate(ticket.activateAt)} até ${formatExpirationDate(ticket.expireAt)}`;
  }
  
  if (ticket.activateAt) {
    return `A partir de ${formatActivationDate(ticket.activateAt)}`;
  }
  
  if (ticket.expireAt) {
    return `Até ${formatExpirationDate(ticket.expireAt)}`;
  }
  
  return "Período não definido";
} 