/**
 * 模块导出
 * API proxy for ibird.
 * Author: yinfxs
 * Date: 2018-9-7 11:09:54
 */

const request = require('superagent')
const namespace = 'ibird-proxy'

let app, opts

/**
 * 国际化配置
 */
const locales = {
  "zh_CN": {
    "locale": "简体中文",
    "hello": "你好"
  },
  "zh_TW": {
    "locale": "繁體中文",
    "hello": "你好"
  },
  "en_US": {
    "locale": "English",
    "hello": "Hello"
  }
}

/**
 * 插件中间件
 */
const middleware = {
  'proxy': async (ctx, next) => {
    const path = ctx.request.path
    const prefix = app.c().prefix
    if (opts.triggerPrefix) {
      const sign = `${prefix}${opts.triggerPrefix}`
      if (path.startsWith(sign)) {
        const url = (typeof opts.urlTransform === 'function') ? opts.urlTransform(path) : path.replace(new RegExp(sign, 'i'), '/api')
        const header = Object.assign({}, ctx.header)
        delete header['host']
        const method = ctx.method.toLowerCase()
        const body = ctx.request.body
        const query = ctx.query
        return ctx.body = await proxyFetch({
          url,
          method,
          query,
          body,
          header
        })
      }
    }
    await next()
  }
}

/**
 * API代理调用
 * @param {object} params 请求参数
 * @param {string} params.url 接口URL
 * @param {string} params.method 请求方法，默认get
 * @param {object} params.query 查询参数
 * @param {object} params.header 请求头
 * @param {object} params.body 请求体
 */
async function proxyFetch({
  url,
  method = 'get',
  query,
  header = {},
  body
}) {
  header["token"] = header["token"] || opts.token
  url = `${opts.endpoint}${url}`
  method = method.toLowerCase()
  const res = await request[method](url)
    .set(header)
    .send(body)
    .query(query)
  return res.body
}

/**
 * 加载回调
 * @param {Object} inst - 应用实例
 * @param {Object} options - 引用选项
 */
function onload(inst, options) {
  app = inst
  opts = options
}

/**
 * 插件API
 */
const api = {
  proxyFetch
}

module.exports = {
  namespace,
  locales,
  onload,
  api,
  middleware
}