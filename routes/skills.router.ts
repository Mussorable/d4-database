import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import skillSchema from "../models/skill.schema";

interface ResponseError extends Error {
  statusCode?: number;
}

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

router.get("/skills", (req: Request, res: Response, next: NextFunction) => {
  skillSchema
    .find()
    .then((skills) => {
      res.status(202).json(skills);
    })
    .catch((error) => res.status(404).json(error));
});

router.post(
  "/add-skill",
  upload.single("skillImage"),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      const error = new Error("Please upload the file.") as ResponseError;
      error.statusCode = 404;
      throw error;
    }

    const skill = new skillSchema({
      title: req.body.title,
      description: req.body.description,
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    });

    skill
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Skill saved successfully!",
          result,
        });
      })
      .catch((error) => {
        res.status(502).json({
          message: "Error, skill wasn't been saved.",
          error,
        });
      });
  }
);

export default router;
