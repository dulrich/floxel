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

var CAST,UTIL;

CAST = {};
UTIL = {};

UTIL.E = function(v) {
	return typeof v !== 'undefined';
};

UTIL.def = function(val,def) {
	return (UTIL.E(val) && val) || def;
};

CAST.int = function(n) {
	return parseInt(n,10) | 0;
};

UTIL.printV = function(v) {
	return '('+v.x+','+v.y+','+v.z+')';
};

UTIL.sign = function(x) {
	return x > 0 ? 1 : x < 0 ? -1 : 0;
}

UTIL.Array3 = function (vec) {
	
	this.size = vec || new THREE.Vector3(1,1,1);
	
	this.init();
	
};

UTIL.Array3.prototype = {

	constructor: UTIL.Array3,
	
	empty: function() {
		this.a = [[[]]];
	},
	
	_inBounds: function(vec) {
		if (!this.inBounds(vec))
			throw 'Array3 index '+UTIL.printV(vec)+' out of bounds '+UTIL.printV(this.size);
	},
	
	inBounds: function(vec) {
		return !(vec.x >= this.size.x || vec.y >= this.size.y || vec.z >= this.size.z);
	},
	
	_isArray: function(a) {
		if (!this.isArray(a))
			throw 'Argument must be an Array';
	},
	
	isArray: function(a) {
		return a instanceof Array;
	},
	
	each: function(fn) {
		var x,y,z;
		
		for(z=0;z<this.size.z;z++) {
			for(y=0;y<this.size.y;y++) {
				for(x=0;x<this.size.x;x++) {
					fn(this.a[z][y][x],new THREE.Vector3(x,y,z));
				}
			}
		}
	},
	
	get: function(vec) {
		
		this._inBounds(vec);
		
		return this.a[vec.z][vec.y][vec.x];
		
	},
	
	init: function(a3) {
		var x,y,z;
		
		this.a = this.a || [];
		for(z=0;z<this.size.z;z++) {
			this.a[z] = this.a[z] || [];
			for(y=0;y<this.size.y;y++) {
				this.a[z][y] = this.a[z][y] || [];
				for(x=0;x<this.size.x;x++) {
					this.a[z][y][x] =
						(UTIL.E(a3) && UTIL.E(a3[z]) && UTIL.E(a3[z][y]) && a3[z][y][x])
						|| undefined;
				}
			}
		}
		
	},
	
	set: function(vec,val) {
		
		this._inBounds(vec);
			
		this.a[vec.z][vec.y][vec.x] = val;
		return this;
		
	}
	
};
