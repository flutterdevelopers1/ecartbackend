import express from "express";
import * as review from "./review.controller.js";
import { validate } from "../../middleware/validation.js";

import { allowedTo, protectedRoutes } from "../auth/auth_controller.js";
import {
    addReviewValidation,
    deleteReviewValidation,
    getSpecificReviewValidation,
    updateReviewValidation,
} from "./review_validation.js";

const reviewRouter = express.Router();

reviewRouter.route("/").post(protectedRoutes, allowedTo("user"), validate(addReviewValidation), review.addReview).get(review.getAllReviews);

reviewRouter.route("/:id").put(protectedRoutes, allowedTo("user"), validate(updateReviewValidation), review.updateReview).get(validate(getSpecificReviewValidation), review.getSpecificReview).delete(protectedRoutes, allowedTo("admin", "user"), validate(deleteReviewValidation), review.deleteReview);

export default reviewRouter;