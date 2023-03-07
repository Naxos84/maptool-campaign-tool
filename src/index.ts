#! /usr/bin/env node

import { Command } from "commander";
import extract from "extract-zip";
import { zip } from "zip-a-folder";
import path from "path";
import xml2js from "xml2js";
import fs from "fs";
import inquirer, { QuestionCollection } from "inquirer";

import type {
	Campaign,
	CampaignDocument,
	MacroButtonProperties,
} from "./campaign.js";
import Utils from "./Utils.js";

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
				const dir = path.resolve(`${dest}/original`);
				await extract(src, {
					dir,
				});
				console.log("Extraced files to", dir);
				const parser = new xml2js.Parser({ explicitArray: false });
				try {
					const pathToOriginalCampaign = `${dest}/original/content.xml`;
					const data = await fs.promises.readFile(pathToOriginalCampaign);
					const result: CampaignDocument = await parser.parseStringPromise(
						data,
					);
					console.log("Parsed campaign from", pathToOriginalCampaign);
					const campaignId = getCampaignId(result);
					const campaignPath = `${dest}/campaign-${campaignId}`;
					if (fs.existsSync(campaignPath)) {
						const questions: QuestionCollection = [
							{
								type: "input",
								name: "overwrite",
								message: "The parsed campaign already exists. Overwrite? (n/y)",
								default: "y",
								filter: (input, answers) => {
									return input.toLowerCase() === "y";
								},
							},
						];
						const answers = await inquirer.prompt(questions);
						console.log(JSON.stringify(answers));
						if (answers.overwrite) {
							console.log("Clearing target directory");
							await fs.promises.rm(campaignPath, { recursive: true });
							await fs.promises.mkdir(campaignPath);
						}
					} else {
						await fs.promises.mkdir(campaignPath);
					}
					const campaign =
						result[
							"net.rptools.maptool.util.PersistenceUtil_-PersistedCampaign"
						].campaign;
					const utils = new Utils(campaign);
					await utils.writeCampaignMacros(campaignPath);
					await utils.writeGamemasterMacros(campaignPath);
					await utils.writeTokens(campaignPath);
					console.log("Splitting campaign finished");
				} catch (e) {
					console.error(e);
				}
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

function getCampaignId(data: CampaignDocument) {
	return data["net.rptools.maptool.util.PersistenceUtil_-PersistedCampaign"]
		.campaign.id.baGUID;
}
