"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSass = buildSass;
exports.watchSass = watchSass;
const sass_1 = __importDefault(require("sass"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const chokidar_1 = __importDefault(require("chokidar"));
const utils_1 = require("./utils");
const cwd = process.cwd();
const sassDir = path_1.default.join(cwd, "_src/sass");
// Function to build and minify SASS
function buildSass() {
    const outputDir = path_1.default.join(cwd, "assets/dist");
    const outputFile = path_1.default.join(outputDir, "dd_style.css");
    const outputMapFile = path_1.default.join(outputDir, "dd_style.css.map");
    // Add breakpoints to setup file
    generateBreakpointMixins();
    (0, utils_1.moveFile)(path_1.default.join(sassDir, "setup.scss"), path_1.default.join(sassDir, ".setup.scss.bu"));
    (0, utils_1.moveFile)(path_1.default.join(sassDir, ".setup.scss"), path_1.default.join(sassDir, "setup.scss"));
    // If dist dir does not exits, create it
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    try {
        const sassResult = sass_1.default.compile(path_1.default.join(sassDir, "style.scss"), {
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
    // Move the original options file back
    (0, utils_1.removeFile)(path_1.default.join(sassDir, "setup.scss"));
    (0, utils_1.moveFile)(path_1.default.join(sassDir, ".setup.scss.bu"), path_1.default.join(sassDir, "setup.scss"));
}
function watchSass() {
    const buildSassDebounced = (0, lodash_debounce_1.default)(buildSass, 300);
    const watcher = chokidar_1.default.watch([sassDir, path_1.default.join(cwd, "package.json")], {
        ignored: path_1.default.join(cwd, "assets/**"),
        persistent: true,
    });
    watcher.on("add", buildSassDebounced).on("change", buildSassDebounced).on("unlink", buildSassDebounced);
    console.log("Watching for SCSS changes...");
}
function generateBreakpointMixins() {
    const originalMixinPath = path_1.default.join(sassDir, "setup.scss");
    const hiddenMixinPath = path_1.default.join(sassDir, `.setup.scss`);
    const breakpoints = (0, utils_1.getOption)("breakpoints");
    let newSassMixinsString = "";
    for (const prop in breakpoints) {
        if (Object.hasOwnProperty.call(breakpoints, prop)) {
            const values = breakpoints[prop];
            for (const value of values) {
                const mixinName = `${prop}-${value}`;
                const mixinBlock = `@mixin ${mixinName} {
					@media only screen and (${prop}: ${value}px) {
						@content;
					}
				}
				`;
                newSassMixinsString += mixinBlock;
            }
        }
    }
    try {
        let existingContent = "";
        if (fs_1.default.existsSync(originalMixinPath)) {
            existingContent = fs_1.default.readFileSync(originalMixinPath, "utf8");
        }
        const finalContent = existingContent + "\n" + newSassMixinsString;
        // const finalContent = newSassMixinsString + "\n" + existingContent;
        fs_1.default.writeFileSync(hiddenMixinPath, finalContent, "utf8");
        // fs.writeFileSync(hiddenMixinPath, finalContent, "utf8");
        console.log(`Successfully prepended mixins to SASS setup`);
    }
    catch (err) {
        console.error(`Error prepending mixins to file: ${err.message}`);
    }
}
