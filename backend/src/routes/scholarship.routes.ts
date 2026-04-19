import { Router } from "express";
import { getScholarshipControllerHealth } from "../controllers/scholarship.controller.js";

export const scholarshipRoutes = Router();

scholarshipRoutes.get("/_health", (request, response, next) => {
  void getScholarshipControllerHealth(request, response).catch(next);
});
