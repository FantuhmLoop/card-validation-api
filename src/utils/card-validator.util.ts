export class CardValidator {
  static validateExpiryDate(month: number, year: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  }

  static validateCVV(cvv: string, cardType: string): boolean {
    const expectedLength = cardType === "Amex" ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
  }
}
