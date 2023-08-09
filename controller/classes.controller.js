"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClass = exports.getCurrentClass = exports.getClasses = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rootUtils_1 = require("../rootUtils");
const classes_schema_1 = __importDefault(require("../models/classes.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const getClasses = (req, res, next) => {
    classes_schema_1.default.find().then((classes) => {
        const convertedClasses = [];
        classes.forEach((hero) => {
            if (hero.classIcon && hero.classHero) {
                convertedClasses.push({
                    title: hero.title,
                    description: hero.description,
                    smallIcon: `data:${hero.classIcon.contentType};base64,${hero.classIcon.data?.toString("base64")}`,
                    heroImage: `data:${hero.classHero.contentType};base64,${hero.classHero.data?.toString("base64")}`,
                });
            }
        });
        res.status(202).json(convertedClasses);
    });
};
exports.getClasses = getClasses;
const getCurrentClass = (req, res, next) => {
    const reqClassId = req.body.classId.toString();
    classes_schema_1.default
        .findOne({ _id: new mongoose_1.default.Types.ObjectId(reqClassId) })
        .then((hero) => {
        if (!hero || !hero.classIcon || !hero.classHero) {
            return res.status(404).json({ error: "Class not found" });
        }
        res.status(202).json({
            title: hero.title,
            description: hero.description,
            smallIcon: `data:${hero.classIcon.contentType};base64,${hero.classIcon.data?.toString("base64")}`,
            heroImage: `data:${hero.classHero.contentType};base64,${hero.classHero.data?.toString("base64")}`,
        });
    });
};
exports.getCurrentClass = getCurrentClass;
const addClass = (req, res, next) => {
    if (!req.files || req.files.length !== 2) {
        return res.status(400).json({
            message: "Please upload exactly two files (SVG and PNG).",
        });
    }
    let svgFile;
    let pngFile;
    const files = req.files;
    for (const file of files) {
        if (file.mimetype === "image/svg+xml") {
            svgFile = file;
        }
        else if (file.mimetype === "image/png") {
            pngFile = file;
        }
    }
    if (!svgFile || !pngFile) {
        return res.status(400).json({
            message: "Please upload one SVG file and one PNG file.",
        });
    }
    const gameClass = new classes_schema_1.default({
        title: req.body.title,
        description: req.body.description,
        classIcon: {
            data: fs_1.default.readFileSync(path_1.default.resolve(rootUtils_1.rootPath + "/uploads/" + svgFile.filename)),
            contentType: "image/svg+xml",
        },
        classHero: {
            data: fs_1.default.readFileSync(path_1.default.resolve(rootUtils_1.rootPath + "/uploads/" + svgFile.filename)),
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
exports.addClass = addClass;
