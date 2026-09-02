export type CardType =
  | "Visa"
  | "Mastercard"
  | "Amex"
  | "Discover"
  | "Verve"
  | "AfriGO"
  | "Unknown";

export interface ValidationRequest {
  cardNumber: string;
}

export interface ValidationResponse {
  valid: boolean;
  cardNumber: string;
  message?: string;
  cardType?: CardType;
  suggestions?: string[];
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}
