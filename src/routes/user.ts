import { createUser, updateUser, login } from "../controllers/user";
import auth from "../middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/", createUser);
router.post("/login", login);
router.post("/update-user/:id", auth, updateUser);

export default router;
