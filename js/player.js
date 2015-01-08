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

var P;

P = {
	inventory: [],
	inventoryChanged: false,
	selectedEntityID: 0
};

P.changeInventory = function(entityID,quantity) {
	var filter,found,withEntity;
	
	filter = false;
	found = false;
	
	filterEntity = function(v) {
		return v.quantity;
	};
	
	withEntity = function(v,i) {
		if (v.entityID === entityID) {
			P.inventory[i].quantity += quantity;
			found = true;
			if (P.inventory[i].quantity === 0) filter = true;
			else if (P.inventory[i].quantity < 0) throw 'Illegal negative inventory quantity';
		}
	};
	
	P.inventory.forEach(withEntity);
	
	if (filter) {
		P.inventory = P.inventory.filter(filterEntity);
		P.selectedEntityID = 0;
	}
	
	if (!found) P.inventory.push({
		entityID: entityID,
		quantity: quantity
	});
	
	P.inventoryChanged = true;
};

P.initInventory = function(playerID) {
	P.changeInventory(200,5);
	P.changeInventory(100,3);
};
