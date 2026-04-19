import { expect, it } from "vitest";
import { studentCreateSchema } from "../../src/middlewares/validate.middleware.js";
import { validStudentPayload } from "./fixtures.js";

export const registerStudentCreateValidationTests = (): void => {
  it("accepts a valid student payload", () => {
    const parsed = studentCreateSchema.parse(validStudentPayload);
    expect(parsed.email).toBe(validStudentPayload.email);
    expect(parsed.creditsCompleted).toBeLessThanOrEqual(parsed.creditsRequired);
  });

  it("rejects payload when completed credits exceed required credits", () => {
    const result = studentCreateSchema.safeParse({
      ...validStudentPayload,
      creditsCompleted: 130,
      creditsRequired: 120,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("creditsCompleted"))).toBe(
        true,
      );
    }
  });

  it("rejects GPA history when latest point does not match current GPA", () => {
    const result = studentCreateSchema.safeParse({
      ...validStudentPayload,
      gpa: 3.2,
      gpaHistory: [
        {
          term: "Fall 2026",
          gpa: 3.6,
          recordedAt: "2026-12-15T00:00:00.000Z",
        },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "gpaHistory")).toBe(true);
    }
  });

  it("rejects expected graduation when it includes a time component", () => {
    const result = studentCreateSchema.safeParse({
      ...validStudentPayload,
      expectedGraduation: "2027-06-01T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === "expectedGraduation"),
      ).toBe(true);
    }
  });
};