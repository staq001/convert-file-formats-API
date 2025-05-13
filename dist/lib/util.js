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
exports.util = void 0;
const fs = __importStar(require("node:fs/promises"));
// Delete a file/folder if it exists, else throw an error.
exports.util = {
    deleteFile: (path) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fs.unlink(path);
        }
        catch (err) {
            throw new Error(`${err}`);
        }
    }),
    deleteFolder: (path) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fs.rm(path, { recursive: true });
        }
        catch (err) {
            throw new Error(`${err}`);
        }
    }),
    checkPath: (path) => __awaiter(void 0, void 0, void 0, function* () {
        return fs
            .access(path, fs.constants.F_OK)
            .then(() => {
            // do nothing
        })
            .catch(() => __awaiter(void 0, void 0, void 0, function* () {
            yield fs.mkdir(path);
        }));
    }),
    fiveMinutesThenDelete: (path) => __awaiter(void 0, void 0, void 0, function* () {
        // do nothing
    }),
};
// question is, why not put it in the service? that way we delete the record from the db and delete the actual storage of the folders and files as well?
