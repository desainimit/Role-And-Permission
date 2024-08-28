import { Router } from "express";
import { authRole } from "../../middlewares/authRole.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import {
  login,
  getAllUsers,
  logout,
} from "../../controllers/Admin/admin.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/").get(verifyJwt, authRole("admin"), (req, res) => {
  res.send("Admin routes");
});
router.route("/login").post(authRole("admin"), login);
router.route("/logout").post(verifyJwt, authRole("admin"), logout);
router
  .route("/users")
  .get(verifyJwt, authRole("admin", "read_user",), getAllUsers);

export default router;
