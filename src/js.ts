import concat from "concat";
import uglifyJS from "uglify-js";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import { findJSFiles } from "./utils";
import debounce from "lodash.debounce";

const cwd = process.cwd();
const jsDir = path.join(cwd, "_src/js");

export function buildJS() {

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



export function watchJS() {

	const buildJSDebounced = debounce(buildJS, 300);

	const watcher = chokidar.watch(jsDir, {
		ignored: path.join(cwd, 'assets/**'),
		persistent: true,
	});

	watcher
		.on('add', buildJSDebounced)
		.on('change', buildJSDebounced)
		.on('unlink', buildJSDebounced);

	console.log('Watching JS files for changes...');
}
