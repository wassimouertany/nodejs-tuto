import express from "express";
import * as userContreller from "../controllers/user.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, loginSchema } from "../validations/userValidation.js";

export const router = express.Router();

router.post("/signup", validate({ body: signupSchema }), userContreller.signup);

router.post("/login", validate({ body: loginSchema }), userContreller.login);
