#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sass_1 = require("./src/sass");
const js_1 = require("./src/js");
const browser_sync_1 = require("./src/browser-sync");
const args = process.argv.slice(2);
if (args[0] === "sass") {
    if (args[1] === "--watch") {
        (0, sass_1.watchSass)();
    }
    else {
        (0, sass_1.buildSass)();
    }
}
if (args[0] === "js") {
    if (args[1] === "--watch") {
        (0, js_1.watchJS)();
    }
    else {
        (0, js_1.buildJS)();
    }
}
if (args[0] === "browser-sync") {
    (0, browser_sync_1.runBrowserSync)();
}
