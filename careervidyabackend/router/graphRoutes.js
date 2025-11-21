import express from "express";
import { getDashboardGraphData } from "../controller/graphController.js";

const router = express.Router();

// GET GRAPH DATA
router.get("/", getDashboardGraphData);

export default router;
