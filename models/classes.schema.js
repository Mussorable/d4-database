"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const classSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    classIcon: {
        data: Buffer,
        contentType: String,
    },
    classHero: {
        data: Buffer,
        contentType: String,
    },
    // skills: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Skills",
    // },
});
exports.default = mongoose_1.default.model("Classes", classSchema);
