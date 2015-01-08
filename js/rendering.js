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

var R;

R = {
	aspect: W.width / W.height,
	far: 10000,
	near: 0.1,
	viewAngle: 45
};

R.renderer = new T.WebGLRenderer();

R.camera = new T.PerspectiveCamera(R.viewAngle,R.aspect,R.near,R.far);

R.scene = new T.Scene();

R.camera.position.set(200,-400,800);
R.camera.rotation.set(0.5,0,0);

R.renderer.setSize(W.width,W.height);

R.scene.add(R.camera);
