var entities,overlays;

entities = [];

/* 0xx :: ? TYPE ENTITIES */

entities[0] = {
	
};

/* 1XX :: ROCK TYPE ENTITIES */

entities[100] = {
	color: 0xCCCCCC,
	name: 'Rock'
};

/* 2XX :: SOIL TYPE ENTITIES */

entities[200] = {
	color: 0x8A4F11,
	name: 'Dirt'
};

entities[210] = {
	color: 0xBD3208,
	name: 'Clay'
};

/* 3XX :: PLANT TYPE ENTITIES */

entities[300] = {
	color: 0x1A6B0A,
	name: 'Trees'
};

/* 3XX :: LIQUID TYPE ENTITIES */

entities[400] = {
	color: 0x0000CC,
	geometry: GEO.plane,
	name: 'Water',
	opacity: 0.5,
	position: VEC.z40pct
};


overlays = {};

overlays[TYPE.conn.road] = [
	{ // level 0
		
	},
	{ // level 1
		color: 0x451500,
		linewidth: 5
	}
];