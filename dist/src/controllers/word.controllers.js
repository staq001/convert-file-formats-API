"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDocxToHTML = convertDocxToHTML;
exports.convertDocxToPDF = convertDocxToPDF;
exports.getDocx = getDocx;
const util_1 = require("../../lib/util");
const libreoffice = __importStar(require("../../lib/libreoffice"));
const word_services_1 = require("../services/word.services");
const wordService = new word_services_1.WordService();
function convertDocxToHTML(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { docxId } = req.params;
        const docx = yield wordService.getDocxFile(docxId);
        try {
            if (!docx) {
                return res.status(404).json({
                    status: "failed",
                    message: "Docx file not found!",
                });
            }
            const inputFilePath = `./storage/${docx.docxId}/original.${docx.extension}`;
            const outputDirectory = `./storage/${docx.docxId}`;
            yield libreoffice.convertDocxToHTML(inputFilePath, outputDirectory);
            res.status(200).json({
                status: "success",
                message: "Docx File converted to HTML successfully",
            });
        }
        catch (e) {
            console.log(e);
            if (docx) {
                yield util_1.util.deleteFile(`./storage/${docx.docxId}/original.html`);
                res.status(500).json({
                    status: "failed",
                    message: "Operation failed!",
                });
            }
        }
    });
}
function convertDocxToPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { docxId } = req.params;
        const docx = yield wordService.getDocxFile(docxId);
        try {
            if (!docx) {
                return res.status(404).json({
                    status: "failed",
                    message: "Docx file not found!",
                });
            }
            const inputFilePath = `./storage/${docx.docxId}/original.${docx.extension}`;
            const outputDirectory = `./storage/${docx.docxId}`;
            yield libreoffice.convertDocxToPDF(inputFilePath, outputDirectory);
            res.status(200).json({
                status: "success",
                message: "Docx File converted to PDF successfully",
            });
        }
        catch (e) {
            if (docx) {
                yield util_1.util.deleteFile(`./storage/${docx.docxId}/original.pdf}`);
                res.status(500).json({
                    status: "failed",
                    message: "Operation failed!",
                });
            }
        }
    });
}
function getDocx(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { docxId } = req.params;
        const docx = wordService.getDocxFile(docxId);
        try {
            if (!docx) {
                return res.status(404).json({
                    status: "Failed",
                    message: "PDF not found",
                });
            }
            res.status(200).send(docx);
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
