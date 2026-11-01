const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Sprite,
		C3.Behaviors.EightDir,
		C3.Behaviors.scrollto,
		C3.Plugins.Tilemap,
		C3.Behaviors.solid,
		C3.Plugins.Keyboard,
		C3.Plugins.Mouse,
		C3.Plugins.Text,
		C3.Plugins.TiledBg
	];
};
self.C3_JsPropNameTable = [
	{"8Направлений": 0},
	{СледитьЗа: 0},
	{ГГ: 0},
	{Твёрдый: 0},
	{КартаТайлов: 0},
	{keyboard: 0},
	{FuseBox: 0},
	{BoardPanel: 0},
	{mouse: 0},
	{WorldNote: 0},
	{PanelSwitch1: 0},
	{PanelSwitch2: 0},
	{PanelSwitch3: 0},
	{NotePanel: 0},
	{NoteBody: 0},
	{ScreenDim: 0},
	{Door: 0},
	{Hitbox: 0},
	{PowerLamp: 0},
	{КартаТайлов2: 0},
	{WinText: 0}
];

self.InstanceType = {
	ГГ: class extends self.ISpriteInstance {},
	КартаТайлов: class extends self.ITilemapInstance {},
	keyboard: class extends self.IInstance {},
	FuseBox: class extends self.ISpriteInstance {},
	BoardPanel: class extends self.ISpriteInstance {},
	mouse: class extends self.IInstance {},
	WorldNote: class extends self.ISpriteInstance {},
	PanelSwitch1: class extends self.ISpriteInstance {},
	PanelSwitch2: class extends self.ISpriteInstance {},
	PanelSwitch3: class extends self.ISpriteInstance {},
	NotePanel: class extends self.ISpriteInstance {},
	NoteBody: class extends self.ITextInstance {},
	ScreenDim: class extends self.ISpriteInstance {},
	Door: class extends self.ISpriteInstance {},
	Hitbox: class extends self.ITiledBackgroundInstance {},
	PowerLamp: class extends self.ISpriteInstance {},
	КартаТайлов2: class extends self.ITilemapInstance {},
	WinText: class extends self.ITextInstance {}
}