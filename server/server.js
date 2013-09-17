var F,S,V;

F = {};

S = {
	host: '127.0.0.1',
	mapFile: 'data/map.json',
	port: 1337
};

V = {
	fs: require('fs'),
	http: require('http')
};

F.done = function(res,opt) {
	opt = opt || {};
	
	opt.code = opt.code || 200;
	opt.data = opt.data || {};
	opt.msg  = opt.msg  || '';
	
	res.writeHead(opt.code, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({
		data: opt.data,
		msg: opt.msg
	}));
};

F.fail = function(res,msg) {
	F.done(res,{
		code: 418,
		msg: msg
	});
};

F.ok = function(res,msg) {
	F.done(res,{
		msg: msg
	});
};

F.handle = function(req,res) {
	var mapLoaded,mapSaved;
	
	mapLoaded = function(err,data) {
		data = data.toString('utf-8');
		data = data ?
		JSON.parse(data)
		: {};
		if (err) {
			F.fail(res,'Failed to load map');
		} else {
			F.done(res,{
				data: data,
		  msg: 'Map loaded'
			});
		}
	};
	
	mapSaved = function(err) {
		if (err) {
			F.fail(res,'Failed to save map');
		} else {
			F.ok(res,'Map saved');
		}
	};
	
	if (req.data) {
		V.fs.writeFile(S.mapFile,JSON.stringify(req.data),mapSaved);
	} else {
		V.fs.readFile(S.mapFile,mapLoaded);
	}
};

V.http.createServer(function (req, res) {
	switch(req.method.toLowerCase()) {
		case 'get':
			F.handle(req,res);
			break
			
		case 'post':
			var chunk = '';
			
			req.on('data',function(d) { chunk += d; });
			
			req.on('end',function() {
				req.data = JSON.parse(chunk);
				
				F.handle(req,res);
			});
			break;
			
		default:
			server.fail(res,'Unsupported request type');
	}
}).listen(S.port,S.host);