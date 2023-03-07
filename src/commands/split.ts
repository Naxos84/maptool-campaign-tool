import { Command } from "commander";
import extract from "extract-zip";
import path from "path";
import fs from "fs";
import xml2js from "xml2js";
import inquirer, { QuestionCollection } from "inquirer";

import type { CampaignDocument } from "../campaign.js";
import Utils from "../Utils.js";

const commandName = "split";
const commandDescription = "Splits the campaign file";
const commandArguments = [
	{
		name: "<src>",
		description: "Relative path to Campaignfile to split",
	},
	{
		name: "<dest>",
		description:
			"Relative path where the splitted files should be put. Overrides existing folders",
	},
];

const commandOptions = [
	{ flags: "-d, --debug", description: "Show debug informations" },
];

const action = async (
	src: string,
	dest: string,
	options: Record<string, unknown>,
	command: Command,
) => {
	if (options.debug) {
		console.log("Command", command.name(), "executed with options", options);
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
			const result: CampaignDocument = await parser.parseStringPromise(data);
			console.log("Parsed campaign from", pathToOriginalCampaign);
			const campaignName = getCampaignName(result);
			const campaignPath = `${dest}/campaign-${campaignName}`;
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
				result["net.rptools.maptool.util.PersistenceUtil_-PersistedCampaign"]
					.campaign;
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
};

function getCampaignName(data: CampaignDocument) {
	return data["net.rptools.maptool.util.PersistenceUtil_-PersistedCampaign"]
		.campaign.name;
}

export {
	commandName,
	commandDescription,
	commandArguments,
	commandOptions,
	action,
};
