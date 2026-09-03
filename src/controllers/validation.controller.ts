import { Request, Response } from "express";
import { ValidationService } from "../services/validation.service";

const validationService = new ValidationService();

export class ValidationController {
  /**
   * Handles card validation request
   */
  static validateCard(req: Request, res: Response): void {
    try {
      const { cardNumber } = req.body;

      const result = validationService.validateCardNumber(cardNumber);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handles card validation request for batch of card numbers
   */
  static validateBatch(req: Request, res: Response): void {
    const { cardNumbers } = req.body;

    if (!Array.isArray(cardNumbers)) {
      res.status(400).json({
        status: 400,
        message: "cardNumbers must be an array",
      });
      return;
    }

    const results = cardNumbers.map((cardNumber) =>
      validationService.validateCardNumber(cardNumber),
    );

    res.status(200).json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        valid: results.filter((r) => r.valid).length,
        invalid: results.filter((r) => !r.valid).length,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
