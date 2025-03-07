/**VARIABLES */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d, _e, _f;
var _this = this;
var uploadFileBtn = document.getElementById("uploadFile");
var uploadFileBtn2 = document.getElementById("uploadFile2");
var mergePDFBtn = document.getElementById("merge-pdf");
var compressPDFBtn = document.getElementById("compress-pdf");
var downloadPDFBtn = document.getElementById("download-pdf");
var pdftoDocxBtn = document.getElementById("convert-pdf");
var docxToHtmlBtn = document.getElementById("convert-docx-to-html");
var pdfToJpegBtn = document.getElementById("convert-pdf-to-jpeg");
var docxToPdfBtn = document.getElementById("convert-docx-to-pdf");
/**FUNCTIONS */
function toggleButton(button1, button2, value) {
    button1.style.display = "none";
    button2.style.display = "block";
    if (value)
        button2.setAttribute("appropos", value);
}
function fetchUrl(url_1, message_1, method_1, error_1) {
    return __awaiter(this, arguments, void 0, function (url, message, method, error, body, headers) {
        var response, e_1;
        if (body === void 0) { body = undefined; }
        if (headers === void 0) { headers = undefined; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: headers,
                            body: body,
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        alert(message); // same
                        return [2 /*return*/, response.json()];
                    }
                    else
                        console.error(error);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error("An error occurred--", e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var click = 0;
uploadFileBtn2.addEventListener("click", function () {
    var fileInput = document.getElementById("fileInput");
    click++;
    console.log(click);
    fileInput.click();
    var attribute = uploadFileBtn.getAttribute("appropos");
    mergePDFBtn.setAttribute("second", attribute);
});
uploadFileBtn.addEventListener("click", function () {
    var fileInput = document.getElementById("fileInput");
    click++;
    fileInput.click();
});
switch (window.location.href.split("pages")[1].toString()) {
    case "/compresspdf.html":
        (_a = document
            .getElementById("fileInput")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, compressPDFBtn, response.id);
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        compressPDFBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = compressPDFBtn.getAttribute("appropos");
                        return [4 /*yield*/, fetchUrl("/api/compress-pdf/".concat(attribute), "PDF File compressed successfully", "PUT", "Compression Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(compressPDFBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
    case "/pdftodocx.html":
        (_b = document
            .getElementById("fileInput")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, pdftoDocxBtn, response.id);
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        pdftoDocxBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = pdftoDocxBtn.getAttribute("appropos");
                        return [4 /*yield*/, fetchUrl("/api/convert-pdf-to-word/".concat(attribute), "PDF File converted to Docx successfully", "PUT", "Conversion Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(pdftoDocxBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
    case "/docxtohtml.html":
        (_c = document
            .getElementById("fileInput")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, docxToHtmlBtn, response.id);
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        docxToHtmlBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = docxToHtmlBtn.getAttribute("appropos");
                        return [4 /*yield*/, fetchUrl("/api/convert-word-to-html/".concat(attribute), "Docx File converted to HTML successfully", "PUT", "Conversion Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(docxToHtmlBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
    case "/pdftojpeg.html":
        (_d = document
            .getElementById("fileInput")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, pdfToJpegBtn, response.id);
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        pdfToJpegBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = pdfToJpegBtn.getAttribute("appropos");
                        return [4 /*yield*/, fetchUrl("/api/convert-pdf-to-jpeg/".concat(attribute), "PDF File converted to JPEG successfully", "PUT", "Conversion Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(pdfToJpegBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
    case "/docxtopdf.html":
        (_e = document
            .getElementById("fileInput")) === null || _e === void 0 ? void 0 : _e.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, docxToPdfBtn, response.id);
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        docxToPdfBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = docxToPdfBtn.getAttribute("appropos");
                        return [4 /*yield*/, fetchUrl("/api/convert-docx-to-pdf/".concat(attribute), "DOCX File converted to PDF successfully", "PUT", "Conversion Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(docxToPdfBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
    case "/mergepdf.html":
        (_f = document
            .getElementById("fileInput")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var target, file, fd, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        target = event.target;
                        if (!target.files) return [3 /*break*/, 2];
                        file = target.files[0];
                        fd = new FormData();
                        fd.append("file", file);
                        return [4 /*yield*/, fetchUrl("/api/upload-file", "File uploaded successfully!", "POST", "Upload failed!", fd, {
                                filename: file.name,
                            })];
                    case 1:
                        response = _a.sent();
                        toggleButton(uploadFileBtn, uploadFileBtn2, response.id);
                        if (click > 1) {
                            toggleButton(uploadFileBtn2, mergePDFBtn, response.id);
                        }
                        console.log(response);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        mergePDFBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var attribute, secondAttribute, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attribute = mergePDFBtn.getAttribute("appropos");
                        secondAttribute = mergePDFBtn.getAttribute("second");
                        console.log(attribute, secondAttribute);
                        return [4 /*yield*/, fetchUrl("/api/merge-pdf/".concat(attribute, "/").concat(secondAttribute), "PDF Files Merged Successfully!", "PUT", "Merge Failed")];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "success") {
                            toggleButton(mergePDFBtn, downloadPDFBtn);
                        }
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        }); });
        break;
}
