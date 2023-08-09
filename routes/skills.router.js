"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const skills_controller_1 = require("../controller/skills.controller");
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
router.get("/get-all", skills_controller_1.getSkills);
router.post("/add-skill", upload.single("skillImage"), skills_controller_1.addSkill);
exports.default = router;
