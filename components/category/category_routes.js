import express from "express";
import * as category from './category_controller.js';
import subCategoryRouter from '../subcategory/subcategory_routes.js'
import {
    addCategoryValidation,
    deleteCategoryValidation,
    updateCategoryValidation,
} from "./category_validation.js";
import { validate } from "../../middleware/validation.js";
import { uploadSingleFile } from '../../db/multer.js';
import { allowedTo, protectedRoutes } from '../auth/auth_controller.js';

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

categoryRouter.route("/").post(protectedRoutes, allowedTo("admin"), uploadSingleFile("Image", "category"), validate(addCategoryValidation), category.addCategory).get(category.getAllCategories);

categoryRouter.route("/:id").put(protectedRoutes, allowedTo("admin"), validate(updateCategoryValidation), category.updateCategory).delete(protectedRoutes, allowedTo("admin"), validate(deleteCategoryValidation), category.deleteCategory);

export default categoryRouter;