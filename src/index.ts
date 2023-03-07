#! /usr/bin/env node

import { Command } from "commander";

import type { CampaignDocument } from "./campaign.js";
import Utils from "./Utils.js";
import * as split from "./commands/split.js";
import * as merge from "./commands/merge.js";

const program = new Command();

program
	.version("0.1.0")
	.description(
		"A command line tool to improve version control for maptool campaign files.",
	);

const splitCommand = program
	.command(split.commandName)
	.description(split.commandDescription)
	.action(split.action);
split.commandArguments.forEach((argument) =>
	splitCommand.argument(argument.name, argument.description),
);
split.commandOptions.forEach((option) =>
	splitCommand.option(option.flags, option.description),
);

const mergeCommand = program
	.command(merge.commandName)
	.description(merge.commandDescription)
	.action(merge.action);
merge.commandArguments.forEach((argument) =>
	mergeCommand.argument(argument.name, argument.description),
);
merge.commandOptions.forEach((option) =>
	mergeCommand.argument(option.flags, option.description),
);

program.parse();
