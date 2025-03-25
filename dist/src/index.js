"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdftoword_routers_1 = require("../src/routers/pdftoword.routers");
const word_routers_1 = require("../src/routers/word.routers");
const download_routers_1 = require("../src/routers/download.routers");
const PORT = process.env.PORT || 3555;
const app = (0, express_1.default)();
app.use(express_1.default.static("./public"));
app.use(express_1.default.json());
app.use(pdftoword_routers_1.router);
app.use(word_routers_1.router);
app.use(download_routers_1.router);
app.use((req, res) => {
    res.status(404).sendFile("404.html", { root: "./public/pages" });
});
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}!`);
});
