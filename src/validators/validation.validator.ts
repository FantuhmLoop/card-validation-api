import { Request, Response, NextFunction } from "express";

export class ValidationValidator {
  /**
   * Validates the request body for card validation endpoint
   */
  static validateCardNumberRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { cardNumber } = req.body;

    // Check if cardNumber exists
    if (!cardNumber) {
      res.status(400).json({
        status: 400,
        message: "Missing required field: cardNumber",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if cardNumber is a string
    if (typeof cardNumber !== "string") {
      res.status(400).json({
        status: 400,
        message: "cardNumber must be a string",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Remove spaces and dashes for validation
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Check if it contains only digits (after removing spaces/dashes)
    if (!/^\d+$/.test(cleanNumber)) {
      res.status(400).json({
        status: 400,
        message: "cardNumber must contain only digits, spaces, or dashes",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if it's empty after cleaning
    if (cleanNumber.length === 0) {
      res.status(400).json({
        status: 400,
        message: "cardNumber must contain at least one digit",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  }

  /**
   * Validates the request body for batch card validation endpoint
   */
  static validateBatchRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { cardNumbers } = req.body;

    // Check if cardNumbers exists
    if (!cardNumbers) {
      res.status(400).json({
        status: 400,
        message: "Missing required field: cardNumbers",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if cardNumbers is an array
    if (!Array.isArray(cardNumbers)) {
      res.status(400).json({
        status: 400,
        message: "cardNumbers must be an array",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check each card number in the array
    for (const [index, cardNumber] of cardNumbers.entries()) {
      if (typeof cardNumber !== "string") {
        res.status(400).json({
          status: 400,
          message: `cardNumbers[${index}] must be a string`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const cleanNumber = cardNumber.replace(/[\s-]/g, "");

      if (!/^\d+$/.test(cleanNumber)) {
        res.status(400).json({
          status: 400,
          message: `cardNumbers[${index}] must contain only digits, spaces, or dashes`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (cleanNumber.length === 0) {
        res.status(400).json({
          status: 400,
          message: `cardNumbers[${index}] must contain at least one digit`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    next();
  }
}
