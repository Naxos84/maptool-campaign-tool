type CampaignDocument = {
	"net.rptools.maptool.util.PersistenceUtil_-PersistedCampaign": PersistedCampaign;
};

type PersistedCampaign = {
	assetMap: AssetMap;
	campaign: Campaign;
	currentView: CurrentView;
	currentZoneId: CurrentZoneId;
};

type AssetMap = AssetMapEntry[];
type AssetMapEntry = {
	entry: {
		"net.rptools.lib.MD5Key": Reference;
		null: unknown;
	};
};
type Campaign = {
	id: GUID;
	campaignProperties: CampaignProperties;
	exportSettings: unknown;
	gmMacroButtonLastInde: number;
	gmMacroButtonProperties: {
		"net.rptools.maptool.model.MacroButtonProperties": GameMasterMacroButtonProperties[];
	};
	macroButtonLastIndex: number;
	macroButtonProperties: {
		"net.rptools.maptool.model.MacroButtonProperties": MacroButtonProperties[];
	};
	name: string;
	zones: Zones;
};

type CampaignProperties = {
	characterSheets: List<{ string: string[] }>;
	defaultSightType: string; //TODO
	initiativeMovementLock: boolean;
	initiativeOwnerPermissions: boolean;
	initiativePanelButtonsDisabled: boolean;
	initiativeUseReverseSort: boolean;
	lightSourcesMap: LightSourcesMap;
	lookupTableMap: LookupTableMap;
	remoteRespositoryList: unknown;
	sightTypeMap: List<SightTypeEntry>;
	tokenBars: Class & List<TokenBar>;
	tokenStates: Class & List<TokenState>;
	tokenTypeMap: List<TokenType>;
};
type TokenType = {
	string: string;
	list: {
		"net.rptools.maptool.model.TokenProperty": TokenProperty[];
	};
};
type TokenProperty = {
	name: string;
	highPriority: boolean;
	ownerOnly: boolean;
	gmOnly: boolean;
	defaultValue?: number;
};
type TokenState = {
	string: string;
	"net.rptools.maptool.client.ui.token.FlowImageTokenOverlay": FlowImageTokenOverlay;
};
type FlowImageTokenOverlay = TokenOverlay & {
	group: unknown;
	showOwner: boolean;
	assetId: ID;
	grid: number;
};
type TokenBar = {
	string: string;
	"net.rptools.maptool.client.ui.token.TwoImageBarTokenOverlay": TwoImageBarTokenOverlay;
};
type TwoImageBarTokenOverlay = TokenOverlay & {
	increments: number;
	side: string; //TODO
	bottomAssetId: ID;
	topAssetId: ID;
};
type TokenOverlay = {
	name: string;
	order: number;
	mouseover: boolean;
	opacity: number;
	showGM: boolean;
	showOthers: boolean;
};
type SightTypeEntry = {
	string: string;
	"net.rptools.maptool.model.SightType": SightType;
};
//TODO check compatibility with LightSource
type SightType = {
	name: string;
	multiplier: number;
	personalLightSource: PersonalLightSource;
	shape: string;
	arc: number;
	distance: number;
	offset: number;
	scaleWithToken: boolean;
};
type PersonalLightSource = {
	lightList: {
		"net.rptools.maptool.model.Light": Light;
	};
	type: string; //TODO
	shapeType: string; //TODO
	lumens: number;
	scaleWithToken: boolean;
};
type LookupTableMap = List<LookupTableMapEntry>;
type LookupTableMapEntry = {
	string: string;
	"net.rptools.maptool.model.LookupTable": LookupTable;
};
type LookupTable = {
	entryList: LookupTableEntry[];
	name: string;
	defaultRoll: number;
	visible: boolean;
	allowLookup: boolean;
	pickOnce: boolean;
};
type LookupTableEntry = {
	"net.rptools.maptool.model.LookupTable_-LookupEntry": {
		min: number;
		max: number;
		picked: boolean;
		value: unknown;
		imageId: ID;
	};
};
type ID = {
	id: string;
};
type LightSourcesMap = Class & {
	entry: {
		string: string;
		map: List<LightSourcesMapEntry>;
	};
};

type LightSourcesMapEntry = {
	"net.rptools.maptool.model.GUID": GUID;
	"net.rptools.maptool.model.LightSource": LightSource;
};
type GUID = {
	baGUID: string;
};
type LightSource = {
	lightList: Light[];
	name: string;
	id: Reference;
	type: string; //TODO
	shapeType: string; //TODO
	lumens: number;
	scaleWithToken: boolean;
};
type Light = {
	paint: Class & { color: number };
	facingOffset: number;
	radius: number;
	arcAngle: number;
	shape: string; //TODO
	isGM: boolean;
	ownerOnly: boolean;
};
type ButtonProperties = {
	macroUUID: string;
	index: number;
	colorKey: "default" | unknown;
	hotKey: "None" | unknown;
	command: EscapedXmlString;
	label: EscapedXmlString;
	group: string;
	sortby: number;
	autoExecute: boolean;
	includeLabel: boolean;
	applyToToken: boolean;
	fontColorKey: "black" | unknown;
	fontSize: string; //TODO this is not strict enough
	minWidth: number;
	maxWidth: number;
	allowPlayerEdits: boolean;
	toolTip: string;
	displayHotKey: boolean;
	commonMacro: boolean;
	compareGroup: boolean;
	compareSortPrefix: boolean;
	compareCommand: boolean;
	compareAutoExecute: boolean;
	compareApplyToSelectedTokens: boolean;
};
type GameMasterMacroButtonProperties = ButtonProperties & {
	saveLocation: "GmPanel";
};
type MacroButtonProperties = ButtonProperties & {
	saveLocation: "CampaignPanel" | "Token";
};
type Zones = Class & {
	"java.util.Collections_-SynchronizedMap": {
		default: {
			m: Class & { entry: ZoneEntry };
			mutex: Class & Reference;
		};
	};
};
type ZoneEntry = {
	"net.rptools.maptool.model.GUID": GUID;
	"net.rptools.maptool.model.Zone": Zone;
};
type Zone = {
	creationTime: number;
	id: Reference;
	grid: Grid;
	gridColor: number;
	imageScaleX: number;
	imageScaleY: number;
	tokenVisionDistance: number;
	unitsPerCell: number;
	aStarRounding: string; //TODO
	topologyTypes: TopologyTypes;
	drawables: Drawables;
	gmDrawables: unknown;
	objectDrawables: unknown;
	labels: Class;
	tokenMap: TokenMap;
	exposedAreaMeta: ExposedAreaMeta;
	tokenOrderedList: TokenOrderedList;
	initiativeList: InitiativeList;
	exposedArea: ExposedArea;
	hasFog: boolean;
	fogPaint: FogPaint;
	topology: Topology;
	hillVbl: Curves;
	pitVbl: Curves;
	topologyTerrain: TopologyTerrain;
	backgroundPaint: BackgroundPaint;
	boardPosition: BoardPosition;
	drawBoard: boolean;
	boardChanged: boolean;
	name: string;
	isVisible: boolean;
	visionType: string; //TODO
	tokenSelection: string; //TODO
	height: number;
	width: number;
};
type Grid = Class & {
	offsetX: number;
	offsetY: number;
	size: number;
	zone: Reference;
	//TODO
};
type TopologyTypes = {
	topologyTypes: {
		"net.rptools.maptool.model.Zone_-TopologyType": string;
	};
};
type Drawables = {
	"net.rptools.maptool.model.drawing.DrawnElement": DrawnElement;
};
type DrawnElement = {
	drawable: Class & Drawable;
	pet: Pen;
};
type Drawable = {
	id: GUID;
	layer: string; //TODO
	points: unknown;
	width: number;
	squareCap: boolean;
};
type Pen = {
	foregroundMode: number;
	paint: Class & { color: number };
	backgroundMode: number;
	backgroundPaint: Class & { color: number };
	thickness: number;
	eraser: boolean;
	squareCap: boolean;
	opacity: number;
	color: number;
	backgroundColor: number;
};
type TokenMap = List<TokenMapEntry>;
type TokenMapEntry = {
	"net.rptools.maptool.model.GUID": GUID;
	"net.rptools.maptool.model.Token": Token;
};
type Token = {
	id: Reference;
	beingImpersonated: boolean;
	exposedAreaGUID: GUID;
	imageAssetMap: List<ImageAssetMapEntry>;
	x: number;
	y: number;
	z: number;
	anchorX: number;
	anchorY: number;
	sizeScale: number;
	lastX: number;
	lastY: number;
	sizeMap: List<SizeMapEntry>;
	snapToGrid: boolean;
	isVisible: boolean;
	visibleOnlyToOwner: boolean;
	vblColorSensitivity: number;
	alwaysVisibleTolerance: number;
	isAlwaysVisible: boolean;
	name: string;
	ownerList: unknown;
	ownerType: number;
	tokenShape: string; //TODO
	tokenType: "NPC" | "PC";
	layer: string; //TODO "OBJECT" |
	propertyType: string;
	tokenOpacity: number;
	speechName: unknown; //string
	terrainModifier: number;
	terrainModifierOperation: string; //TODO
	terreinModifiersIgnored: {
		"net.rptools.maptool.model.Token_-TerrainModifierOperation": string; //TODO
	};
	isFlippedX: boolean;
	isFlippedY: boolean;
	isFlippedIso: boolean;
	lightSourceList: unknown;
	sightType: string; //TODO
	hasSight: false;
	hasImageTable: boolean;
	notes: unknown;
	gmNotes: unknown;
	gmName: unknown;
	state: unknown;
	propertyMapCI: PropertyMap;
	macroPropertiesMap: List<MacroPropertiesMapEntry> | string;
	speechMap: unknown;
	allowURIAccess: boolean;
};
type MacroPropertiesMapEntry = {
	int: number;
	"net.rptools.maptool.model.MacroButtonProperties": MacroButtonProperties;
};
type PropertyMap = {
	store: List<PropertyMapEntry>;
};
type PropertyMapEntry = {
	string: string;
	"net.rptools.CaseInsensitiveHashMap_-KeyValue": {
		key: string;
		"outer-class": Reference;
	};
};
type SizeMapEntry = {
	string: string;
	"net.rptools.maptool.model.GUID": GUID;
};
type ImageAssetMapEntry = {
	null: unknown;
	"net.rptools.lib.MD5Key": MD5Key;
};
type MD5Key = {
	id: string;
};
type ExposedAreaMeta = List<ExposedAreaMetaEntry>;
type ExposedAreaMetaEntry = {
	"net.rptools.maptool.model.GUID": GUID;
	"net.rptools.maptool.model.ExposedAreaMetaData": unknown;
};
type TokenOrderedList = Class & TokenReference[];
type TokenReference = {
	"net.rptools.maptool.model.Token": Reference;
};
type InitiativeList = {
	//TODO if needed
};
type ExposedArea = {
	//TODO if needed
};
type FogPaint = Class & { color: number };
type Topology = Curves;
type Curves = {
	curves: Reference;
};
type TopologyTerrain = Curves;
type BackgroundPaint = Class & {
	assetId: ID;
	scale: number;
};
type BoardPosition = {
	x: number;
	y: number;
};
type CurrentView = {
	oneToOneScale: number;
	scale: number;
	scaleIncrement: number;
	zoomLevel: number;
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
	initialized: boolean;
};

type CurrentZoneId = Reference;

type Class = {
	$: {
		readonly class: string;
	};
};
type Reference = {
	$: {
		readonly reference: string;
	};
};

type EscapedXmlString = string;

type List<V> = {
	entry: V[];
};
