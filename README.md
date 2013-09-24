floxel
======

Simple voxel based strategy game engine

Running the Server
======

Setup floxel or another host name in your /etc/hosts and create a matching
web server. If you use a host other than floxel you will need to update the 
value of S.server in settings.js. For example in nginx:

```
server {
	server_name floxel;
	
	location / {
		alias /web/floxel/;
	}
	
	location /server/ {
		proxy_pass         http://127.0.0.1:1337/;
		proxy_redirect     off;
	#	proxy_buffering off;
		proxy_set_header   Host             'floxel';
		proxy_set_header   X-Real-IP        $remote_addr;
		proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
		proxy_max_temp_file_size 0;
	}
}
```

Then, run the map server, in the server directory of the repo: 

```
node PATH_TO_FLOXEL/server/server.js
```