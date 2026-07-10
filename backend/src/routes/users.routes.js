import { Router } from "express";
import { addToHistory, getUserHistory, login, register, getUserInfo, forgotPassword, resetPassword } from "../controllers/user.controller.js";



const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
router.route("/get_user_info").get(getUserInfo)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)

export default router;