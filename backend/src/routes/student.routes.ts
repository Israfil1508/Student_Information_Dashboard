import { Router } from "express";
import { getStudentControllerHealth } from "../controllers/student.controller.js";

export const studentRoutes = Router();

studentRoutes.get("/_health", (request, response, next) => {
  void getStudentControllerHealth(request, response).catch(next);
});
