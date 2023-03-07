import { Command } from "commander";
import { zip } from "zip-a-folder";

const commandName = "merge";
const commandDescription = "Merges split files into a campaign file";
const commandArguments = [
	{
		name: "<src>",
		description: "Relative path to the folder containing the split campaign",
	},
	{
		name: "<dest>",
		description:
			"Relative Filename to the resulting campaign file. Overrides existing campaign files.",
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
	if (dest.endsWith(".cmpgn")) {
		zip(src, dest)
			.then(() => console.log("Zip success"))
			.catch((e) => console.error("Zip Error", e));
	} else {
		console.error(
			"Invalid file name. Maptool campaigns should end with '.cmpgn'",
		);
	}
};

export {
	commandName,
	commandDescription,
	commandOptions,
	commandArguments,
	action,
};
