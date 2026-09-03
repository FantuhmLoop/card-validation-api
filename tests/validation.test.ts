import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("Card Validation API", () => {
  describe("POST /api/v1/validate", () => {
    test("should validate a valid Visa card number", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: "4111111111111111" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
      expect(response.body.data.cardType).toBe("Visa");
    });

    test("should reject an invalid card number", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: "1234567890123456" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
    });

    test("should handle missing cardNumber field", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({})
        .expect(400);

      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe("Missing required field: cardNumber");
    });

    test("should handle non-string cardNumber", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: 1234567890123456 })
        .expect(400);

      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe("cardNumber must be a string");
    });

    test("should handle card number with spaces", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: "4111 1111 1111 1111" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    test("should handle card number with dashes", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: "4111-1111-1111-1111" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    test("should detect Amex card type", async () => {
      const response = await request(app)
        .post("/api/v1/validate")
        .send({ cardNumber: "378282246310005" })
        .expect(200);

      expect(response.body.data.cardType).toBe("Amex");
    });

    test("should return 404 for non-existent route", async () => {
      await request(app).get("/api/v1/invalid").expect(404);
    });
  });
});
