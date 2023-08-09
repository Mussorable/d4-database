import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { rootPath } from "../rootUtils";

import skillSchema from "../models/skill.schema";

interface ConvertedSkills {
  title: string;
  description: string;
  imageURL: string;
}

export const getSkills = (req: Request, res: Response, next: NextFunction) => {
  skillSchema
    .find()
    .then((skills) => {
      const convertedSkills: ConvertedSkills[] = [];
      skills.forEach((skill) => {
        if (skill.img && skill.img.data) {
          convertedSkills.push({
            title: skill.title,
            description: skill.description,
            imageURL: `data:${
              skill.img.contentType
            };base64,${skill.img.data.toString("base64")}`,
          });
        }
      });
      res.status(202).json(convertedSkills);
    })
    .catch((error) => res.status(404).json(error));
};

export const addSkill = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(404).json({
      message: "Please, upload a file.",
    });
  }

  const skill = new skillSchema({
    title: req.body.title,
    description: req.body.description,
    img: {
      data: fs.readFileSync(
        path.join(rootPath + "/uploads/" + req.file.filename)
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
};
