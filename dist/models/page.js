"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var htmlParser = __importStar(require("node-html-parser"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var Page = /** @class */ (function () {
    function Page(url) {
        this.url = url;
        var temp = url.split('.');
        this.archUrl = temp[0] + '.' + temp[1];
        this.archUrl = this.archUrl.replace('res', 'src');
    }
    Page.prototype.loadPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default({
                            method: 'GET',
                            url: this.url
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    Page.prototype.parsePage = function (loadedPage) {
        var parseResult = htmlParser.parse(loadedPage);
        var elements = parseResult.querySelectorAll('.post__image-link');
        return elements;
    };
    Page.prototype.getHrefAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadedPage, mediaElements, hrefAttrArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadPage()];
                    case 1:
                        loadedPage = _a.sent();
                        mediaElements = this.parsePage(loadedPage);
                        hrefAttrArr = [];
                        mediaElements.forEach(function (element) {
                            hrefAttrArr.push(element.rawAttributes && element.rawAttributes.href);
                        });
                        return [2 /*return*/, hrefAttrArr];
                }
            });
        });
    };
    Page.prototype.prepareDownloadObject = function (hrefAttr) {
        var res = [];
        if (hrefAttr) {
            hrefAttr.forEach(function (element) {
                var fileExtension = element.split('.')[1];
                var fileName = element.split('.')[0].split('/');
                res.push({ url: fileName[fileName.length - 1], extension: fileExtension });
            });
        }
        return res;
    };
    Page.prototype.getAndMapDownloadObjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHrefAttributes()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this.prepareDownloadObject(res)];
                }
            });
        });
    };
    Page.prototype.downloadAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var downloadObjects, d, i, pathToFile, writer, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAndMapDownloadObjects()];
                    case 1:
                        downloadObjects = _a.sent();
                        d = 0;
                        if (!downloadObjects.length) return [3 /*break*/, 9];
                        console.log(downloadObjects.length);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < downloadObjects.length)) return [3 /*break*/, 9];
                        pathToFile = path_1.default.resolve(__dirname, '../../files', '2ch' + Date.now() + i + '.' + downloadObjects[i].extension);
                        writer = fs_1.default.createWriteStream(pathToFile);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, 7, 8]);
                        return [4 /*yield*/, axios_1.default({
                                url: this.archUrl + '/' + downloadObjects[i].url + '.' + downloadObjects[i].extension,
                                method: 'GET',
                                responseType: 'stream'
                            })];
                    case 4:
                        response = _a.sent();
                        return [4 /*yield*/, response.data.pipe(writer)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 8];
                    case 7:
                        d++;
                        console.log(i);
                        return [7 /*endfinally*/];
                    case 8:
                        i++;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Page;
}());
exports.Page = Page;
