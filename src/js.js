"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJS = buildJS;
exports.watchJS = watchJS;
const concat_1 = __importDefault(require("concat"));
const uglify_js_1 = __importDefault(require("uglify-js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const utils_1 = require("./utils");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const cwd = process.cwd();
const jsDir = path_1.default.join(cwd, "_src/js");
function buildJS() {
    const outputDir = path_1.default.join(cwd, "assets/dist"); // Updated output directory
    const outputFile = path_1.default.join(outputDir, "main.js"); // Updated output file path
    const outputMapFile = path_1.default.join(outputDir, "main.js.map"); // Updated source map file path
    // If dist dir does not exits, create it
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    const files = (0, utils_1.findJSFiles)(jsDir);
    (0, concat_1.default)(files).then(result => {
        // @ts-expect-error type is unknown
        const minified = uglify_js_1.default.minify(result, {
            sourceMap: {
                filename: "main.js",
                url: "main.js.map"
            }
        });
        if (minified.error) {
            console.error("Error minifying JS:", minified.error);
            return;
        }
        fs_1.default.writeFileSync(outputFile, minified.code);
        if (minified.map) {
            fs_1.default.writeFileSync(outputMapFile, minified.map);
        }
        console.log("JS concatenated and minified successfully.");
    }).catch(error => {
        console.error("Error during JS concatenation/minification:", error);
    });
}
function watchJS() {
    const buildJSDebounced = (0, lodash_debounce_1.default)(buildJS, 300);
    const watcher = chokidar_1.default.watch(jsDir, {
        ignored: path_1.default.join(cwd, 'assets/**'),
        persistent: true,
    });
    watcher
        .on('add', buildJSDebounced)
        .on('change', buildJSDebounced)
        .on('unlink', buildJSDebounced);
    console.log('Watching JS files for changes...');
}
