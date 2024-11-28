import express from "express";
import { getAll } from "../controller/adminController";
import { getAllModerators } from "../controller/moderatorController";
import { getAllUser } from "../controller/userController";

const accessRoute = express.Router();

accessRoute.get('/getAllData', getAll);
accessRoute.get('/getAllModerators', getAllModerators);
accessRoute.get('/getAllUsers', getAllUser);

export default accessRoute;