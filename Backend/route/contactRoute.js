import express from "express";
const contactRoutes = express.Router();
import { contactme } from "../controller/contactController.js";
contactRoutes.post("/", contactme);

export default contactRoutes;