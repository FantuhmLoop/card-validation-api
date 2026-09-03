import { LuhnUtil } from "../utils/luhn.util.ts";
import { ValidationResponse } from "../types/validation.types.ts";

export class ValidationService {
  /**
   * Validates a card number and returns the result
   */
  validateCardNumber(cardNumber: string): ValidationResponse {
    // Remove spaces and dashes for validation
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Check minimum length (at least 13 digits for most cards)
    if (cleanNumber.length < 13) {
      return {
        valid: false,
        cardNumber: cardNumber,
        message: "Card number must be at least 13 digits",
      };
    }

    // Check maximum length (19 digits max for most cards)
    if (cleanNumber.length > 19) {
      return {
        valid: false,
        cardNumber: cardNumber,
        message: "Card number must not exceed 19 digits",
      };
    }

    const isValid = LuhnUtil.validate(cardNumber);
    const cardType = LuhnUtil.detectCardType(cardNumber);

    let suggestions: string[] = [];

    if (!isValid && cleanNumber.length === 16) {
      // Check if it's a common test number
      if (cleanNumber === "1234567890123456") {
        suggestions.push(
          "This appears to be a test number. Try a real card number like 4111111111111111",
        );
      }

      // Check if it fails Luhn but passes length check
      if (LuhnUtil.validate(cleanNumber) === false) {
        suggestions.push(
          "Check for transcription errors. One digit may be incorrect.",
        );
      }
    }

    return {
      valid: isValid,
      cardNumber: cardNumber,
      cardType: cardType,
      message: isValid ? "Card number is valid" : "Card number is invalid",
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }
}
