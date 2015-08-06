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

var F,H,S,V;

F = {};

H = {};

H.map = {};

H.map.load = function(req,res) {
	var mapLoaded;
	
	mapLoaded = function(err,data) {
		data = data.toString('utf-8');
		data = data
			? JSON.parse(data)
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
	
	V.fs.readFile(
		V.path.join(S.basePath,S.dataPath,req.urlA.slice(-1)[0]),
		mapLoaded
	);
};

H.map.save = function(req,res) {
	var mapSaved;
	
	mapSaved = function(err) {
		if (err) {
			F.fail(res,'Failed to save map');
		} else {
			F.ok(res,'Map saved');
		}
	};
	
	V.fs.writeFile(
		V.path.join(S.basePath,S.dataPath,req.urlA.slice(-1)[0]),
		JSON.stringify(req.data),
		mapSaved
	);
};

S = {
	basePath: "/code/floxel",
	dataPath: "server/data",
	host: "127.0.0.1",
	port: 1337
};

V = {
	fs: require('fs'),
	http: require('http'),
	path: require("path")
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
	var found,head;
	
	found = false;
	head = H;
	
	req.urlA = F.parsePath(req.url);
	
	req.urlA.forEach(function(v,k) {
		if (!found && head[v]) head = head[v];
		if (!found && (typeof head === 'function')) {
			found = true;
			head(req,res);
		}
	});
	
	if (!found) F.fail(res,'Unknown resource "'+req.urlA.join('/')+'"');
	
};

F.parsePath = function(path) {
	return path.split('/').filter(function(v) {
		return v !== '';
	});
};

V.http.createServer(function (req, res) {
// 	console.log(req);
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
}).listen(S.port,S.host,function() {
	console.log("Floxel server started ["+S.host+":"+S.port+"]");
});
