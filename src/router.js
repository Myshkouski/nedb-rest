import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import * as dbs from './dbs'

const router = new Router()

router
  .use(bodyParser({
    strict: true,
    enableTypes: ['json'],
    onerror(error, ctx) {
      ctx.throw(415, {
        headers: {
          accept: ['application/json']
        }
      })
    }
  }))
  .get('/', async ctx => {
    const list = await dbs.index().find({})

    ctx.body = {
      kind: 'collections',
      data: list.map(({
        name
      }) => ({
        name,
        link: ctx.router.url('db', {
          name
        })
      }))
    }
  })
  .get('db', '/:name', async ctx => {
    ctx.assert(dbs.has(ctx.params.name), 404)

    const data = await dbs.index().findOne({
      name: ctx.params.name
    })

    ctx.body = {
      kind: 'collection',
      data
    }
  })
  .post('/:name/:method', async ctx => {
    ctx.assert('args' in ctx.request.body, 400, `Field 'args' should be provided in body`)
    ctx.assert(Array.isArray(ctx.request.body.args), 400, `Field 'args' should be an array of arguments passed to Nedb instance method`)
    ctx.assert(!!ctx.request.body.args.length, 400, `No arguments provided in 'args' field`)

    const db = dbs.get(ctx.params.name)

    ctx.assert(typeof db[ctx.params.method] == 'function', 400, `Unknown Nedb instance method: '${ ctx.params.method }'`)

    const data = await db[ctx.params.method](...ctx.request.body.args)

    ctx.body = {
      kind: 'collection#' + ctx.params.method,
      data
    }
  })
  .post('/', async ctx => {
    ctx.assert('name' in ctx.request.body, 400, `Field 'name' should be provided in body`)

    const {
      name,
      tmp
    } = ctx.request.body

    await dbs.create(name, tmp)

    ctx.status = 201
  })
  .delete('/:name', async ctx => {
    await dbs.remove(ctx.params.name)

    ctx.status = 204
  })

export default router
