#! /usr/bin/env node

import { Command } from "commander";
import extract from "extract-zip";
import { zip } from "zip-a-folder";
import path from "path";
import xml2js from "xml2js";
import fs from "fs";

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
		async (
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
				await extract(src, {
					dir: path.resolve(dest),
				});
				const parser = new xml2js.Parser();
				try {
					const data = await fs.promises.readFile(`${dest}/properties.xml`);
					const result = await parser.parseStringPromise(data);
					console.log(JSON.stringify(result));
					const [key, value] = result.map.entry[0].string;
					result.map.entry[0].string = [key, `${value}_modified`];
					const builder = new xml2js.Builder({ headless: true });
					const target = path.resolve(`${dest}/properties_copy.xml`);
					console.log("Writing to", target);
					await fs.promises.writeFile(target, builder.buildObject(result), {});
					console.log("Written file", target);
				} catch (e) {
					console.error(e);
				}
				fs.readFile(`${dest}/properties.xml`, (err, data) => {});
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
