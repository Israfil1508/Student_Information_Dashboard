import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { meetingServiceHealth } from "../services/meeting.service.js";

export const getMeetingControllerHealth = async (_request: Request, response: Response) => {
  const data = await meetingServiceHealth();
  sendSuccess(response, data, "Meeting controller ready");
};
