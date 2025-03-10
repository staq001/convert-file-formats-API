"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressPDF = compressPDF;
exports.pdftoJpeg = pdftoJpeg;
exports.pdfToHtml = pdfToHtml;
exports.pdfToTxt = pdfToTxt;
exports.mergePDF = mergePDF;
const promises_1 = __importDefault(require("node:fs/promises"));
const pdftoword_services_1 = require("../services/pdftoword.services");
const word_services_1 = require("../services/word.services");
const archiver_1 = __importDefault(require("archiver"));
const wordService = new word_services_1.WordService();
const PDFtoWordService = new pdftoword_services_1.PDFToWordService();
function compressPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res.status(404).json({
                    status: "Failed",
                    message: "File not found",
                });
            }
            if (pdf) {
                const customName = pdf.name ? pdf.name : "file";
                yield promises_1.default.access(`./storage/${pdf.pdfId}/original-compressed.pdf`, promises_1.default.constants.F_OK);
                res.download(`./storage/${pdf.pdfId}/original-compressed.pdf`, `${customName}.pdf`);
            }
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
function pdftoJpeg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res.status(404).json({
                    status: "Failed",
                    message: "File not found",
                });
            }
            if (pdf) {
                const customName = pdf.name ? pdf.name : "file";
                const folder = `./storage/${pdf.pdfId}/pdf-image-folder/`;
                const folderExists = yield promises_1.default.lstat(folder);
                if (!folderExists) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "Folder not found",
                    });
                }
                res.setHeader("Content-Type", "application/zip");
                res.setHeader("Content-Disposition", `attachment; filename=${customName}.zip`);
                const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
                archive.pipe(res);
                archive.directory(folder, false);
                archive.finalize();
            }
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
function pdfToHtml(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res.status(404).json({
                    status: "Failed",
                    message: "File not found",
                });
            }
            if (pdf) {
                const customName = pdf.name ? pdf.name : "file";
                const folder = `./storage/${pdf.pdfId}/html/`;
                const folderExists = yield promises_1.default.lstat(folder);
                if (!folderExists) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "Folder not found",
                    });
                }
                res.setHeader("Content-Type", "application/zip");
                res.setHeader("Content-Disposition", `attachment; filename=${customName}.zip`);
                const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
                archive.pipe(res);
                archive.directory(folder, false);
                archive.finalize();
            }
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
function pdfToTxt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res.status(404).json({
                    status: "Failed",
                    message: "File not found",
                });
            }
            if (pdf) {
                const customName = pdf.name ? pdf.name : "file";
                yield promises_1.default.access(`./storage/${pdf.pdfId}/original.txt`, promises_1.default.constants.F_OK);
                res.download(`./storage/${pdf.pdfId}/original.txt`, `${customName}.txt`);
            }
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
function mergePDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstPdfId, secondPdfId } = req.params;
        const first = yield PDFtoWordService.getPDF(firstPdfId);
        const second = yield PDFtoWordService.getPDF(secondPdfId);
        try {
            if (!first || !second) {
                return res.status(404).json({
                    status: "Failed",
                    message: "File not found",
                });
            }
            if (first && second) {
                const customName = first.name
                    ? second.name
                        ? `${first.name}-${second.name}`
                        : "file"
                    : "file";
                yield promises_1.default.access(`./storage/${first.pdfId}-${second.pdfId}/${first.name}-${second.name}-merged.pdf`, promises_1.default.constants.F_OK);
                res.download(`./storage/${first.pdfId}-${second.pdfId}/${first.name}-${second.name}-merged.pdf`, `${customName}.pdf`);
            }
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
