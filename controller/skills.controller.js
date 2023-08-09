"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkill = exports.getSkills = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rootUtils_1 = require("../rootUtils");
const skill_schema_1 = __importDefault(require("../models/skill.schema"));
const getSkills = (req, res, next) => {
    skill_schema_1.default
        .find()
        .then((skills) => {
        const convertedSkills = [];
        skills.forEach((skill) => {
            if (skill.img && skill.img.data) {
                convertedSkills.push({
                    title: skill.title,
                    description: skill.description,
                    imageURL: `data:${skill.img.contentType};base64,${skill.img.data.toString("base64")}`,
                });
            }
        });
        res.status(202).json(convertedSkills);
    })
        .catch((error) => res.status(404).json(error));
};
exports.getSkills = getSkills;
const addSkill = (req, res, next) => {
    if (!req.file) {
        return res.status(404).json({
            message: "Please, upload a file.",
        });
    }
    const skill = new skill_schema_1.default({
        title: req.body.title,
        description: req.body.description,
        img: {
            data: fs_1.default.readFileSync(path_1.default.join(rootUtils_1.rootPath + "/uploads/" + req.file.filename)),
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
exports.addSkill = addSkill;
