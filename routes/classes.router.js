"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const classes_controller_1 = require("../controller/classes.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, file.fieldname + "-" + Date.now() + "." + ext);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/svg+xml" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
router.get("/get-all", classes_controller_1.getClasses);
router.post("/add-class", upload.array("classImages", 2), classes_controller_1.addClass);
exports.default = router;
