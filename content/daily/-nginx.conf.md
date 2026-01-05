---
title: -nginx.conf
date: 2025-02-19
lastmod: 2025-02-19
---
# -nginx.conf

#公司 

/Users/2.0gnak/code/isoftstone/nginx/nginx.conf


```shell
docker run -d \
  --name local-proxy \
  -p 80:80 \
  -v /Users/2.0gnak/code/isoftstone/nginx/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

本地 nginx.conf， 如果 nginx 跑在 docker 里，需要把 `127.0.0.1 `替换成 `host.docker.internal`

举例：使用 `nginx` 代理到某个环境的下，然后某个菜单代理到本地 `localhost:9527` 

```yaml
location /abcd.html {
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host  $http_host;
  proxy_set_header X-Nginx-Proxy true;
  proxy_set_header Connection "";
  proxy_pass http://host.docker.internal:9527/abcd.html;
  proxy_redirect default;
  #root   html/dist/;
  #index  index.html index.htm;
}
```