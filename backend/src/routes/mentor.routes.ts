import { Router } from "express";
import { getMentorControllerHealth } from "../controllers/mentor.controller.js";

export const mentorRoutes = Router();

mentorRoutes.get("/_health", (request, response, next) => {
  void getMentorControllerHealth(request, response).catch(next);
});
