import { Router } from "express";
import { getMeetingControllerHealth } from "../controllers/meeting.controller.js";

export const meetingRoutes = Router();

meetingRoutes.get("/_health", (request, response, next) => {
  void getMeetingControllerHealth(request, response).catch(next);
});
