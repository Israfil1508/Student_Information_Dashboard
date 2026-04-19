import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { scholarshipServiceHealth } from "../services/scholarship.service.js";

export const getScholarshipControllerHealth = async (_request: Request, response: Response) => {
  const data = await scholarshipServiceHealth();
  sendSuccess(response, data, "Scholarship controller ready");
};
