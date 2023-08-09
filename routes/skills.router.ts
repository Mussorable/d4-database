import { Router } from "express";
import multer from "multer";

import { getSkills, addSkill } from "../controller/skills.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "routes/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});
const upload = multer({ storage: storage });

router.get("/get-all", getSkills);
router.post("/add-skill", upload.single("skillImage"), addSkill);

export default router;
