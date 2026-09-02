export interface ValidationRequest {
  cardNumber: string;
}

export interface ValidationResponse {
  valid: boolean;
  cardNumber: string;
  message?: string;
  cardType?: "Visa" | "Mastercard" | "Amex" | "Verve" | "Discover" | "Unknown";
  suggestions?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}
