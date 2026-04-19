import { expect, it } from "vitest";
import { baseStudentPayload } from "../fixtures.js";
import type { ApiFailure, ApiSuccess } from "../types.js";

export const registerStudentLifecycleApiTests = (getBaseUrl: () => string): void => {
  it("rejects invalid student payload", async () => {
    const response = await fetch(`${getBaseUrl()}/api/students`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...baseStudentPayload,
        email: "invalid-payload@example.edu",
        creditsCompleted: 140,
        creditsRequired: 120,
      }),
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as ApiFailure;
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Validation failed");
  });

  it("creates a student and fetches it by id", async () => {
    const createResponse = await fetch(`${getBaseUrl()}/api/students`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...baseStudentPayload,
        email: "integration-create@example.edu",
      }),
    });

    expect(createResponse.status).toBe(201);
    const createdBody = (await createResponse.json()) as ApiSuccess<{ id: string; email: string }>;
    expect(createdBody.success).toBe(true);
    expect(createdBody.data.id.startsWith("stu_")).toBe(true);

    const profileResponse = await fetch(`${getBaseUrl()}/api/students/${createdBody.data.id}`);
    expect(profileResponse.status).toBe(200);

    const profileBody = (await profileResponse.json()) as ApiSuccess<{
      student: { id: string; email: string };
      academicProgress: { currentCourses: string[] };
    }>;
    expect(profileBody.success).toBe(true);
    expect(profileBody.data.student.id).toBe(createdBody.data.id);
    expect(profileBody.data.student.email).toBe("integration-create@example.edu");
    expect(profileBody.data.academicProgress.currentCourses.length).toBeGreaterThan(0);
  });

  it("appends GPA trend when GPA is updated without explicit history payload", async () => {
    const createResponse = await fetch(`${getBaseUrl()}/api/students`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...baseStudentPayload,
        email: "integration-gpa-history@example.edu",
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
        gpa: 3.92,
      }),
    });

    expect(updateResponse.status).toBe(200);

    const profileResponse = await fetch(`${getBaseUrl()}/api/students/${createdBody.data.id}`);
    expect(profileResponse.status).toBe(200);

    const profileBody = (await profileResponse.json()) as ApiSuccess<{
      academicProgress: {
        currentGpa: number;
        gpaTrend: Array<{ term: string; gpa: number; recordedAt: string }>;
      };
    }>;

    expect(profileBody.success).toBe(true);
    expect(profileBody.data.academicProgress.currentGpa).toBe(3.92);
    expect(profileBody.data.academicProgress.gpaTrend.length).toBe(2);
    expect(profileBody.data.academicProgress.gpaTrend[1]?.gpa).toBe(3.92);
    expect(profileBody.data.academicProgress.gpaTrend[1]?.term.startsWith("Update ")).toBe(true);
  });
};