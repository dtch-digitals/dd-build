import concat from "concat";
import uglifyJS from "uglify-js";
import fs from "fs";
import path from "path";

export function buildJS() {

	const cwd = process.cwd();
	const jsDir = path.join(cwd, "_src/js");
	const outputDir = path.join(cwd, "assets/dist"); // Updated output directory
	const outputFile = path.join(outputDir, "main.js"); // Updated output file path
	const outputMapFile = path.join(outputDir, "main.js.map"); // Updated source map file path

	// If dist dir does not exits, create it
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const files = findJSFiles(jsDir);

	concat(files).then(result => {
		// @ts-expect-error type is unknown
		const minified = uglifyJS.minify(result, {
			sourceMap: {
				filename: "main.js",
				url: "main.js.map"
			}
		});

		if (minified.error) {
			console.error("Error minifying JS:", minified.error);
			return;
		}

		fs.writeFileSync(outputFile, minified.code);

		if (minified.map) {
			fs.writeFileSync(outputMapFile, minified.map);
		}

		console.log("JS concatenated and minified successfully.");
	}).catch(error => {
		console.error("Error during JS concatenation/minification:", error);
	});
}

// Function to recursively find all .js files
function findJSFiles(dir: string, fileList: Array<string> = []) {
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
