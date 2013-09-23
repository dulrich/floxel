var DIR,GEO,TYPE,VEC;

/* DIRECTIONS */
DIR = {};

DIR.int = function(vec) {
	var key;
	
	key = U.sign(vec.x)+','+U.sign(vec.y)+','+U.sign(vec.z);
	
	return DIR.xyz[key];
};

DIR.vec = function(int) {
	return DIR.i[int];
};

DIR.i = [
	new T.Vector3(0,1,0),
	new T.Vector3(1,1,0),
	new T.Vector3(1,0,0),
	new T.Vector3(1,-1,0),
	new T.Vector3(0,-1,0),
	new T.Vector3(-1,-1,0),
	new T.Vector3(-1,0,0),
	new T.Vector3(-1,1,0)
];

DIR.xyz = {};

DIR.xyz['0,1,0'] = 0;
DIR.xyz['1,1,0'] = 1;
DIR.xyz['1,0,0'] = 2;
DIR.xyz['1,-1,0'] = 3;
DIR.xyz['0,-1,0'] = 4;
DIR.xyz['-1,-1,0'] = 5;
DIR.xyz['-1,0,0'] = 6;
DIR.xyz['-1,1,0'] = 7;

/* GEOMETRIES */
GEO = {};

GEO.cube = new T.CubeGeometry(S.scale.x,S.scale.y,S.scale.z,S.detail.x,S.detail.y,S.detail.y);

GEO.plane = new T.PlaneGeometry(S.scale.x,S.scale.y,S.detail.x,S.detail.y);

/* TYPES */
TYPE = {};

TYPE.conn = {
	road: 0,
	river: 1
}

TYPE.obj = {
	entity: 0,
	road: 1
};

/* VECTORS */
VEC = {};

VEC.flipAll = new T.Vector3(-1,-1,-1);
VEC.flipX = new T.Vector3(-1,1,1);
VEC.flipY = new T.Vector3(1,-1,1);
VEC.flipZ = new T.Vector3(1,1,-1);

VEC.origin = new T.Vector3(0,0,0);

VEC.z40pct = new T.Vector3(0,0,S.scale.z*0.4);
VEC.z50pct = new T.Vector3(0,0,S.scale.z*0.5);
VEC.z60pct = new T.Vector3(0,0,S.scale.z*0.6);
VEC.z70pct = new T.Vector3(0,0,S.scale.z*0.7);
VEC.z80pct = new T.Vector3(0,0,S.scale.z*0.8);

