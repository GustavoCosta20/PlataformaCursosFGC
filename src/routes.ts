import express from "express";
import { categoriesController } from "./controllers/categoriesController";

//Contém as rotas da API
const router = express.Router();

router.get("/categories", categoriesController.index);

export { router };
