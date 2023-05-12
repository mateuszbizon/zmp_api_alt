import express from 'express';
import { signin, signup, getUsersBySearch, getUserDataProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/getUserDataProfile", getUserDataProfile)
router.get("/getUsersBySearch", getUsersBySearch);

export default router;