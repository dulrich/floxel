var E;

E = {
	mouseNDC: new T.Vector3(0,0,0),
	projector: new T.Projector(),
	selectedMaterial: new T.MeshLambertMaterial({
		color: 0xFFFFFF
	})
};

E.keyDown = function(e) {
	switch(e.which) {
		case 65: // left
			G.pan.x = -S.panRate;
			break;
		case 68: // right
			G.pan.x = S.panRate;
			break;
		case 83: // down
			G.pan.y = S.panRate;
			break;
		case 87: // up
			G.pan.y = -S.panRate;
			break;
		default:
			// nothing
	};
};

E.keyUp = function(e) {
	switch(e.which) {
		case 65: // left
		case 68: // right
			G.pan.x = 0;
			break;
		case 83: // down
		case 87: // up
			G.pan.y = 0;
			break;
		default:
			// nothing
	};
};

E.mouseMove = function(e) {
	
	e.preventDefault();
	
	E.mouseNDC.set(
		(e.clientX + window.pageXOffset - W.pos.x - W.halfWidth) / W.halfWidth,
		-1 * (e.clientY + window.pageYOffset - W.pos.y - W.halfHeight) / W.halfHeight,
		0
	);
	
}

E.mouseDown = function(e) {
	var intersects,modeActions;
	
	e.preventDefault();
	
	E.raycaster = E.projector.pickingRay( E.mouseNDC.clone(), R.camera );
	
	intersects = E.raycaster.intersectObjects( R.scene.children );
	
	modeActions = {};
	
	modeActions[-1] = function() {
		var grid;
		
		G.activeEntity = undefined;
		
		grid = intersects[0].object.data.gridPosition;
		
		M.set(grid,{
			entityID: 000
		});
		
		R.scene.remove(intersects[0].object);
		
		P.changeInventory(intersects[0].object.data.entityID,1);
	};
	
	modeActions[0] = function() {
		var i;
		
		i = 0;
		while (!G.activeEntity && i < intersects.length) {
			if (intersects[i] && (intersects[i].object.data.type === TYPE.obj.entity))
				G.activeEntity = intersects[i];
			i++;
		}
		
		G.activeEntity.object.material = E.selectedMaterial;
	};
	
	modeActions[1] = function() {
		var grid;
		
		if (P.selectedEntityID) {
			grid = intersects[0].object.data.gridPosition.clone();
			
			grid.addSelf(F.flipY(intersects[0].face.normal));
			
			M.set(grid,{
				entityID: P.selectedEntityID
			});
			
			G.mesh.set(grid,F.meshFromMap(grid));
			if (G.mesh.get(grid)) R.scene.add(G.mesh.get(grid));
			
			P.changeInventory(P.selectedEntityID,-1);
		}
	};
	
	if (intersects.length > 0) {
		
		// deselect the previous active entity
		if (G.activeEntity) {
			if (!G.activeEntity.object.data)
				throw 'Active entity missing data';
			if (!U.E(G.activeEntity.object.data.entityID))
				throw 'Active entity missing data.entityID';
			
			G.activeEntity.object.material = entities[G.activeEntity.object.data.entityID].material;
			
			delete G.activeEntity;
		}
		
		modeActions[G.actionMode]();
		
	}
	
}

/* Setup Window Events */

window.onkeydown = E.keyDown;
window.onkeyup = E.keyUp;

document.getElementById('canvas').onmousemove = E.mouseMove;
document.getElementById('canvas').onmousedown = E.mouseDown;