var F,G,MODES;

MODES = {
	add: 1,
	remove: -1,
	select: 0
};

F = {};
G = {
	activeEntity: undefined,
	lighting: [],
	mesh: new UTIL.Array3(S.mapSize),
	actionMode: MODES.select,
	pan: new T.Vector3(0,0,0),
	placeEntityID: -1,
	flipY: new T.Vector3(1,-1,1)
};

F.debugInfo = function() {
	var i,info;
	
	info = [
		['.debug-camera-position',UTIL.printV(R.camera.position)],
		['.debug-entity-name',G.activeEntity ? entities[G.activeEntity.object.data.entityID].name : 'None'],
		['.debug-entity-id',G.activeEntity ? G.activeEntity.object.data.entityID : ''],
		['.debug-mode-id',G.actionMode]
	];
	
	
	for(i=0;i<info.length;i++) {
		$debug.find(info[i][0]).html(info[i][1]);
	}
};

F.flipY = function(vec) {
	return vec.clone().multiplySelf(G.flipY);
};

F.initMeshFromMap = function() {
	
	M.each(function(val,vec) {
		G.mesh.set(vec,F.meshFromMap(vec));
		
		if (G.mesh.get(vec)) R.scene.add(G.mesh.get(vec));
	});
	
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

F.makeMaterial = function(entityID) {
	entities[entityID].material =
	entities[entityID].material ||
	new T.MeshLambertMaterial({
		color: entities[entityID].color,
		opacity: U.def(entities[entityID].opacity,1),
		transparent: (U.E(entities[entityID].opacity) && entities[entityID].opacity < 1)
	})
	return entities[entityID].material;
};

F.meshFromMap = function(v) {
	var tMesh,seg;
	
	F.requireType.Vector3(v);
	
	if (!M.get(v)) return tMesh;
	
	seg = new T.Vector3(1,1,1);
	
	tMesh = new T.Mesh(
		new T.CubeGeometry(S.scale.x,S.scale.y,S.scale.z,seg.x,seg.y,seg.z),
		F.makeMaterial(M.get(v))
	);
	
	tMesh.position = v.clone().multiplySelf(S.scale).multiplySelf(G.flipY);
	
	tMesh.data = {};
	tMesh.data.entityID = M.get(v);
	tMesh.data.gridPosition = v;
	
	return tMesh;
};

F.requireType = {};

F.requireType.Vector3 = function(v) {
	if (!(v instanceof T.Vector3)) throw 'v must be a THREE.Vector3';
};

F.update = function() {
// 	camera.position.addSelf(
	R.camera.position.x += G.pan.x;
	R.camera.position.y += -G.pan.y;
	R.camera.position.z += G.pan.z;
}

F.initMeshFromMap();
F.initWorld();

window.setInterval(F.update, 1000 / 60);

(function animLoop() {
	requestAnimFrame(animLoop);
	R.renderer.render(R.scene, R.camera);
	if (S.flags.DEBUG) F.debugInfo();
})();