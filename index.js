#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sass_1 = require("./src/sass");
const js_1 = require("./src/js");
const args = process.argv.slice(2);
if (args[0] === "sass") {
    (0, sass_1.buildSass)();
}
if (args[0] === "js") {
    (0, js_1.buildJS)();
}
