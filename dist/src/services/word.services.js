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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordService = void 0;
const DB_1 = require("../DB");
const util_1 = require("../../lib/util");
class WordService {
    constructor() {
        this.db = new DB_1.DB();
    }
    uploadDocxFile(details) {
        return __awaiter(this, void 0, void 0, function* () {
            // upload to storage and save to artificial DB
            this.db.update();
            this.db.docx.unshift({
                id: this.db.docx.length,
                docxId: details.docxId,
                name: details.name,
                extension: details.extension,
            });
            this.db.save();
        });
    }
    getDocxFile(docxId) {
        return __awaiter(this, void 0, void 0, function* () {
            // tell the db we have a text file for the just uploaded pdf file.
            this.db.update();
            const docx = this.db.docx.find((docx) => docx.docxId === docxId);
            return docx;
        });
    }
    deleteDocxAfter5Minutes(pdfId) {
        return __awaiter(this, void 0, void 0, function* () {
            // delete the docx file after 5 minutes
            setTimeout(() => {
                this.db.update();
                const pdfIndex = this.db.pdf.findIndex((pdf) => pdf.pdfId === pdfId);
                if (pdfIndex !== -1) {
                    util_1.util.deleteFolder(`./storage/${pdfId}`);
                    this.db.pdf.splice(pdfIndex, 1);
                    this.db.save();
                }
            }, 5 * 60 * 1000);
        });
    }
}
exports.WordService = WordService;
