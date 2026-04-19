import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { studentServiceHealth } from "../services/student.service.js";

export const getStudentControllerHealth = async (_request: Request, response: Response) => {
  const data = await studentServiceHealth();
  sendSuccess(response, data, "Student controller ready");
};
