import { CardType } from "../types/validation.types";

/**
 * Luhn Algorithm implementation for card validation
 * Also detects card type based on the number pattern
 */
export class LuhnUtil {
  /**
   * Validates a card number using an optimized, zero-allocation Luhn algorithm.
   */
  static validate(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Must be numeric and within standard international lengths (12 to 19 digits)
    if (!/^\d{12,19}$/.test(cleanNumber)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    // Loop backwards from the rightmost digit (no array mutation)
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Detects card type using exact, modern international and Nigerian BIN ranges.
   */
  static detectCardType(cardNumber: string): CardType {
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    if (cleanNumber.length < 4) {
      return "Unknown";
    }

    // 1. Verve (Nigeria / Africa Regional)
    // Matches 506099-506198, 507853-507964, 650002-650027
    if (
      /^506(099|1[0-9][0-9])/.test(cleanNumber) ||
      /^507(85[3-9]|8[6-9][0-9]|9[0-5][0-9]|96[0-4])/.test(cleanNumber) ||
      /^650(00[2-9]|0[1-2][0-7])/.test(cleanNumber)
    ) {
      return "Verve";
    }

    // 2. AfriGO (Nigeria Domestic Scheme by CBN/NIBSS)
    // Primary BIN range assigned under the 9-series global MII rule
    if (cleanNumber.startsWith("9805")) {
      return "AfriGO";
    }

    // 3. Visa
    if (cleanNumber.startsWith("4")) {
      return "Visa";
    }

    // 4. Mastercard (Includes legacy 51-55 and newer 2221-2720 series)
    const prefix2 = parseInt(cleanNumber.substring(0, 2), 10);
    const prefix4 = parseInt(cleanNumber.substring(0, 4), 10);
    if (
      (prefix2 >= 51 && prefix2 <= 55) ||
      (prefix4 >= 2221 && prefix4 <= 2720)
    ) {
      return "Mastercard";
    }

    // 5. American Express
    if (/^3[47]/.test(cleanNumber)) {
      return "Amex";
    }

    // 6. Discover
    if (
      /^6(?:011|5|4[4-9])/.test(cleanNumber) ||
      (prefix4 >= 6221 && prefix4 <= 6229)
    ) {
      return "Discover";
    }

    return "Unknown";
  }
}
