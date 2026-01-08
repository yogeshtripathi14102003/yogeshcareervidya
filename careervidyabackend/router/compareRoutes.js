import express from "express";
import { compareUniversities } from "../controller/compareController.js";

const router = express.Router();

router.get("/", compareUniversities);

export default router;
