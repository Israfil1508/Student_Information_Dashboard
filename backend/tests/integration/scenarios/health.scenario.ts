import { expect, it } from "vitest";
import type { ApiSuccess } from "../types.js";

export const registerHealthApiTests = (getBaseUrl: () => string): void => {
  it("returns healthy status", async () => {
    const response = await fetch(`${getBaseUrl()}/api/health`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as ApiSuccess<{ status: string; timestamp: string }>;
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("ok");
    expect(typeof body.data.timestamp).toBe("string");
  });
};