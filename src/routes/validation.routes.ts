import { Router } from "express";
import { ValidationController } from "../controllers/validation.controller";
import { ValidationValidator } from "../validators/validation.validator";
import { rateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post(
  "/validate",
  rateLimiter,
  ValidationValidator.validateCardNumberRequest,
  ValidationController.validateCard,
);

router.post(
  "/validate/batch",
  rateLimiter,
  ValidationValidator.validateBatchRequest,
  ValidationController.validateBatch,
);

export default router;
