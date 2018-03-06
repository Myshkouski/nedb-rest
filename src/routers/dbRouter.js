import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import * as dbs from '~/services/dbs'

const router = new Router()

const mapDbKeys = ({
  name,
  temp,
  created
}) => ({
  name,
  temp,
  created
})

const JSON_API_MEDIA_TYPES = ['application/vnd.api+json']
const JSON_API_MEDIA_TYPES_DEV = ['application/json']

const isDevContext = ctx => ctx.app.env == 'development'
const defineApiMediaTypes = ctx => [...JSON_API_MEDIA_TYPES, ...(isDevContext(ctx) ? JSON_API_MEDIA_TYPES_DEV : [])]
const stringifyApiMediaTypes = arrayOfTypes => arrayOfTypes.filter(type => !!type).join(',')

router
  .use(async (ctx, next) => {
    try {
      await next()
    } catch(error) {
      const isDev = isDevContext(ctx)
      ctx.status = 500
      ctx.body = {
        errors: [
          {
            status: 500,
            title: 'JSON API error',
            details: isDev ? error.message : undefined
          }
        ]
      }
    }
  })
  .use(async (ctx, next) => {
    const isDev = isDevContext(ctx)
    const contentTypes = defineApiMediaTypes(ctx)

    try {
      ctx.assert(ctx.request.accepts(contentTypes), 406)
      if (ctx.request.rawBody && ctx.request.rawBody.length) {
        ctx.assert(ctx.request.is(...contentTypes), 415, {
          headers: {
            accept: stringifyApiMediaTypes(contentTypes)
          }
        })
      }

      ctx.state.errors = []

      await next()

      if (Array.isArray(ctx.state.errors) && ctx.state.errors.length) {
        throw ctx.state.errors
      }
    } catch (errorOrErrors) {
      const errors = (Array.isArray(errorOrErrors) ? errorOrErrors : [errorOrErrors]).map(({
        id,
        statusCode: status,
        expose,
        message,
        detail,
        stack,
        headers
      }) => ({
        id,
        status,
        title: expose ? message : undefined,
        detail,
        meta: (isDev || headers) ? {
          headers,
          stack: isDev ? stack : undefined,
        } : undefined
      }))

      const initialError = errors[0]

      if (errors.length > 1) {
        if (initialError.status >= 500) {
          ctx.status = 500
        } else if (initialError.status >= 400) {
          ctx.status = 400
        }
      } else {
        if ('meta' in initialError && 'headers' in initialError.meta) {
          for (let key in initialError.meta.headers) {
            ctx.set(key, initialError.meta.headers[key])
          }
        }
      }

      ctx.body = {
        errors
      }
    } finally {
      ctx.type = contentTypes[0]
    }
  })
  .use(bodyParser({
    strict: true,
    enableTypes: ['json'],
    extendTypes: {
      json: [...JSON_API_MEDIA_TYPES]
    },
    onerror(error, ctx) {
      ctx.throw(415, {
        headers: {
          accept: stringifyApiMediaTypes(defineApiMediaTypes(ctx))
        }
      })
    }
  }))
  .get('/', async ctx => {
    const list = await dbs.index().find({})

    ctx.body = {
      included: list.map(({
        name
      }) => ({
        type: 'database',
        attributes: {
          name
        },
        links: {
          self: ctx.router.url('db', {
            name
          })
        }
      }))
    }
  })
  .get('db', '/:name', async ctx => {
    ctx.assert(dbs.has(ctx.params.name), 404)

    const db = await dbs.index().findOne({
      name: ctx.params.name
    })

    ctx.body = {
      data: mapDbKeys(db)
    }
  })
  .post('/:name/:method', async ctx => {
    ctx.assert('data' in ctx.request.body, 400, `Field 'data' should be provided in body`)
    ctx.assert(Array.isArray(ctx.request.body.data), 400, `Field 'data' should be an array of arguments passed to Nedb instance method`)
    ctx.assert(!!ctx.request.body.data.length, 400, `No arguments provided in 'data' field`)

    const db = dbs.get(ctx.params.name)

    ctx.assert(typeof db[ctx.params.method] == 'function', 400, `Unknown Nedb instance method: '${ ctx.params.method }'`)

    const data = await db[ctx.params.method](...ctx.request.body.data)

    ctx.body = {
      data
    }
  })
  .post('/', async ctx => {
    await dbs.create(ctx.request.body.name, ctx.request.body.temp)

    ctx.status = 201
  })
  .delete('/:name', async ctx => {
    await dbs.remove(ctx.params.name)

    ctx.status = 204
  })

export default router
