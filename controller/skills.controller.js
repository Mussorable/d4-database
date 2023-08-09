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
const classes_schema_1 = __importDefault(require("../models/classes.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const getSkills = async (req, res, next) => {
    try {
        const skills = await skill_schema_1.default.find();
        const convertedSkills = skills
            .map((skill) => {
            if (skill.img && skill.img.data) {
                return {
                    title: skill.title,
                    description: skill.description,
                    imageURL: `data:${skill.img.contentType};base64,${skill.img.data.toString("base64")}`,
                };
            }
            return null;
        })
            .filter(Boolean);
        res.status(202).json(convertedSkills);
    }
    catch (error) {
        res.status(404).json(error);
    }
};
exports.getSkills = getSkills;
const addSkill = async (req, res, next) => {
    const reqClassId = req.body.classId.toString();
    try {
        const hero = await classes_schema_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(reqClassId),
        });
        if (!hero || !hero.classIcon || !hero.classHero) {
            return res.status(404).json({ error: "Class not found" });
        }
        if (!req.file) {
            return res.status(404).json({
                message: "Please, upload a file.",
            });
        }
        const skill = new skill_schema_1.default({
            title: req.body.title,
            description: req.body.description,
            img: {
                data: fs_1.default.readFileSync(path_1.default.resolve(rootUtils_1.rootPath + "/uploads/" + req.file.filename)),
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
    }
    catch (error) {
        res.status(502).json({
            message: "Error, skill wasn't saved.",
            error,
        });
    }
};
exports.addSkill = addSkill;
