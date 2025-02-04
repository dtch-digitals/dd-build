import sass from "sass";
import fs from "fs";
import path from "path";
import debounce from "lodash.debounce";
import chokidar from "chokidar";

const cwd = process.cwd();
const sassDir = path.join(cwd, "_src/sass");

// Function to build and minify SASS
export function buildSass() {

	const outputDir = path.join(cwd, "assets/dist");
	const outputFile = path.join(outputDir, "dd_style.css");
	const outputMapFile = path.join(outputDir, "dd_style.css.map");

	// If dist dir does not exits, create it
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	try {
		const sassResult = sass.compile(path.join(sassDir, "style.scss"), {
			style: "compressed",
			sourceMap: true,
			loadPaths: [path.join(cwd, "_src/sass")],
		});

		fs.writeFileSync(outputFile, sassResult.css);
		fs.appendFileSync(outputFile, `/*# sourceMappingURL=${path.basename(outputMapFile)} */`); // Ensure the source map reference is added to the CSS file

		if (sassResult.sourceMap) {
			fs.writeFileSync(outputMapFile, JSON.stringify(sassResult.sourceMap));
		}

		console.info("SASS compiled and CSS minified successfully.");

	} catch (error) {
		console.error("Error during SASS compilation/minification:", error);
	}
}

export function watchSass() {

	const buildSassDebounced = debounce(buildSass, 300);

	const watcher = chokidar.watch(sassDir, {
		ignored: path.join(cwd, "assets/**"),
		persistent: true,
	});

	watcher
		.on("add", buildSassDebounced)
		.on("change", buildSassDebounced)
		.on("unlink", buildSassDebounced);

	console.log("Watching for SCSS changes...");
}
