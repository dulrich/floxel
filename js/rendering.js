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