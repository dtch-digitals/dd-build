"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJS = buildJS;
const concat_1 = __importDefault(require("concat"));
const uglify_js_1 = __importDefault(require("uglify-js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function buildJS() {
    const cwd = process.cwd();
    const jsDir = path_1.default.join(cwd, "_src/js");
    const outputDir = path_1.default.join(cwd, "assets/dist"); // Updated output directory
    const outputFile = path_1.default.join(outputDir, "main.js"); // Updated output file path
    const outputMapFile = path_1.default.join(outputDir, "main.js.map"); // Updated source map file path
    // If dist dir does not exits, create it
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    const files = findJSFiles(jsDir);
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
// Function to recursively find all .js files
function findJSFiles(dir, fileList = []) {
    const files = fs_1.default.readdirSync(dir);
    files.forEach(file => {
        const filePath = path_1.default.join(dir, file);
        const fileStat = fs_1.default.statSync(filePath);
        if (fileStat.isDirectory()) {
            findJSFiles(filePath, fileList); // Recurse into subdirectories
        }
        else if (filePath.endsWith(".js")) {
            fileList.push(filePath);
        }
    });
    return fileList;
}
