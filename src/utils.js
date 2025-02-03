"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findJSFiles = findJSFiles;
exports.getOption = getOption;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
// Read options from package.json
function getOption(option) {
    const packageJsonPath = path_1.default.join(process.cwd(), "package.json");
    if (fs_1.default.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        const myPackageConfig = packageJson["dd-build"];
        if (myPackageConfig) {
            return myPackageConfig[option];
        }
        else {
            console.warn("No configuration found for 'dd-build' in package.json.");
        }
    }
    else {
        console.error("Could not locate package.json in the current working directory.");
    }
}
