"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdftoword_routers_1 = require("../src/routers/pdftoword.routers");
const word_routers_1 = require("../src/routers/word.routers");
const download_routers_1 = require("../src/routers/download.routers");
const node_path_1 = __importDefault(require("node:path"));
const PORT = process.env.PORT || 3555;
const app = (0, express_1.default)();
const publicDirectoryPath = node_path_1.default.join(__dirname, "../public");
app.use(express_1.default.static(publicDirectoryPath));
app.use(express_1.default.json());
app.use(pdftoword_routers_1.router);
app.use(word_routers_1.router);
app.use(download_routers_1.router);
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}!`);
});
