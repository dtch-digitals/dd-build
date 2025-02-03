#!/usr/bin/env node

import { buildSass } from "./src/sass";
import { buildJS } from "./src/js";

const args = process.argv.slice(2);

if (args[0] === "sass") {
	buildSass();
}

if (args[0] === "js") {
	buildJS();
}
