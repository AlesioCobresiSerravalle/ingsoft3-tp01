import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/resumen", dashboardController.resumen);
