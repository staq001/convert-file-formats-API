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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
exports.convertPDFToText = convertPDFToText;
exports.convertPDFToHTML = convertPDFToHTML;
exports.convertPDFToWord = convertPDFToWord;
exports.convertPDFToPNG = convertPDFToPNG;
exports.compressPDF = compressPDF;
exports.mergePF = mergePF;
exports.getPDF = getPDF;
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const promises_1 = __importDefault(require("node:fs/promises"));
const promises_2 = require("node:stream/promises");
const util_1 = require("../../lib/util");
const pdftoword_services_1 = require("../services/pdftoword.services");
const poppler = __importStar(require("../../lib/poppler"));
const gs = __importStar(require("../../lib/ghostscript"));
const libreoffice = __importStar(require("../../lib/libreoffice"));
const word_services_1 = require("../services/word.services");
const wordService = new word_services_1.WordService();
const PDFtoWordService = new pdftoword_services_1.PDFToWordService();
function uploadFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const specifiedFileName = req.headers.filename;
        const extension = typeof specifiedFileName === "string"
            ? node_path_1.default.extname(specifiedFileName).substring(1).toLowerCase()
            : undefined;
        const name = typeof specifiedFileName === "string"
            ? node_path_1.default.parse(specifiedFileName).name
            : "unspecified name";
        let id = node_crypto_1.default.randomBytes(4).toString("hex");
        try {
            switch (extension) {
                case "pdf":
                    const pdfId = id;
                    yield promises_1.default.mkdir(`./storage/${pdfId}`, { recursive: true });
                    const fullPath = `./storage/${pdfId}/original.${extension}`;
                    const file = yield promises_1.default.open(fullPath, "w");
                    const fileStream = file.createWriteStream();
                    yield (0, promises_2.pipeline)(req, fileStream);
                    yield file.close();
                    yield PDFtoWordService.uploadPDF({ extension, pdfId, name });
                    break;
                case "docx":
                    const docxId = id;
                    yield promises_1.default.mkdir(`./storage/${docxId}`, { recursive: true });
                    const originalPath = `./storage/${docxId}/original.${extension}`;
                    const docxFile = yield promises_1.default.open(originalPath, "w");
                    const docxFileStream = docxFile.createWriteStream();
                    yield (0, promises_2.pipeline)(req, docxFileStream);
                    docxFile.close();
                    yield wordService.uploadDocxFile({ extension, docxId, name });
                    break;
            }
            res.status(201).json({
                status: "success",
                message: "The file was successfully uploaded!",
                id,
                fileType: extension,
            });
        }
        catch (e) {
            // Delete the folder
            yield util_1.util.deleteFolder(`./storage/${id}`);
            res.status(500).json({
                status: "failed!",
                message: `Operation failed! ${e}`,
            });
        }
    });
}
function convertPDFToText(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF file not found" });
            }
            const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
            const textPath = `./storage/${pdf.pdfId}/original.txt`;
            yield poppler.makeText(originalPath, textPath);
            res.status(200).json({
                status: "success",
                message: ".TXT file made successfully!",
            });
        }
        catch (e) {
            if (pdf) {
                yield util_1.util.deleteFile(`./storage/${pdf.pdfId}/original.txt`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function convertPDFToHTML(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF file not found" });
            }
            yield promises_1.default.mkdir(`./storage/${pdf.pdfId}/html/`, { recursive: true });
            const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
            const htmlPath = `./storage/${pdf.pdfId}/html/original.html`;
            yield poppler.makeHTML(originalPath, htmlPath);
            res.status(200).json({
                status: "success",
                message: "HTML file made successfully!",
            });
        }
        catch (e) {
            if (pdf) {
                yield util_1.util.deleteFile(`./storage/${pdf.pdfId}/original.txt`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function convertPDFToWord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF file not found" });
            }
            const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
            const outputDirectory = `./storage/${pdf.pdfId}/`;
            yield libreoffice.convertPDFToDocx(originalPath, outputDirectory);
            res.status(200).json({
                status: "success",
                message: "Word document made successfully!",
            });
        }
        catch (e) {
            if (pdf) {
                yield util_1.util.deleteFolder(`./storage/${pdf.pdfId}`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function convertPDFToPNG(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF file not found" });
            }
            yield promises_1.default.mkdir(`./storage/${pdf.pdfId}/pdf-image-folder/`, {
                recursive: true,
            });
            const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
            const imagePath = `./storage/${pdf.pdfId}/pdf-image-folder/original.png`;
            yield poppler.makeImage(originalPath, imagePath);
            res.status(200).json({
                status: "Success",
                message: "PDF converted to PNG successfully.",
            });
        }
        catch (e) {
            if (pdf) {
                yield util_1.util.deleteFolder(`./storage/${pdf.pdfId}/pdf-image-folder/`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function compressPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF file not found" });
            }
            const originalPath = `./storage/${pdf.pdfId}/original.${pdf.extension}`;
            const destination = `./storage/${pdf.pdfId}/original-compressed.pdf`;
            yield gs.compressPDF(originalPath, destination);
            res.status(200).json({
                status: "Success",
                message: "PDF file compressed successfully!",
            });
        }
        catch (e) {
            if (pdf) {
                yield util_1.util.deleteFolder(`./storage/${pdf.pdfId}/original-compressed.pdf`);
                yield util_1.util.deleteFile(`./storage/${pdf.pdfId}/original.${pdf.extension}`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function mergePF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstPdfId, secondPdfId } = req.params;
        const first = yield PDFtoWordService.getPDF(firstPdfId);
        const second = yield PDFtoWordService.getPDF(secondPdfId);
        try {
            if (!first || !second) {
                return res
                    .status(404)
                    .json({ status: "failed", message: "PDF files not found" });
            }
            const firstFilePath = `./storage/${first.pdfId}/original.${first.extension}`;
            const secondFilePath = `./storage/${second.pdfId}/original.${second.extension}`;
            yield promises_1.default.mkdir(`./storage/${first.pdfId}-${second.pdfId}/`, {
                recursive: true,
            });
            const mergedFileDestination = `./storage/${first.pdfId}-${second.pdfId}/${first.name}-${second.name}-merged.pdf`;
            yield poppler.mergePDF(firstFilePath, secondFilePath, mergedFileDestination);
            res.status(200).json({
                status: "Success",
                message: "PDF files merged successfully!",
            });
        }
        catch (e) {
            if (first && second) {
                yield util_1.util.deleteFile(`./storage/${first.pdfId}-${second.pdfId}/merged.pdf/`);
            }
            res.status(500).json({
                status: "Failed",
                message: `Operation Failed ${e}`,
            });
        }
    });
}
function getPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pdfId } = req.params;
        const pdf = yield PDFtoWordService.getPDF(pdfId);
        try {
            if (!pdf) {
                return res.status(404).json({
                    status: "Failed",
                    message: "PDF not found",
                });
            }
            res.status(200).send(pdf);
        }
        catch (e) {
            res.status(500).send(`An error occured: ${e}`);
        }
    });
}
