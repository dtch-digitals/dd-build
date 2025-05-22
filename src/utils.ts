import fs from "fs";
import path from "path";

// Function to recursively find all .js files
export function findJSFiles(dir: string, fileList: Array<string> = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            findJSFiles(filePath, fileList); // Recurse into subdirectories
        } else if (filePath.endsWith(".js")) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Read options from package.json
export function getOption(option: string) {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        const myPackageConfig = packageJson["dd-build"];

        if (myPackageConfig) {
            return myPackageConfig[option];
        } else {
            console.warn("No configuration found for 'dd-build' in package.json.");
        }
    } else {
        console.error("Could not locate package.json in the current working directory.");
    }
}

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
export function moveFile(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) {
        throw new Error("Source and destination paths must be provided.");
    }

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found: "${sourcePath}"`);
    }

    try {
        const destinationDir = path.dirname(destinationPath);
        if (!fs.existsSync(destinationDir)) {
            // Create the destination directory recursively if it doesn't exist
            fs.mkdirSync(destinationDir, { recursive: true });
        }
        fs.renameSync(sourcePath, destinationPath);
    } catch (error) {
        // Provide a more contextual error message
        throw new Error(`Failed to move file from "${sourcePath}" to "${destinationPath}": ${error.message}`);
    }
}

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
export function removeFile(filePath) {
    if (!filePath) {
        throw new Error("File path must be provided.");
    }

    if (!fs.existsSync(filePath)) {
        return true; // File doesn't exist, so operation is successful in effect.
    }

    try {
        fs.unlinkSync(filePath);
        return true; // File successfully removed.
    } catch (error) {
        // An error occurred trying to remove an existing file.
        // The caller can decide to log this error or handle it.
        // Example: console.error(`Failed to remove file "${filePath}": ${error.message}`);
        return false;
    }
}
