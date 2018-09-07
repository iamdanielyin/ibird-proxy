# ibird-proxy

API代理插件

> 注意：代理请求过程中，请求方法、查询参数、请求头和请求体等信息将被原样转发。

## 安装

```sh
npm install ibird-proxy
```

## 引用

```js
const app = require('ibird').newApp();
const proxyAddon = require('ibird-proxy');

app.import(proxyAddon, {
  endpoint: 'https://api.example.com',
  triggerPrefix: '/example_api'
});
```
## 插件信息

- **命名空间** - ibird-proxy
- **引用参数**
  - `endpoint` - 必填，api
  - `triggerPrefix` - 必填，触发API前缀
  - `urlTransform` - 可选，url转换函数，默认规则为`url.replace(new RegExp(app.c().prefix + triggerPrefix, 'i'), '/api')`
  - `token` - 可选，令牌参数
- **API**
  - `proxyFetch(obj)` - 请求转发（参数结构见**请求对象**）
- **中间件**
  - `proxy` - 代理中间件，支持前端请求

### 请求对象

- **url** - 接口URL，必填
- **method** - 请求方法，默认get
- **query** - 查询参数，对象结构
- **header** - 请求头，对象结构
- **body** - 请求体，对象结构
