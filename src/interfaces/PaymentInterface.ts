export interface PaymentTicket {
  ticketId: string;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Payment {
  preferenceId: string;
  externalReference: string;
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  date: Date;
  tickets: PaymentTicket[];
  eventId: string;
} 