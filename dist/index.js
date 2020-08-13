"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("./models/page");
var StartApp = /** @class */ (function () {
    function StartApp() {
        var dvach = new page_1.Page('https://2ch.hk/b/arch/2020-08-03/res/225828565.html');
        dvach.downloadAll();
    }
    return StartApp;
}());
var app = new StartApp();
