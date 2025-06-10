"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBrowserSync = runBrowserSync;
const browser_sync_1 = __importDefault(require("browser-sync"));
const utils_1 = require("./utils");
function runBrowserSync() {
    const host = (0, utils_1.getOption)("browser-sync-host");
    browser_sync_1.default.create().init({
        proxy: host,
        files: [
            "./assets/**/*.css",
            "./assets/**/*.js",
            "**/*.php",
            "!**/includes/**/*.php",
        ],
        snippetOptions: {
            ignorePaths: "wp-admin/**",
        },
        notify: false,
        open: false,
    });
}
