---
title: ✨使用umami低成本监控网站流量
date: 2025-03-19
lastmod: 2025-08-19
---
## 👀什么是Umami

`Umami` 是一款开源的、注重隐私的网络分析工具（基于NextJS），可作为 `Google Analytics` 的替代品。它提供有关网站流量、用户行为和性能的重要见解，同时优先考虑数据隐私。

与许多传统分析平台不同，Umami 不会收集或存储个人数据，从而避免了使用 cookie 的需求，并且符合 GDPR 和 PECR 标准。

Umami 设计轻巧、易于设置，可自托管，让用户完全控制自己的数据。

这是我部署后的界面：
![](https://img.zzao.club/article/202503191130622.png)

同时包含了一些访客的浏览器、设备、操作系统等信息

![](https://img.zzao.club/article/202503191130624.png)

以及 `ip` 所在国家

![](https://img.zzao.club/article/202503191130625.png)

在**行为类别**中，还可以看到自己在网站中的埋点

![](https://img.zzao.club/article/202503191130626.png)

总结：  MIT开源、免费、独立部署的网站数据分析工具

## 安装

如果使用Docker那就非常简单了

```shell
# 直接在项目根目录运行
docker-compose up -d

# 或者使用下面镜像 二选一
docker pull docker.umami.is/umami-software/umami:mysql-latest
docker pull docker.umami.is/umami-software/umami:postgresql-latest
```

因为我已经存在一个正在运行的 `Mysql` Docker服务了，所以下面以从源码安装，并以 `PM2` 运行 `Umami` 为例
### 环境要求

`Node >= 18.18`

`Mysql >= 8.0` 或 `PostgreSQL >= 12.14`

### 安装yarn

```shell
npm install -g yarn
```

### 获取源代码

```shell
git clone https://github.com/umami-software/umami.git
cd umami
yarn install
```

### .env 文件

创建一个 `.env` 文件，用于数据库连接

如果你还没有Mysql服务，可以参考我这篇：[【使用Docker启动Mysql】](https://blog.zzao.club/post/nuxt/local-init-mysql-by-docker) 

```txt
DATABASE_URL=mysql://username:mypassword@localhost:3306/mydb
```

将 `username`、`password`、`mydb` 都替换成自己的，其中mydb的创建可以参考：[安装后如何初始化库和新用户](https://blog.zzao.club/post/nuxt/prod-docker-mysql-config)

还可以配置 `PORT=4577`，端口号
### PM2启动

```
yarn global add pm2
cd umami
pm2 start yarn --name umami -- start
pm2 startup
pm2 save
```

如果配置了PORT，PM2命令要对应的修改为

```shell
pm2 start yarn --name umami -- start-env
```

如果不用 `env` 文件，可以直接传递变量

```shell
pm2 start yarn --name umami -- start --port=6001
```

两种方式都可以。

`pm2 startup` 则是为了设置开机自启，`save` 会把当前配置保存起来

### 配置 Nginx

此处仅作为作为参考，适用于配置多个子域名，共用一个泛域名证书

```
http {
	# umami
    upstream upstream_umami{
        server localhost:6001;
    }
	map $host $proxy_pass {
        hostnames;  # 添加这行以优化域名匹配

		# ...省略其他子域名
        umami.xxx.com http://upstream_umami;
    }
	server {
        listen 443 ssl; 
        server_name *.xxx.com; #泛域名
        
        ssl_certificate /etc/nginx/certs/xxx
        ssl_certificate_key /etc/nginx/certs/xxx

        fastcgi_param  HTTPS        on;
        fastcgi_param  HTTP_SCHEME     https;

        location / {
            add_header X-Final-Destination $upstream_addr;
            
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   Host              $http_host;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            
            proxy_pass $proxy_pass; 
        }

    }
}
```

配置成功后，`nginx -t` 检测是否有错误，如果没错就 `restart nginx`

然后再访问配好的子域名 `umami.xxx.com` 是否有效就可以了
## 使用

`umami` 的使用也非常简单，首先打开 `umami.xxx.com` ，也就是自己配好的地址

### 基本配置

登录 => 设置 => 修改密码 + 修改语言

- 默认用户名: admin
- 默认密码：umami

![](https://img.zzao.club/article/202503191130627.png)
找到用户这里

![](https://img.zzao.club/article/202503191130628.png)

修改语言直接点击右上角的国际化图标即可

设置好后，在**设置 -> 网站 -> 添加网站**中，输入自己的网站名字和域名

![](https://img.zzao.club/article/202503191130629.png)

添加好点击**编辑**按钮

![](https://img.zzao.club/article/202503191130630.png)

然后就可以看到自己的网站lD、跟踪代码

![](https://img.zzao.club/article/202503191130631.png)

接下来就是要把跟踪代码添加到当前网站项目中

以 `Nuxt` 为例

在 `nuxt.config.ts` 中，添加如下配置

```typescript
export default defineNuxtConfig({
	app: {
		head: {
			script: [
				{
					src: 'https://umami.xxx.com/script.js',
			        defer: true,
		            "data-website-id": "your_data_website_id"
				}
			]
		}
	}
})
```

把 `src` 和 `data-website-id` 替换成自己的即可

重新打包、发布Nuxt应用后，umami的统计就会立即生效了，可以前往 `umami.xxx.com` 去看访问数据

### 埋点

要想记录某个按钮的点击行为，以及传递一些用户信息来记录，需要用到 `Umami` 的 `Track Events`

```html
<button id="signup-button" data-umami-event="Signup button" data-umami-event-id="123">Sign up</button>
```

`data-umami-event` ：表示记录的事件名
`data-umami-event-*` ：表示给事件传递的属性 `{ id： "123"}` 会这样被记录下来

这种使用 `html` 属性的方式，所有数据会保存为字符串，记录一些基本动作也是够用的

也可以使用 JS 的方式来主动调用

引入 `umami/script.js` 时，会在全局注入一个 `umami` 对象，所以直接使用：

```js
umami.track(event_name: string, event_data: object);
```

如果不传 `event_name`，记录的就是页面浏览事件，比如这样

```js
umami.track({ website: 'e676c9b4-11e4-4ef1-a4d7-87001773e9f2', url: '/home', title: 'Home page' });
```

记录时只会记录 `url` 和 `title` ，如果要包含 `umami` 默认的属性

```js
umami.track(props => ({ ...props, url: '/home', title: 'Home page' }));
```

所以刚才按钮的事件可以这样记录：

```js
umami.track('signup-button', { name: 'newsletter', id: 123 });
```

## 总结

以上就是 `Umami` 的安装和在项目中的使用。

内存占用方面，使用 `node` 作为运行时，`pm2` 显示umami占用内存在 `80 ~ 200` mb之间，不知道流量比较大的站点内存消耗如何。

但作为安装、运行、使用上来说，`umami` 集成非常简单易用，推荐大家使用

欢迎在评论区交流