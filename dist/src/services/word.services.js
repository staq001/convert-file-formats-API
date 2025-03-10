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
}
exports.WordService = WordService;
