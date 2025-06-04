"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.moveFile = exports.getOption = exports.findJSFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to recursively find all .js files
function findJSFiles(dir, fileList = []) {
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
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
exports.findJSFiles = findJSFiles;
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
exports.getOption = getOption;
/**
 * Synchronously moves a file from a source path to a destination path.
 * This function will create the destination directory if it does not exist.
 * If the destination file already exists, it will be overwritten by the move.
 *
 * @param {string} sourcePath The path to the source file.
 * @param {string} destinationPath The path to the destination file (including the new filename).
 * @throws {Error} If source or destination paths are not provided,
 *                 if the source file does not exist, or if the move operation fails.
 */
function moveFile(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) {
        throw new Error("Source and destination paths must be provided.");
    }
    if (!fs_1.default.existsSync(sourcePath)) {
        throw new Error(`Source file not found: "${sourcePath}"`);
    }
    try {
        const destinationDir = path_1.default.dirname(destinationPath);
        if (!fs_1.default.existsSync(destinationDir)) {
            // Create the destination directory recursively if it doesn't exist
            fs_1.default.mkdirSync(destinationDir, { recursive: true });
        }
        fs_1.default.renameSync(sourcePath, destinationPath);
    }
    catch (error) {
        // Provide a more contextual error message
        throw new Error(`Failed to move file from "${sourcePath}" to "${destinationPath}": ${error.message}`);
    }
}
exports.moveFile = moveFile;
/**
 * Synchronously removes a file if it exists.
 * Does not throw an error if the file does not exist.
 *
 * @param {string} filePath The path to the file to be removed.
 * @returns {boolean} True if the file was successfully removed or did not exist initially.
 *                    False if an error occurred during the removal attempt of an existing file
 *                    (e.g., permission issues).
 * @throws {Error} If filePath is not provided.
 */
function removeFile(filePath) {
    if (!filePath) {
        throw new Error("File path must be provided.");
    }
    if (!fs_1.default.existsSync(filePath)) {
        return true; // File doesn't exist, so operation is successful in effect.
    }
    try {
        fs_1.default.unlinkSync(filePath);
        return true; // File successfully removed.
    }
    catch (error) {
        // An error occurred trying to remove an existing file.
        // The caller can decide to log this error or handle it.
        // Example: console.error(`Failed to remove file "${filePath}": ${error.message}`);
        return false;
    }
}
exports.removeFile = removeFile;
