---
published: 2023-12-13
author: 枣把儿
title: 一个产品要有一个“好底子”：Nest项目搭建
description: Nest 项目搭建
tags: ["Node", "Nest"]
category: 技术
date created: 2023-12-13
lastmod: 2025-08-19
date: 2023-12-13
showTitle: 一个产品要有一个“好底子”：Nest项目搭建
---
大家好，我是枣把儿。

上周搞了一个前端小项目：Pixeled Pic Pro， 是一个用来制作像素风格LOGO的Canvas编辑器。

同样，它的后端也是**本着能用就行，先把功能搞出来**的原则。我来分享一下后端实现过程以及发生的故事~

## “底子”

我一开始要做的项目起名叫：[早早集市](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A)。这是一个从不知道什么时候到23年8月份左右完成构思，在方向上开始清晰起来（当时是这么认为的）的项目。

原因就是，平时脑子里想法太多，多到必须下来，越写越多之后，我就在想怎么把他们搞出来，并且搞的有点联系。

然后再去了几次夜市吃喝之后，我就有了点灵感：我要不整个电子集市吧！

和大家去赶大集一样，每个产品相当于一个摊位，可以在一个入口里，看到所有在营业的"摊位"，并且像大集里的摊主一样，每个产品也是在向互联网用户提供服务或商品。

我仔细想想之后啊，感觉真不错。摊位五花八门，没有限制，我的想法也是天马行空，指不定想做什么，可以取悦自己；有的摊位提供“**商品**”；有的摊位提供“**服务**”；还有的摊位给别的摊位提供商品，个体也可以直接去他那“**进货**”。

打通了自己的想法之后，就越想越顺，也越想越复杂。生怕架构层面无法满足自己的设想。

搜索了很久微服务架构相关文章，问了下前同事（Java、运维）相关的思路（你问我为什么不问现同事？也问了，大部分表示就是用Spring全家桶，也知道微服务，也知道消息队列，也知道k8s。问怎么实现的、怎么设计的。不知道），最后也是给自己泼了泼冷水。

算了，不整那么复杂了，本来搞个项目，也是为了万一35岁以后真不干前端了，给自己留点"互联网遗产"，证明自己来过。别还没开始就给自己折腾"死了"。

冷却下来之后，我还发现，这玩意搞好了是个集市，搞不好不就是个工具站吗，网上一搜一大堆！

你看，果然还是打退堂鼓的时候思路更清晰一些。

但好在这次的构思过程足够深入，冷静下来之后还是让我感觉值得做下去，所以还是继续开始了这个故事。

所以，Pixeled Pic Pro 也是其中一个“摊位”，摊主(名字待定)提供的正是“服务”。

听完了故事，那就一起开始摆摊吧。

## 新建Nest项目

nest提供了 @nestjs/cli 这个包，先来安装一下

```shell
npm i -g @nestjs/cli
```

已经安装完了的话，可以升级一下

```shell
npm update -g @nestjs/cli
```

安装完成之后可以使用 ==nest -h== 查看有哪些命令，后续会经常用到

其中 ==--no-spec== 可以指定不生成测试文件，后面会用到

这里我把服务分为两个，一个gateway服务，用来对外实现api接口及鉴权。 一个主服务，实现所有业务。除非不能满足业务，否则不再拆分。

**PS: 拆出gateway只是为了在实际业务中感受它的好处和坏处，大家自行甄别、自由选择**

开始创建项目！

```shell
nest new 项目名
```

![](https://img.zzao.club/article/202411191446171.png)

选择pnpm后等待安装完成，完成后已经可以运行， 进入项目根目录

```shell
pnpm start:dev
```

打开网站localhost:3000，可以看到Hello World！字样

因为我这里需要有另一个网关服务，所以我再新建一个app，通过monorepo的方式管理

```shell
# generator 可以缩写为 g
nest g app gateway
```

此时可以看到app gateway 已经被创建， 同时自动创建了一个apps文件夹，里面包含两个app

![](https://img.zzao.club/article/202411191446172.png)

安装微服务需要的包：

```shell
# add会安装在dependencies  加参数 -D 会安装在 devDependencies
pnpm add @nestjs/microservices
```

然后改造一下server部分，因为gateway在前，server在后，所以server需要改成微服务，通过TCP和gateway通信

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 7577,
      },
    },
  );
  await app.listen();
```

然后在app.controller.ts里改一下接口，一会用来测试一下

```typescript
@MessagePattern('hello')
  getHello(): string {
    return 'hello by zzstudio-server';
  }
```

来到gateway这边， gateway.module.ts里同样也要注册一下微服务，端口号和上面对应起来

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ZZSTUDIO_SERVER',
        transport: Transport.TCP,
        options: {
          port: 7577,
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
```

然后在gateway.controller.ts里也写个方法测试一下
对了，先用@Inject注入刚才注册的。可以看到有个ts报错，我们回到server那边
```typescript
@Controller()
export class GatewayController {
  @Inject('ZZSTUDIO_SERVER')
  private serverClient: ClientProxy;
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('app')
  getServerHello(): unknown {
    return this.serverClient.send('hello', 'hello');
  }
}
```

把两个项目跑起来测试一下， 因为我们用的zzstudio-server新建的项目，所以跑dev默认启动的是zzstudio-server。

```shell
pnpm start:dev
pnpm start:dev gateway
```

然后浏览器输入localhost:3000/app，可以看到hello by zzstudio-server，通了。

然后再试试打包

```shell
# 这会打包zzstuido-server服务
pnpm build

# 这会打包gateway服务
pnpm build gateway
```

打包完成后，可以看到dist里分别产生了各自服务的文件夹

## 功能梳理

还是按照以前的习惯，做事之前先梳理和拆解，只要不影响核心功能，就放在下一个版本迭代。

也许会有一些同学奇怪，明明是自己的产品，为什么要和公司打工一样，还要搞版本，还要搞大纲，我在公司都没这么搞！

我是这样理解的：首先做产品的核心是==要把一个产品实现==，==过程有序，结果不遗漏==，就和你记账一样，如果你不记的很细致，你就无法总结到底哪些地方不该花钱。其次，你不能等有了用户，再重新完善文档，==因为你说不好是你的产品、还是你的故事、还是你的过程吸引了别人==。最后，这是自己的产品，是自己内心的==乌托邦==，你会本能的对它倾注更多的心血。

这样也能明白，为什么在公司打工为什么提不起劲儿来，因为它不是你的，也不是你感兴趣的，只是一个赚取收入的渠道。 同时也可以知道，如果真的能把公司的产品，代入到自己的产品中，同时被公司领导们注意到，且不被自己的小领导窃取成果，且愿意推举给大领导，且老板也有正确的认知，公司也会因你而精彩（狗头保命）

说完了废话，开始正题。

首先gateway部分。
1. 对外提供接口，可以起一个公共的前缀，比如/api/v1。
2. 如果前端发生了改动，则去修改gateway里的请求逻辑，主服务不需要变
3. 实现鉴权。jwt 双token，前端无感刷新，过滤掉没权限的请求。
4. 如果主服务发生了改动，则去修改gateway里的请求逻辑，前端不需要变

接口目前很简单：
1. 登录注册
	1. 先用用户名密码+邮箱验证码注册
	2. 后续再添加关注公众号注册之类的操作
2. 导出功能 
	1. 次数统计 看看有多少人使用了导出。 相当于埋点了
	2. 导出并压缩 （这是一个不着急实现的公共功能，可以预见其他的产品也会有这个功能）
3. 保存预设，json
4. 保存图片，以一种字符串或者json的形式

其中3，4都不是必须的，先放一放。只要实现了框架结构和基本功能，后续按功能再加就很快了

## 功能实现

实现之前先用图来串一串思路。

> 用的Obsidian的Excalidraw画的


![](https://img.zzao.club/article/202411191446173.png)

然后开始按照这个思路去实现功能，这里我只演示几个关键点。同样代码贴在文末，免费、开源

### JWT模块注册

安装 @nestjs/jwt
```shell
pnpm add @nestjs/jwt
```

gateway.module.ts里注册
```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ZZSTUDIO_SERVER',
        transport: Transport.TCP,
        options: {
          port: 7577,
        },
      },
    ]),
    JwtModule.register({
        global: true,
        secret: 'zzdaddy',
        signOptions: {
          expiresIn: '1d',
        },
      }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
```

### 自定义decorator
我想设置一个开关，标识哪个接口可以不需要登录就访问，没有这个标识的就都需要鉴权

先自定义一个装饰器，用于设置接口是否是公开的（true），没设置就是false

```shell
# 在gateway服务下，新建了一个custom文件夹，里面有一个custom.decorator.ts
nest g decorator custom --project=gateway
```

实现装饰器 custom.decorator.ts

```typescript
export const setPublicRoute = () => SetMetadata('isPublicRoute', true);
```

### 自定义Guard
按照上图的思路，现在应该写一个Guard，用来控制权限
```
# 生成后自己改个名， 我改成了LoginGuard
nest g guard globalGuard --project=gateway --no-spec
```

然后在生成的guard里实现

```typescript
canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublicRoute = this.reflector.getAllAndOverride('isPublicRoute', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublicRoute) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      // 这里会报没有user, 可以用declare module 给上边的 Request 在类型空间定义一下user
      request.user = data.user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
```

guard要想生效，还要在gateway.module.ts里注册一下

```typescript
 providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    GatewayService,
  ],
```

此时注册完成后，再去浏览器请求一下 /app 接口，可以发现已经被拦截住了

```typescript
{
  message: "用户未登录",
  error: "Unauthorized",
  statusCode: 401
}
```

### 自定义Filter
拦截住之后，问题就来了，貌似公司里Java接口，返回的都是内种的格式，我怎么自定义自己的返回格式
再回顾上图，实现一个过滤器，因为401是抛出了一个错误，会被filter捕捉到
再从custom里建一个filter吧，建完了把名字改改

```shell
nest g filter custom --project=gateway --no-spec
```

实现一下功能，因为他会捕捉所有错误，也就是你其他地方抛出来的不是HttpException的错误也会在这里捕捉到，所以要判断一下。

```typescript
@Catch()
export class HttpCatchFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

	// 我把自己代码写错导致的错误都返回500
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 使用exception的message 也可能是 exception.message.message 或 exception.message.error
    let message = exception.message;
    // 使用了参数校验之后，多个参数校验不通过，会返回一个数组，所以这里合并了一下，优化展示
    if (exception instanceof HttpException) {
      let res = exception.getResponse() as { message: string[] };
      message = res?.message?.join
        ? res?.message?.join(',')
        : exception.message;
    }
    // 这里json的格式、字段、内容，自己随便写
    response.status(statusCode).json({
      code: statusCode,
      message,
      error: 'Bad Request',
    });
  }
}

```

写完同样需要在gateway.module.ts里的providers下注册（其他全局注册方式建议自行查阅）

```typescript
providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
        provide: APP_FILTER,
        useClass: CommonErrorCatchFilter,
      },
    GatewayService,
  ],
```

再回到浏览器看一下/app接口, 在校验失败的情况下，返回结果已经变成了我们想要的结构

```json
{
  code: 401,
  message: "用户未登录",
  error: "Bad Request"
}
```

然后再把刚才写的setPublicRoute给/app这个接口用一下

```typescript
@Get('app')
@setPublicRoute()
getServerHello(): Observable<any> {
  return this.serverClient.send('hello', 'hello');
}
```

再去浏览器看一下，hello by zzstudio-server，这个内容又出来了。

写完了别忘了保存啊。我都忘了，还以为哪里写错了呢。

然后再实现一个post接口试试看

```typescript
@Post('login')
@setPublicRoute()
login(): Observable<any> {
  return this.serverClient.send('login', { username: 1, password: 2 });
}
```


然后在我的主服务里，接受这个请求，然后返回俩token

```typescript
@MessagePattern('login')
  login(): object {
    return {
      access_token: '123456',
      refresh_token: '123456',
    };
  }
```

然后再拿postman、postwoman、apifox去请求试一试，我用的apifox

![](https://img.zzao.club/article/202411191446174.png)

可以看到，拿到了数据，但明显还不是我们想要的结构。
###  自定义interceptor
所以我们再回顾一下上图，可以在interceptor里去处理一下next.handle() 之后的数据
再回顾上图，实现一个拦截器
再从custom里建一个吧，建完了把名字改改

```shell
nest g interceptor custom --project=gateway --no-spec
```

实现一下功能

```typescript
@Injectable()
export class HttpCommonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    // 201时返回200
    if (response.statusCode === HttpStatus.CREATED)
      response.status(HttpStatus.OK);
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          data,
          message: 'ok',
        };
      }),
    );
  }
}
```

也需要在gateway.module.ts里注册一下
```typescript
providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCommonInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CommonErrorCatchFilter,
    },
    GatewayService,
  ],
```

然后再去apifox请求看一下
![](https://img.zzao.club/article/202411191446175.png)

是我们想要的格式了。

### 权限校验部分

我新建一个auth模块， 在里面实现login、refreshToken接口
 
```shell
nest g resource auth --project=gateway --no-spec
```

登录接口，返回两个token，给到前端之后，前端请求时需要在headers里携带access_token，当提示前端已过期时，前端再用refresh_token去请求refresh接口。refresh接口则会再返回两个新的token。以此达到无限续签。
```typescript
@Post('login')
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    let userInfo = await this.authService.login(user);
    if (userInfo) {
      const access_token = this.jwtService.sign(
        {
          user: {
           ...
          },
        },
        {
          expiresIn: '60m',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: userInfo.id,
        },
        {
          expiresIn: '7d',
        },
      );

      res.setHeader('token', access_token);
      return {
        access_token,
        refresh_token,
      };
    }
  }

   @Get('refresh')
  async refresh(@Query() refreshParams: refreshDto) {
    try {
      const data = this.jwtService.verify(refreshParams.refreshToken);

      const user = await this.authService.findUserById(data.userId);

      const access_token = this.jwtService.sign(
        {
          ...
        },
        {
          expiresIn: '60m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
```

使用typeorm链接mysql

```shell
pnpm add typeorm @nestjs/typeorm mysql2
```

在gateway.module.ts里注册。synchronize: true时 user表会自动创建。不过这里只是为了演示，实际上我是在主服务里维护的user模块
```typescript
TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'zzstudio',
          synchronize: true,
          logging: true,
          entities: [User],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
    }),
```

这样，实现了基本的接口之后，再配合上边写的自定义Guard，就可以实现对权限的校验了。细节部分，我就不展开了，对大家意义也不大。

本地开发的话，我是用的docker desktop，先跑一个mysql，这样感觉比较省事。后续上线的话，我用的是docker-compose，把服务+mysql+redis 一起编排上线

ok。结束

PS：后续更新的方向，将会按照故事的发展进行，但每一个系列我也会尽快收尾。

## 小结

这次分享了一下我最初构思的那个项目的大概背景和设定。以及从零搭建一个Nest项目，按照上边流程，搭建出来是没问题的。

因为我自己的服务早就写完了，这次我专门从头建了一个项目，又码了一遍，后面可能鉴权，token方面写的不太细致。因为感觉这种教程应该是一搜一大堆了，我再重新来一遍意义不大。

代码我还是会尽快放在[**Github**](https://github.com/zzdaddy/nestjs-template-zz)中，作为v0.1.0版本，后续会把鉴权、日志、文件、邮箱、支付等等一些公共的模块会更新在这个仓库里，需要的同学可以pull下来，再自己改改，作为项目的启动模版。

当然，有任何问题也可以在公众号：[**早早集市**](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A) 找到我。后面我会持续分享早早集市里的每一个“摊位”的诞生和迭代过程，但**不构成**对大家技术栈、代码规范、命名方式、架构层面合理性等等见仁见智的角度的**任何建议**。

大家就当听个故事，新手的话顺便还能入个门，半路进厂想做全栈的也可以参考一下我的思路，也欢迎来找我一起交流 ~

感谢阅读，我是枣把儿 ~




