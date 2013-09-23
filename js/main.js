var F,G,M,MODES;

MODES = {
	add: 1,
	remove: -1,
	select: 0
};

F = {};
G = {
	activeEntity: undefined,
	lighting: [],
	mapfile: 'map.json',
	mesh: new UTIL.Array3(S.mapSize),
	meshFilled: false,
	actionMode: MODES.select,
	pan: new T.Vector3(0,0,0),
	placeEntityID: -1
};

F.debugInfo = function() {
	var i,info,inventory,inventoryID;
	
	info = [
		['.debug-camera-position',UTIL.printV(R.camera.position)],
		['.debug-entity-name',G.activeEntity ? entities[G.activeEntity.object.data.entityID].name : 'None'],
		['.debug-entity-id',G.activeEntity ? G.activeEntity.object.data.entityID : ''],
		['.debug-mode-id',G.actionMode]
	];
	
	
	for(i=0;i<info.length;i++) {
		$debug.find(info[i][0]).html(info[i][1]);
	}
	
	if (P.inventoryChanged) {
		inventory = '';
		
		for(i=0;i<P.inventory.length;i++) {
			inventoryID = P.inventory[i].entityID;
			
			inventory += '<li class="debug-inventory-item';
			if (inventoryID === P.selectedEntityID)
				inventory += ' debug-inventory-active';
			inventory += '" data-entityID="'+inventoryID+'">';
			inventory += entities[inventoryID].name + '(' + P.inventory[i].quantity + ')'
			inventory += '</li>';
		}
		
		$('.debug-inventory-container').html(inventory);
		
		$('.debug-inventory-item').click(function(e) {
			$('.debug-inventory-item').removeClass('debug-inventory-active');
			
			$(this).addClass('debug-inventory-active');
			
			P.selectedEntityID = parseInt($(this).attr('data-entityID'),10);
		});
		
		P.inventoryChanged = false;
	}
};

F.emptyMesh = function() {
	G.mesh.each(function(val,vec) {
		R.scene.remove(val);
		
		G.mesh.set(vec,undefined);
	});
};

F.flipY = function(vec) {
	return vec.clone().multiply(VEC.flipY);
};

F.initMeshFromMap = function() {
	M.each(function(val,vec) {
		G.mesh.set(vec,F.meshFromMap(vec));
		
		if (G.mesh.get(vec)) R.scene.add(G.mesh.get(vec));
		
		F.overlayFromMap(vec); // need to set global and add here
	});
	
	G.meshFilled = true;
};

/* Setup Global Lighting and Skybox */
F.initWorld = function() {
	// create a point light
	var pointLight;
	pointLight = new T.PointLight( 0xFFFFFF );
	pointLight.position.set(1000,-1000,1000);
	
	G.lighting.push(pointLight);
	
	G.lighting.forEach(function(v) {
		R.scene.add(v);
	});
};

F.makeGeometry = function(entityID) {
	entities[entityID].geometry = entities[entityID].geometry || GEO.cube;
	
	return entities[entityID].geometry;
};

F.makeMaterial = function(entityID) {
	entities[entityID].material =
		entities[entityID].material ||
		new T.MeshLambertMaterial({
			color: entities[entityID].color,
			opacity: U.def(entities[entityID].opacity,1),
			transparent: (U.E(entities[entityID].opacity) && entities[entityID].opacity < 1)
		});
	return entities[entityID].material;
};

F.makePosition = function(entityID) {
	return entities[entityID].position || VEC.origin;
};

F.meshFromMap = function(vec) {
	var geometry,mapData,material,position,tMesh;
	
	F.requireType.Vector3(vec);
	
	mapData = M.get(vec);
	
	if (!mapData) return tMesh;
	
	geometry = F.makeGeometry(mapData.entityID);
	material = F.makeMaterial(mapData.entityID);
	position = F.makePosition(mapData.entityID);
	
	tMesh = new T.Mesh(geometry,material);
	
	tMesh.position = vec.clone()
		.multiply(S.scale)
		.multiply(VEC.flipY)
		.add(position);
	
	tMesh.data = {};
	tMesh.data.entityID = mapData.entityID;
	tMesh.data.gridPosition = vec;
	tMesh.data.type = TYPE.obj.entity;
	
	return tMesh;
};

F.overlayFromMap = function(vec) {
	var center,connection,geometry,line,mapData,material;
	
	F.requireType.Vector3(vec);
	
	mapData = M.get(vec);
	
	if (!mapData) return;
	
	center = vec.clone()
		.multiply(S.scale)
		.multiply(VEC.flipY)
		.add(VEC.z60pct);
	
	if (mapData.connections) {
		for(i=0;i<mapData.connections.length;i++) {
			if ((connection = mapData.connections[i]) && connection.type === TYPE.conn.road) {
				geometry = new T.Geometry();
				
				geometry.vertices.push(center);
				geometry.vertices.push(DIR.vec(i).clone().multiply(S.scale).multiplyScalar(0.5).add(center));
				
				material = new THREE.LineBasicMaterial({
					color: 0x451500,
					linewidth: 5
				});
				
				line = new T.Line(geometry,material,T.LineStrip);
				
				line.data = {};
				line.data.overlayID = TYPE.conn.road;
				line.data.gridPosition = vec;
				line.data.level = connection.level;
				line.data.type = TYPE.obj.road;
				
				R.scene.add(line);
			}
		}
	}
};

F.requireType = {};

F.requireType.Vector3 = function(v) {
	if (!(v instanceof T.Vector3)) throw 'v must be a THREE.Vector3';
};

F.roadEnd = function(vec) {
	if (!G.roadStart)  throw 'Road must be started first';
	
	F.roadFromTo(G.roadStart,vec,1);
	
	delete G.roadStart;
};

F.roadFromTo = function(start,end,level) {
	var mapData,road;
	
	road = end.clone()
		.sub(start)
		.multiply(VEC.flipY);
	
	mapData = M.get(start);
	
	mapData.connections = mapData.connections || new Array(8);
	
	mapData.connections[DIR.int(road)] = {
		level: level,
		type: TYPE.conn.road
	};
	
	M.set(start,mapData);
	
	road.multiply(VEC.flipAll);
	mapData = M.get(end);
	
	mapData.connections = mapData.connections || new Array(8);
	
	mapData.connections[DIR.int(road)] = {
		level: level,
		type: TYPE.conn.road
	};
	
	M.set(end,mapData);
};

F.roadStart = function(vec) {
	G.roadStart = vec;
};

F.update = function() {
// 	camera.position.add(
	R.camera.position.x += G.pan.x;
	R.camera.position.y += -G.pan.y;
	R.camera.position.z += G.pan.z;
}

F.onMapLoaded = function(map) {
	M = new UTIL.Array3(S.mapSize);
	
	M.init(map.data);
	
	if (G.meshFilled) F.emptyMesh();
	
	F.initMeshFromMap();
	F.initWorld();
};

// set things up
P.initInventory();
$.getJSON(S.server+'/map/load/'+G.mapfile,F.onMapLoaded);

window.setInterval(F.update, 1000 / 60);

(function animLoop() {
	requestAnimFrame(animLoop);
	R.renderer.render(R.scene, R.camera);
	if (S.flags.DEBUG) F.debugInfo();
})();