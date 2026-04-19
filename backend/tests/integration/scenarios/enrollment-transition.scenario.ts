import { expect, it } from "vitest";
import { baseStudentPayload } from "../fixtures.js";
import type { ApiFailure, ApiSuccess } from "../types.js";

export const registerEnrollmentTransitionApiTests = (getBaseUrl: () => string): void => {
  it("enforces invalid enrollment transition from Graduated", async () => {
    const createResponse = await fetch(`${getBaseUrl()}/api/students`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...baseStudentPayload,
        email: "transition-test@example.edu",
        enrollmentStatus: "Graduated",
      }),
    });

    expect(createResponse.status).toBe(201);
    const createdBody = (await createResponse.json()) as ApiSuccess<{ id: string }>;

    const updateResponse = await fetch(`${getBaseUrl()}/api/students/${createdBody.data.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        enrollmentStatus: "Full-time",
      }),
    });

    expect(updateResponse.status).toBe(409);
    const updateBody = (await updateResponse.json()) as ApiFailure;
    expect(updateBody.success).toBe(false);
    expect(updateBody.error.message).toBe("Invalid enrollment status transition");
  });
};