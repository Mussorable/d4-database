import { Router, Request } from "express";
import multer from "multer";

import { addClass } from "../controller/classes.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "image/svg+xml" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/get-all", (req, res, next) => {
  res.json({ message: "worked" });
});

router.post("/add-class", upload.array("classImages", 2), addClass);

export default router;
