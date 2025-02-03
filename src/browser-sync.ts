import browserSync from "browser-sync";
import { getOption } from "./utils";

export function runBrowserSync() {
	const host = getOption("browser-sync-host");

	browserSync.create().init({
		proxy: host,
		files: [
			"./assets/**/*.css",
			"./assets/**/*.js",
			"**/*.php",
			"!**/includes/**/*.php",
		],
		snippetOptions: {
			ignorePaths: "wp-admin/**",
		},
		notify: false,
		open: false,
	});
}
