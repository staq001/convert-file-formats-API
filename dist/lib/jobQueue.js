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
exports.JobQueue = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const poppler = __importStar(require("./poppler"));
const gs = __importStar(require("./ghostscript"));
const util_1 = require("../lib/util");
class JobQueue {
    constructor() {
        this.jobs = [];
        this.currentJob = null;
    }
    enqueue(job) {
        return new Promise((resolve, reject) => {
            job.resolve = resolve;
            job.reject = reject;
            this.jobs.push(job);
            this.executeNext();
        });
    }
    dequeue() {
        return this.jobs.shift();
    }
    executeNext() {
        if (this.currentJob)
            return;
        this.currentJob = this.dequeue();
        if (!this.currentJob)
            return;
        this.execute(this.currentJob);
    }
    execute(job) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            switch (job.type) {
                // merge pdf-
                case "merge":
                    const [first, second] = job.id.split("-");
                    const firstFilePath = `./storage/${first}/original.${job.file_extension}`;
                    const secondFilePath = `./storage/${second}/original.${job.file_extension}`;
                    const mergedFileDestination = `./storage/${first}/merged-file.pdf`;
                    try {
                        yield poppler.mergePDF(firstFilePath, secondFilePath, mergedFileDestination);
                        (_a = job.resolve) === null || _a === void 0 ? void 0 : _a.call(job);
                        console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
                    }
                    catch (e) {
                        yield util_1.util.deleteFolder(`./storage/${first}-${second}/`);
                        (_b = job.reject) === null || _b === void 0 ? void 0 : _b.call(job, e);
                    }
                    break;
                // compress pdf
                case "compress":
                    const originalPath = `./storage/${job.id}/original.${job.file_extension}`;
                    const destination = `./storage/${job.id}/original-compressed.pdf`;
                    try {
                        yield gs.compressPDF(originalPath, destination);
                        (_c = job.resolve) === null || _c === void 0 ? void 0 : _c.call(job);
                        console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
                    }
                    catch (e) {
                        yield util_1.util.deleteFile(destination);
                        (_d = job.reject) === null || _d === void 0 ? void 0 : _d.call(job, e);
                    }
                    break;
                // all conversions.
                case "convertPdf":
                    switch (job.dest_extension) {
                        case "txt":
                            const originalPath = `./storage/${job.id}/original.${job.file_extension}`;
                            const textPath = `./storage/${job.id}/original.${job.dest_extension}`;
                            try {
                                yield poppler.makeText(originalPath, textPath);
                                (_e = job.resolve) === null || _e === void 0 ? void 0 : _e.call(job);
                                console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
                            }
                            catch (e) {
                                util_1.util.deleteFile(textPath);
                                (_f = job.reject) === null || _f === void 0 ? void 0 : _f.call(job, e);
                            }
                            break;
                        case "html":
                            yield promises_1.default.mkdir(`./storage/${job.id}/html/`, { recursive: true });
                            const inputFilePath = `./storage/${job.id}/original.${job.file_extension}`;
                            const htmlPath = `./storage/${job.id}/html/original.${job.dest_extension}`;
                            try {
                                yield poppler.makeHTML(inputFilePath, htmlPath);
                                (_g = job.resolve) === null || _g === void 0 ? void 0 : _g.call(job);
                                console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
                            }
                            catch (e) {
                                yield util_1.util.deleteFolder(`./storage/${job.id}/html/`);
                                (_h = job.reject) === null || _h === void 0 ? void 0 : _h.call(job, e);
                            }
                            break;
                        case "png":
                            yield promises_1.default.mkdir(`./storage/${job.id}/pdf-image-folder/`, {
                                recursive: true,
                            });
                            const filePath = `./storage/${job.id}/original.${job.file_extension}`;
                            const imagePath = `./storage/${job.id}/pdf-image-folder/original.${job.dest_extension}`;
                            try {
                                yield poppler.makeImage(filePath, imagePath);
                                (_j = job.resolve) === null || _j === void 0 ? void 0 : _j.call(job);
                                console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
                            }
                            catch (e) {
                                yield util_1.util.deleteFolder(`./storage/${job.id}/pdf-image-folder/`);
                                (_k = job.reject) === null || _k === void 0 ? void 0 : _k.call(job, e);
                            }
                            break;
                        case "docx":
                            // write logic later
                            break;
                    }
                    break;
                case "convertDocx":
                    // write logic.
                    break;
            }
            this.currentJob = null;
            this.executeNext();
        });
    }
}
exports.JobQueue = JobQueue;
