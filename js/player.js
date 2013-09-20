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
