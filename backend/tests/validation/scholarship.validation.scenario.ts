import { expect, it } from "vitest";
import { scholarshipCreateSchema } from "../../src/middlewares/validate.middleware.js";

export const registerScholarshipValidationTests = (): void => {
  it("rejects dateApplied after deadline", () => {
    const result = scholarshipCreateSchema.safeParse({
      name: "STEM Scholars Grant",
      provider: "Future Labs Foundation",
      amount: 5000,
      currency: "USD",
      status: "Applied",
      deadline: "2026-05-01T00:00:00.000Z",
      requirements: ["Essay"],
      essayRequired: true,
      essaySubmitted: true,
      notes: "Initial submission",
      dateApplied: "2026-05-10T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("dateApplied"))).toBe(true);
    }
  });
};