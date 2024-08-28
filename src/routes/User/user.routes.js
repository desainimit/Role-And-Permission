import { Router } from "express";
import {
  register,
  login,
  logout,
  userProfile,
} from "../../controllers/User/user.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { authRole } from "../../middlewares/authRole.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, authRole("user"), (req, res) => {
  res.send("User routes");
});
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, authRole("user"), logout);

router.route("/profile").get(verifyJwt, authRole("user"), userProfile);

export default router;
