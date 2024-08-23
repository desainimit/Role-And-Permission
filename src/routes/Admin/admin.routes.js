import { Router } from "express";
import { authRole } from "../../middlewares/authRole.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { login } from "../../controllers/Admin/admin.controller.js";

const router = Router();

router.route("/").get(verifyJwt, authRole("admin"), (req, res) => {
  res.send("Admin routes");
});
router.route("/login").post(authRole("admin"), login);

export default router;
