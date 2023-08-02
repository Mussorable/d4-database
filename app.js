"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_json_1 = require("./config.json");
const skills_router_1 = __importDefault(require("./routes/skills.router"));
const startApplication = async () => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use(skills_router_1.default);
    try {
        const connect = await mongoose_1.default.connect(config_json_1.mongoDB);
        app.listen(8080);
    }
    catch (error) {
        console.error(error);
    }
};
startApplication();
