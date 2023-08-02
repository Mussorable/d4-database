"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const skill_schema_1 = __importDefault(require("../models/skill.schema"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "routes/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.get("/skills", (req, res, next) => {
    skill_schema_1.default
        .find()
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
});
router.post("/add-skill", upload.single("skillImage"), (req, res, next) => {
    if (!req.file) {
        const error = new Error("Please upload the file.");
        error.statusCode = 404;
        throw error;
    }
    // const skill = {
    //   title: req.body.title,
    //   description: req.body.description,
    //   img: {
    //     data: fs.readFileSync(
    //       path.join(__dirname + "/uploads/" + req.file.filename)
    //     ),
    //     contentType: "image/jpeg",
    //   },
    // };
    const skill = new skill_schema_1.default({
        title: req.body.title,
        description: req.body.description,
        img: {
            data: fs_1.default.readFileSync(path_1.default.join(__dirname + "/uploads/" + req.file.filename)),
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
});
exports.default = router;
