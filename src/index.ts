#! /usr/bin/env node

import { Command } from "commander";
import extract from "extract-zip";
import { zip } from "zip-a-folder";
import path from "path";

const program = new Command();

program
	.version("0.1.0")
	.description(
		"A command line tool to improve version control for maptool campaign files.",
	);
program
	.command("split")
	.description("Splits the campaign file")
	.argument("<src>", "Relative path to Campaignfile to split")
	.argument(
		"<dest>",
		"Relative path where the splitted files should be put. Overrides existing folders",
	)
	.option("-d, --debug", "show debugging information")
	.action(
		(
			src: string,
			dest: string,
			options: Record<string, unknown>,
			command: Command,
		) => {
			if (options.debug) {
				console.log(
					"Command",
					command.name(),
					"executed with options",
					options,
				);
				console.log("src", src);
				console.log("dest", dest);
			}
			if (src.endsWith(".cmpgn")) {
				extract(src, {
					dir: path.resolve(dest),
				});
			} else {
				console.error(
					"Invalid file name. Maptool campaigns should end with '.cmpgn'",
				);
			}
		},
	);

program
	.command("merge")
	.description("Merges split files into a campaign file")
	.argument(
		"<src>",
		"Relative path to the folder containing the split campaign",
	)
	.argument(
		"<dest>",
		"Relative Filename to the resulting campaign file. Overrides existing campaign files.",
	)
	.option("-d, --debug", "Show debug informations")
	.action(
		(
			src: string,
			dest: string,
			options: Record<string, unknown>,
			command: Command,
		) => {
			if (options.debug) {
				console.log(
					"Command",
					command.name(),
					"executed with options",
					options,
				);
				console.log("src", src);
				console.log("dest", dest);
			}
			if (dest.endsWith(".cmpgn")) {
				zip(src, dest)
					.then(() => console.log("Zip success"))
					.catch((e) => console.error("Zip Error", e));
			} else {
				console.error(
					"Invalid file name. Maptool campaigns should end with '.cmpgn'",
				);
			}
		},
	);

program.parse();
