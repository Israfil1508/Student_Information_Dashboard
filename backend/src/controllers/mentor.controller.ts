import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { mentorServiceHealth } from "../services/mentor.service.js";

export const getMentorControllerHealth = async (_request: Request, response: Response) => {
  const data = await mentorServiceHealth();
  sendSuccess(response, data, "Mentor controller ready");
};
