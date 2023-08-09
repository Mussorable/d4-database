import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { rootPath } from "../rootUtils";

import classesSchema from "../models/classes.schema";

export const getClasses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCurrentClass = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const addClass = (req: Request, res: Response, next: NextFunction) => {
  console.log(rootPath);
  if (!req.files || req.files.length !== 2) {
    return res.status(400).json({
      message: "Please upload exactly two files (SVG and PNG).",
    });
  }

  let svgFile: Express.Multer.File | undefined;
  let pngFile: Express.Multer.File | undefined;

  const files = req.files as Express.Multer.File[];

  for (const file of files) {
    if (file.mimetype === "image/svg+xml") {
      svgFile = file;
    } else if (file.mimetype === "image/png") {
      pngFile = file;
    }
  }

  if (!svgFile || !pngFile) {
    return res.status(400).json({
      message: "Please upload one SVG file and one PNG file.",
    });
  }

  const gameClass = new classesSchema({
    title: req.body.title,
    description: req.body.description,
    classIcon: {
      data: fs.readFileSync(
        path.resolve(rootPath + "/uploads/" + svgFile.filename)
      ),
      contentType: "image/svg+xml",
    },
    classHero: {
      data: fs.readFileSync(
        path.resolve(rootPath + "/uploads/" + svgFile.filename)
      ),
      contentType: "image/png",
    },
  });

  gameClass
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
