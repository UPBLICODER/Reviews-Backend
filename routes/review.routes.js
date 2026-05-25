import express from "express";
import {
  createReview,
  getReviewsByCompany,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:companyId", getReviewsByCompany);

export default router;
