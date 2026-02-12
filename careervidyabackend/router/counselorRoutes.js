import express from "express";

import {
  createCounselor,
  getAllCounselors,
  getCounselorById,
  updateCounselor,
  deleteCounselor,
  loginCounselor ,
} from "../controller/counselorController.js";

const router = express.Router();

/* CREATE */
router.post("/", createCounselor);
router.post("/login", loginCounselor);

/* READ */
router.get("/", getAllCounselors);
router.get("/:id", getCounselorById);

/* UPDATE */
router.put("/:id", updateCounselor);

/* DELETE */
router.delete("/:id", deleteCounselor);

export default router;
