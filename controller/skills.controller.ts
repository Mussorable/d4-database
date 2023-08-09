import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { rootPath } from "../rootUtils";

import skillSchema from "../models/skill.schema";
import classesSchema from "../models/classes.schema";
import mongoose from "mongoose";

interface ConvertedSkills {
  title: string;
  description: string;
  imageURL: string;
}

export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = await skillSchema.find();
    const convertedSkills: (ConvertedSkills | null)[] = skills
      .map((skill) => {
        if (skill.img && skill.img.data) {
          return {
            title: skill.title,
            description: skill.description,
            imageURL: `data:${
              skill.img.contentType
            };base64,${skill.img.data.toString("base64")}`,
          };
        }
        return null;
      })
      .filter(Boolean);
    res.status(202).json(convertedSkills);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const addSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqClassId = req.body.classId.toString();

  try {
    const hero = await classesSchema.findOne({
      _id: new mongoose.Types.ObjectId(reqClassId),
    });

    if (!hero || !hero.classIcon || !hero.classHero) {
      return res.status(404).json({ error: "Class not found" });
    }

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
          path.resolve(rootPath + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
      hero: {
        _id: hero._id,
        title: hero.title,
      },
    });

    const savedSkill = await skill.save();

    hero.skills.push({
      _id: savedSkill._id,
      title: savedSkill.title,
    });

    await hero.save();

    res.status(201).json({
      message: "Skill saved successfully!",
      saved_skill: savedSkill,
      updated_class: hero,
    });
  } catch (error) {
    res.status(502).json({
      message: "Error, skill wasn't saved.",
      error,
    });
  }
};
