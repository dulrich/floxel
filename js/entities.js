// floxel: Simple voxel based strategy game engine
// Copyright (C) 2013 - 2015  David Ulrich
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
