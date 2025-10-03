import express from "express";
import * as userContreller from "../controllers/user.js";

export const router = express.Router();

router.post("/signup", userContreller.signup);
router.post("/login", userContreller.login);