import { expect, it } from "vitest";
import { studentUpdateSchema } from "../../src/middlewares/validate.middleware.js";

export const registerStudentUpdateValidationTests = (): void => {
  it("rejects empty update payload", () => {
    const result = studentUpdateSchema.safeParse({});
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes("At least one field"))).toBe(
        true,
      );
    }
  });
};