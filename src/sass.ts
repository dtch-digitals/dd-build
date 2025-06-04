import sass from "sass";
import fs from "fs";
import path from "path";
import debounce from "lodash.debounce";
import chokidar from "chokidar";
import { getOption, moveFile, removeFile } from "./utils";

const cwd = process.cwd();
const sassDir = path.join(cwd, "_src/sass");

// Function to build and minify SASS
export function buildSass() {
	const outputDir = path.join(cwd, "assets/dist");
	const outputFile = path.join(outputDir, "dd_style.css");
	const outputMapFile = path.join(outputDir, "dd_style.css.map");

	// Add breakpoints to setup file
	generateBreakpointMixins();
	// moveFile(path.join(sassDir, "setup.scss"), path.join(sassDir, ".setup.scss.bu"));
	// moveFile(path.join(sassDir, ".setup.scss"), path.join(sassDir, "setup.scss"));

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

	// Move the original options file back
	// removeFile(path.join(sassDir, "setup.scss"));
	// moveFile(path.join(sassDir, ".setup.scss.bu"), path.join(sassDir, "setup.scss"));
}

export function watchSass() {
	const buildSassDebounced = debounce(buildSass, 300);

	const watcher = chokidar.watch([sassDir, path.join(cwd, "package.json")], {
		ignored: path.join(cwd, "assets/**"),
		persistent: true,
	});

	watcher.on("add", buildSassDebounced).on("change", buildSassDebounced).on("unlink", buildSassDebounced);

	console.log("Watching for SCSS changes...");
}

function generateBreakpointMixins() {
	// const originalMixinPath = path.join(sassDir, "setup.scss");
	// const hiddenMixinPath = path.join(sassDir, `.setup.scss`);
	const hiddenMixinPath = path.join(sassDir, `mixins.scss`);

	const breakpoints = getOption("breakpoints");
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
		// let existingContent = "";
		// if (fs.existsSync(originalMixinPath)) {
		// 	existingContent = fs.readFileSync(originalMixinPath, "utf8");
		// }

		// const finalContent = existingContent + "\n" + newSassMixinsString;
		// const finalContent = newSassMixinsString + "\n" + existingContent;
		fs.writeFileSync(hiddenMixinPath, newSassMixinsString, "utf8");
		// fs.writeFileSync(hiddenMixinPath, finalContent, "utf8");

		console.log(`Successfully prepended mixins to SASS setup`);
	} catch (err) {
		console.error(`Error prepending mixins to file: ${err.message}`);
	}
}
