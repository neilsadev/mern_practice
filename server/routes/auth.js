import express from "express";
import { login } from "../controller/auth.js";

const router = express.Router();

// Route for handling POST request to /login endpoint
router.post("/login", login);

export default router;
