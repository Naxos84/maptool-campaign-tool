import fs from "fs";
import { decodeHTML } from "entities";
import {
	Campaign,
	MacroButtonProperties,
	GameMasterMacroButtonProperties,
	List,
	MacroPropertiesMapEntry,
	EscapedXmlString,
	Token,
	GUID,
} from "./campaign.js";

export default class {
	constructor(private campaign: Campaign) {}
	async writeCampaignMacros(campaignPath: string) {
		for (let macro of this.getCampaignMacros()) {
			const macroFolderPath = `${campaignPath}/macros/${macro.macroUUID}`;
			if (!fs.existsSync(macroFolderPath)) {
				await fs.promises.mkdir(macroFolderPath, { recursive: true });
			}
			const command = macro.command;
			await this.writeMacro(macroFolderPath, macro, command);
			console.log("Wrote files for campaign macro", macro.label);
		}
	}
	async writeGamemasterMacros(campaignPath: string) {
		for (let macro of this.getGameMasterMacros()) {
			const macroFolderPath = `${campaignPath}/gamemastermacros/${macro.macroUUID}`;
			if (!fs.existsSync(macroFolderPath)) {
				await fs.promises.mkdir(macroFolderPath, { recursive: true });
			}
			const command = macro.command;
			await this.writeMacro(macroFolderPath, macro, command);
			console.log("Wrote files for gamemaster macro", macro.label);
		}
	}

	async writeTokens(campaignPath: string) {
		const libTokens = this.getLibTokens();
		for (let libToken of libTokens) {
			const tokenName = libToken.token.name.split(":")[1];
			if (this.isList(libToken.token.macroPropertiesMap)) {
				const macroPropertiesMapEntries = this.getAsList(
					libToken.token.macroPropertiesMap.entry,
				);
				for (let token of macroPropertiesMapEntries) {
					const macroId =
						token["net.rptools.maptool.model.MacroButtonProperties"].macroUUID;
					const command =
						token["net.rptools.maptool.model.MacroButtonProperties"].command;
					const macroName =
						token["net.rptools.maptool.model.MacroButtonProperties"].label;
					const tokenPath = `${campaignPath}/tokens/${tokenName}/macros/${macroName}_${macroId}`;

					if (!fs.existsSync(tokenPath)) {
						console.log("Creating directory", tokenPath);
						await fs.promises.mkdir(tokenPath, { recursive: true });
					}
					const meta = token["net.rptools.maptool.model.MacroButtonProperties"];
					this.writeMacro(tokenPath, meta, command);
					console.log(
						"Wrote files for token macro",
						meta.group,
						meta.label,
						"to",
						tokenPath,
					);
				}
			}
		}
	}

	private async writeMacro(
		path: string,
		meta: object,
		command: EscapedXmlString,
	) {
		await fs.promises.writeFile(
			`${path}/meta.json`,
			JSON.stringify(meta, null, 2),
		);
		await fs.promises.writeFile(`${path}/command.mtm`, decodeHTML(command));
	}

	getCampaignMacros(): MacroButtonProperties[] {
		return this.campaign.macroButtonProperties[
			"net.rptools.maptool.model.MacroButtonProperties"
		];
	}

	getGameMasterMacros(): GameMasterMacroButtonProperties[] {
		return this.campaign.gmMacroButtonProperties[
			"net.rptools.maptool.model.MacroButtonProperties"
		];
	}

	getLibTokens(): Array<{ id: GUID; token: Token }> {
		const zoneEntries =
			this.campaign.zones["java.util.Collections_-SynchronizedMap"].default.m
				.entry;
		if (zoneEntries instanceof Array) {
			throw new Error("Multiple maps are currently not supported."); //FIXME
		} else {
			const tokenMapEntries =
				zoneEntries["net.rptools.maptool.model.Zone"].tokenMap.entry;
			const listTokenMapEntries = this.getAsList(tokenMapEntries);
			return listTokenMapEntries
				.filter((entry) =>
					entry["net.rptools.maptool.model.Token"].name.startsWith("Lib:"),
				)
				.map((entry) => {
					return {
						id: entry["net.rptools.maptool.model.GUID"],
						token: entry["net.rptools.maptool.model.Token"],
					};
				});
		}
	}

	private getAsList<T>(entry: T | T[]) {
		if (entry instanceof Array) {
			return entry;
		} else {
			return new Array<T>(entry);
		}
	}

	private isList(
		o: List<MacroPropertiesMapEntry> | string,
	): o is List<MacroPropertiesMapEntry> {
		if (typeof o === "string") {
			return false;
		}
		return true;
	}
}
