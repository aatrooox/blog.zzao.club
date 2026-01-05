---
title: Nuxt3全栈开发 · $fetch、useFetch、useAsyncData 你用对了吗？
date: 2024-11-27
lastmod: 2025-08-19
tags:
  - Nuxt
versions:
  - nuxt@3.14.0
description: Nuxt3中 $fetch、useFetch、useAsyncData 的使用区别，各自的用法，以及最佳实践
---
Nuxt3 中有三种获取数据的方式，看起来有点绕，那实际使用中有什么区别，应该怎样使用呢？

## $fetch

`$fetch` 基于 `ofetch` ，`ofetch` 是一个类似 `axios` 的请求库，可以运行在 node、浏览器、workers 上。

所以它的用法类似原生 fetch 、axios，在 Nuxt3 中全局可用。

- 在 app 中直接向 server 内的 api 发起请求
- 在 app 中向其他服务发出请求
- 在 server 的一个接口中向另一个接口请求
- 在 server 的一个接口中向其他服务发出请求

总之，是一个底层的请求库。

用它是最简单的方法。

但 Nuxt 是一个可以在服务器和客户端两个环境下运行同构代码的框架，如果在 setup 中使用 `$fetch` 来获取数据，可能会导致执行两次，一次在服务器上由 nitro 渲染 html 时，另一次是在客户端水合时。

所以水合是一个必须要理解的过程：

当在浏览器打开一个页面时，首先会在服务端渲染（SSR)，渲染后的**完整 html 代码**会被发送到客户端。此时已经在服务端拿到请求的数据了，所以客户端收到 HTML后，用户已经能够看到内容。

对比单页应用（SPA），浏览器只是加载了一个 带有根元素的的 html 页面，所以此时页面是空白的，还需要在加载完相关 JS文件后，由 JS 去插入内容。所以单页应用只要在根元素 `div id = app` 里写点内容（如loading、骨架），就会早于实际内容出现，达到不白屏的效果。

回到 `Nuxt` ，用户看到内容后，此时页面还无法交互，因为仅仅是渲染了 `HTML`，`Vue` 相关的逻辑还在 `JS` 里，需要下载和执行。

**下载和执行时被 Vue 接管 HTML 的过程就叫水合**，水合后界面就可以响应用户的交互了。

有了渲染方式的差异，才会有其他的请求方式来契合这种渲染方式。

## useAsyncData

从 `vue2` 到 `vue3`，我们都知道多了个选项式和组合式的区别。

选项式中通常把功能集中在一个组件或函数中，每个组件都有 `data`、`methods`，组件内定义属性都会暴漏在函数内部的 `this` 上，指向当前实例。它的特点是，不关心响应式细节，强制按照选项来组织代码，你的后端同事看了 `Vue` 之后都表示很简单。

而组合式（`composable`）的核心思想是直接在函数作用于内定义响应式变量，要比选项式自由和高效的多。

所以 Vue3 的代码中，经常可以看到 `UseXXXX` 这类的函数，其内部就包含响应式变量，也就类似选项式代码中的 `data` 和 `method`。

所以其内部的响应式变量发生变化时，通常会有一个对应的逻辑随之发生变化，可能是另一个响应式变量，也可能是与之对应的`Template`

所以 `useAsyncData` 这个 `composable` ，也有类似的功能和效果。

```typescript
const { data, error, clear, status, refresh } = await useAsyncData('users', () => myGetFunction('users'))
```

`useAsyncData` 第一个参数是唯一键，用于**缓存**第二个参数的**响应**。

所以用 `useAsyncData` 时，在 `SSR` 时和在 `水合` 时，不会发生两次重复的请求。可以保证渲染的一致性。

其次，因为第二个参数只是一个获取数据的匿名函数，所以你可以用它来请求任意的服务，比如你用了其他 CMS服务来管理数据，这时候就应该使用 `useAsyncData`。

这东西竟然有五个返回值，看看都有啥用，怎么就响应式了。

`data`、`error`、`status` 这三个值，都是 Vue 的引用（ Vue refs accessible），也就是说类似于你用 `ref` 提前定义好了一样：

```typescript
const data = ref()
const error = ref()
const status = ref('idle') // 还没请求

const fetchData = async () => {
	status.value = 'pendding'
	const data = await fetch('xxxx').catch( err => {
		error.value = err
		status.value = 'error'
	})
	...
	data.value = res.data
	status.value = 'success'
}
```

这样看能明白了吧。

`data` 就是我们接收返回后的数据的  `Ref` 引用，`error` 同理，`status` 则是类似于在 Vue2 中使用一个 `isFetch` 变量去管理 `loading` 状态。

也可以直接给 data 重命名一下：

```typescript
const { data: userList, error, clear, status, refresh } = await useAsyncData('users', () => myGetFunction('users'))
```

不过要注意，这个 `data.value` 是什么，和第二个参数返回的数据是什么有关，比如你的接口固定返回：

```typescript
{
	code: 200,
	data: [],
	msg: 'ok',
}
```

那要想取得列表渲染要用的数据，应该是 `userList.value?.data` 

因为渲染方式的特点，`useAsyncData` 还可以传入第三个参数 `options` 来控制其行为。

### lazy

默认情况下，页面使用了 `useAsyncData` 来获取数据，这个 `composable` 会等待异步函数的解析，然后再导航到新的页面。

解析会耗时，所以你的导航动作就会有延迟，给人一种：**点了，但是没立马动起来的迟滞感**。

`lazy` 选项可以使其忽略异步函数的解析。

```typescript
const { data: userList, error, clear, status, refresh } = await useAsyncData('users', () => myGetFunction('users'), { lazy: true })
```

此时，当你点击进入一个新的页面时，导航不会被阻塞，但进入后内容可能还没拿到，所以需要使用 `status` 来加载 `loading`、`骨架组件`。

我觉得应该没人想在点击后阻塞导航吧，所以这个 `lazy` 建议一直开启。

### server

上一篇关于在 Nuxt 中使用 Prisma 的文章里，我提到了本地有个 `dev.db` ，线上也有一个 `prod.db` 。

两个数据库里存的东西肯定是不一样嘛，因为本地需要测试。所以我本地的 `userList` 里是 **张三**，线上的 `userList` 是**李四**。

但在 `Nuxt` 打包时，会 `prerender`，预渲染！（我需要本地打包的）

也就是先把接口请求一遍，把真实的 `HTML` 先给组装好，并且还有缓存。因为是为了 SEO，方便搜索引擎快速抓取到页面的内容。

于是，在线上打开用户列表页时，我的张三被显示出来了，因为他就是 HTML 里的内容。

这个时候就需要另一个选项： `server`

当设置 `server: false` 时，第一次渲染就不会去请求数据，也就是会渲染出一个空的用户列表页。

```typescript
const { data: userList, error, clear, status, refresh } = await useAsyncData('users', () => myGetFunction('users'), { lazy: true, server: false })
```

### watch

看到这，我也没看出来 useAsyncData 响应个啥了啊，不就是帮我省下了创建接收数据的 `ref` 和 管理状态的 `ref` 的功夫？

那我们再把**获取列表这个场景**丰富一下。

用户多了，有分页了，应该怎么处理？

```typescript
const page = ref(1)
const changePage = () => {
	myFetchData()
}
```

如果再加个类型的筛选，日期的筛选等等一切和重新获取数据相关的响应式变量，都要写同样的代码。

所以 `useAsyncData` 支持直接 `watch` 响应式变量：

```typescript
const page = ref(1)
const { data: userList, error, clear, status, refresh } = await useAsyncData('users', () => myGetFunction('users'), { lazy: true, watch: [page, tags] })
```

当 `page` 发生变化时，`useAsyncData` 就会重新执行它的 `handler` ，做到刷新数据。

代码量又减少了不少

### 其他选项

和 `vue` 的 `watch` 相比，`useAsyncData` 也有一个 `immediate` 选项，只不过它默认是 `true` ，你可以设置为 `false` 来阻止立即触发请求。

还有一种场景，使用一个接口获取一组比较大的数据比如文章时，有时候不需要文章的内容，每次都传输内容的话，数据量太大了，影响传输速度。 

可以使用 `pick` 选项，选取指定的键：`pick: ["title", "description"]`

还有 `deep` 选项，默认为 `true` ，如果不需要深度深度响应时，可以设置为 `false` 以提高性能。

其他选项就不一一介绍了，我直接放在这里，后续发现比较有用的场景，再来分享。

```typescript
type AsyncDataOptions<DataT> = {
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  deep?: boolean
  dedupe?: 'cancel' | 'defer'
  default?: () => DataT | Ref<DataT> | null
  transform?: (input: DataT) => DataT | Promise<DataT>
  pick?: string[]
  watch?: WatchSource[]
  getCachedData?: (key: string, nuxtApp: NuxtApp) => DataT
}
```

现在可以确定，`useAsyncData` 可以帮助缓存数据，防止多次请求，保证渲染的一致性。提供响应式的 `data`、`error`、`status` 来完成页面的渲染，同时提供一些选项来控制其行为。

最后再来捋一捋什么场景下使用什么选项的问题：

![](https://img.zzao.club/article/202411271747999.png)

**PS：这图我在 Youtube 刷到的，但是没截屏，所以凭借印象又画了一遍**

那 `useFetch` 还有什么活能整吗？

## useFetch

`useFetch` 的整活就像是：

虽然在 `script` 需要使用 `.value` 获取响应式数据，但 `template` 中不需要，因为 `Vue` 帮你处理了。

以前 `props` 解构会失去响应式，现在（3.5+）解构也能直接用了。

是的，它就是个语法糖一样，是 `useAsyncData` 和 `$fetch` 的包装器。

它不用传第一个 `key` 值，会根据 url 和选项自动生成，并且可以推断 API 的响应类型。

同时有着和 useAsyncData 一样的第三个参数（选项），但做了一些增强。

还是拿刚才获取用户列表的场景举例，我们监听 `page`、`tags`，变化时会再次请求。

在 `useFetch` 中可以再进一步：

```typescript
const page = ref(1)
const { data: userList, error, clear, status, refresh } = await useFetch('/api/user/list', { page }, { lazy: true })
```

我们只需要传入 `page` 这个响应式变量，`useFetch` 就会追踪到这个响应式变量。

类似 `watch` 和 `watchEffect`。一个需要显式的传入，一个会自动的追踪。

但是这里要注意：`{ page }` 等价于 `{ page: page }`， 而不是 `{ page: page.value }`

**`page.value` 只是一个值！** 所以要传入的是 `page` 这个 `ref对象`

**使用 `useFetch` 后代码被进一步简化。**

所以在思考使用 `useFetch` 还是 `$fetch`  来进行接口请求时就十分明了了：

一般基于用户的交互才去做出反应的，就用 `$fetch` 就可以。 

如果基于页面状态需要重复获取数据的，就用 `useFetch` 。

但刚才也强调了，传入的是一个 `ref对象` 才会时 `useFetch` 正常的响应式的自动请求，所以如果是**想统一请求方式**，也可以选择直接传值给 `useFetch` ，这样他就像一个普通的增强版 `$fetch` 一样了。

但 `useFetch` 返回的值还是个响应式的，使用 `$fetch` 的场景很多都不需要返回值再触发其他响应，所以显得有些"多余"。

怎么取舍就看自己了。

## 最佳实践

我在项目中以使用 `useFetch`为主 , 那怎么封装 `useFetch` 用起来才最顺手呢？

经过我自己的使用，以及搜索多个关于 `useFetch` 的使用。最后在最少三个博客站内发现了同样的封装代码，究竟谁是作者我也不清楚，代码里也没有说明，这里直接贴给大家，再分析如何使用。

`composables/useHttp.ts`

```typescript
import type {FetchError, FetchResponse, SearchParameters} from 'ofetch';
import {hash} from 'ohash';
import type {AsyncData, UseFetchOptions} from '#app';
import type {KeysOf} from '#app/composables/asyncData';
type UrlType = string | Request | Ref<string | Request> | (() => string | Request);

type HttpOption<T> = UseFetchOptions<ResOptions<T>, T, KeysOf<T>, any>;
interface ResOptions<T> {
    data: T;
    code: number;
    message: boolean;
    err?: string[];
}

function handleError<T>(
    _method: string | undefined,
    _response: FetchResponse<ResOptions<T>> & FetchResponse<any>,
) {
    // Implement error handling logic here
    if (_response?._data?.statusCode === 401) { 
      // setUser('')
    }
    console.error(`[useHttp] [error] ${_method}:`, _response);
}

function checkRef(obj: Record<string, any>) {
    return Object.keys(obj).some(key => isRef(obj[key]));
}

function fetch<T>(url: UrlType, opts: HttpOption<T>): AsyncData<ResOptions<T>, FetchError<ResOptions<T>>> {
    // Check the `key` option
    const { key, params, watch } = opts;
    if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
        console.error('\x1B[31m%s\x1B[0m %s', '[useHttp] [error]', 'The `key` option is required when `params` or `watch` has ref properties, please set a unique key for the current request.');

    const options = opts as UseFetchOptions<ResOptions<T>>;
    options.lazy = options.lazy ?? true;

    // const { baseUrl } = useRuntimeConfig().public;

    return useFetch<ResOptions<T>>(url, {
        // Request interception
        onRequest({ options }) {
            // options.baseURL = baseUrl;
            // Set the base URL
        },
        // Response interception
        onResponse(_context) {
            // Handle the response
        },
        // Error interception
        onResponseError({ response, options: { method } }) {
            handleError<T>(method, response);
        },
        // Set the cache key
        key: key ?? hash(['api-fetch', url, JSON.stringify({ method: options.method, params: options.params })]),
        // Merge the options
        ...options,
    }) as AsyncData<ResOptions<T>, FetchError<ResOptions<T>>>;
}

export const $http = {
    get: <T>(url: UrlType, params?: SearchParameters, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'get', params, ...option });
    },

    post: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'post', body, ...option });
    }
};

export default function UseHttp() {
    return {
        $http,
    };
}
```

总体封装的很简单，基本没啥看不懂的点，细节还是要自己去扩充。

其中 `ResOptions` 需要根据自己的返回值类型修改

`handleError` 负责在 `onResponseError` 时处理错误。

`onRequest` 可以自行添加比如 `baseUrl` 、自定义 `header` 等。

`lazy` 默认开启是最好用的，loading（status）状态自己维护

使用时的几种情况大概是这样：

1. 基于请求传入的 ref 对象，自动重新请求
2. watch 其他 ref 对象，以重新请求
3. 不需要马上在页面中展示的，`server: false`
4. 除此之外基本用默认配置就可以了

```typescript
// hash('memo-list-search')
const { data: memoList, error, status } = await $http.get('/api/v1/memo/list', { page: 1, size: 100 }, { key: hash('memo-list-search'), server: false, watch: [user, refreshKey] })

const { data: memoList, error, status } = await $http.get('/api/v1/memo/list', { page, size: 100 }, { key: hash('memo-list-search'), server: false })
```

重点是 `key` 。

如果需要响应式请求，则**必须传入 key 值**，传入的对象会被 `checkRef(params)` 检测是不是 `Ref` ，其他选项（options）还是可以正常传入。

虽然代码里有个默认的 key 值，只是会打印一个错误，但这个 key 还是**建议手动传入**，以免造成key值重复时，发生错误的缓存问题。

虽然这里封装了 `handleError` ，但实际上我没发现没什么用，原因是我用的 `primevue/toast` 目前不能套在 `useFetch` 这个 `composable` 中使用。我基本尝试了 `github` 和 `stackoverflow` 能搜到的几种方式都没有奏效。 

而发生错误时提示出来基本是必做的一个动作，所以我只能把 `show error toast` 这个动作，放在了另一个 `composable` （useErrorDispose）中，在使用 $http 的 vue 文件中，使用这个 `useErrorDispose` 处理 `error.value`，以及本地的缓存信息。也算是完成了我的需求。

另外，请求时，（公司中）一般会设置 header 中携带 token，但实际上没有比 cookie 更好用

```typescript
{
    httpOnly: true,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 2592000, // maxAge 优先级高， expires 受客户端时间的影响
    secure: true,
    domain: 'abc.com',
  }
```

这样设置后，也能节省不少（操作 localstorage 的）代码，还比使用 `localstorage` 存储 `token` 再放在 `header` 上更安全一些。

而 `nuxt`（nitro）中操作 `Cookie` 也是十分简单的，可以自行了解一下。

## 总结

以上就是本人在使用 `$fetch`、`useFetch`、`useAsyncData`时的一些经验分享，希望能够帮助到你。

同时，如果你有更多的经验，也希望在评论区指正文中的错误，让大家学到更多

更多 Nuxt 最新的全栈开发内容，欢迎关注「**早早集市**」






 







