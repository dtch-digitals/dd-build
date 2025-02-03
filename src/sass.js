"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSass = buildSass;
const sass_1 = __importDefault(require("sass"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to build and minify SASS
function buildSass() {
    const cwd = process.cwd();
    const outputDir = path_1.default.join(cwd, "assets/dist");
    const outputFile = path_1.default.join(outputDir, "dd_style.css");
    const outputMapFile = path_1.default.join(outputDir, "dd_style.css.map");
    // If dist dir does not exits, create it
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    try {
        const sassResult = sass_1.default.compile(path_1.default.join(cwd, "_src/sass/style.scss"), {
            style: "compressed",
            sourceMap: true,
            loadPaths: [path_1.default.join(cwd, "_src/sass")],
        });
        fs_1.default.writeFileSync(outputFile, sassResult.css);
        fs_1.default.appendFileSync(outputFile, `/*# sourceMappingURL=${path_1.default.basename(outputMapFile)} */`); // Ensure the source map reference is added to the CSS file
        if (sassResult.sourceMap) {
            fs_1.default.writeFileSync(outputMapFile, JSON.stringify(sassResult.sourceMap));
        }
        console.info("SASS compiled and CSS minified successfully.");
    }
    catch (error) {
        console.error("Error during SASS compilation/minification:", error);
    }
}
