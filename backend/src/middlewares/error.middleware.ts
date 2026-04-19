import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse.js";

export const notFoundMiddleware = (_request: Request, response: Response): void => {
  sendError(response, 404, "Endpoint not found");
};

export const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    sendError(response, 400, "Validation failed", error.issues);
    return;
  }

  if (error instanceof Error) {
    sendError(response, 500, error.message);
    return;
  }

  sendError(response, 500, "Unknown server error");
};
