import fs from "fs";
import path from "path";

// Function to recursively find all .js files
export function findJSFiles(dir: string, fileList: Array<string> = []) {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
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
