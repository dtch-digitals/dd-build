#!/usr/bin/env node

import { buildSass, watchSass } from "./src/sass";
import { buildJS, watchJS } from "./src/js";
import { runBrowserSync } from "./src/browser-sync";

const args = process.argv.slice(2);

if (args[0] === "sass") {
	if (args[1] === "--watch") {
		watchSass();
	}
	else {
		buildSass();
	}
}

if (args[0] === "js") {
	if (args[1] === "--watch") {
		watchJS();
	}
	else {
		buildJS();
	}
}

if (args[0] === "browser-sync") {
	runBrowserSync();
}
