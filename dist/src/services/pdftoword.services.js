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
exports.PDFToWordService = void 0;
const DB_1 = require("../DB");
const util_1 = require("../../lib/util");
const promises_1 = __importDefault(require("fs/promises"));
class PDFToWordService {
    constructor() {
        this.db = new DB_1.DB();
        // if server restarts, we need to restart delete operations that never completed.
        this.db.pdf.forEach((pdf) => {
            if (this.db.pdf.length >= 0) {
                const pdfId = pdf.pdfId;
                this.deletePDFAfter10Minutes(pdfId);
            }
            return;
        });
    }
    uploadPDF(details) {
        return __awaiter(this, void 0, void 0, function* () {
            // upload to storage and save to artificial DB
            this.db.update();
            this.db.pdf.unshift({
                id: this.db.pdf.length,
                pdfId: details.pdfId,
                name: details.name,
                extension: details.extension,
            });
            this.db.save();
        });
    }
    getPDF(pdfId) {
        return __awaiter(this, void 0, void 0, function* () {
            // tell the db we have a text file for the just uploaded pdf file.
            this.db.update();
            const pdf = this.db.pdf.find((pdf) => pdf.pdfId === pdfId);
            this.db.save();
            return pdf;
        });
    }
    deletePDFAfter10Minutes(pdfId) {
        return __awaiter(this, void 0, void 0, function* () {
            // delete the pdf file after 10 minutes
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.db.update();
                const pdfIndex = this.db.pdf.findIndex((pdf) => pdf.pdfId === pdfId);
                if (pdfIndex !== -1) {
                    this.db.pdf.splice(pdfIndex, 1);
                    this.db.save();
                    // delete the folder
                    try {
                        const folderPath = `./storage/${pdfId}`;
                        const stat = yield promises_1.default.stat(folderPath);
                        if (stat.isDirectory()) {
                            yield util_1.util.deleteFolder(folderPath);
                        }
                    }
                    catch (e) {
                        if (e.code === "ENOENT") {
                            console.error(`Folder doesn't exist: ${e.message}`);
                        }
                        else {
                            console.error(`Error deleting folder: ${e.message}`);
                        }
                    }
                }
            }), 3 * 60 * 1000);
        });
    }
}
exports.PDFToWordService = PDFToWordService;
