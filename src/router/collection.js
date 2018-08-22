import Router from 'koa-router'

import db from '../db'

const router = new Router()

router
  .get('collection', '/', async ctx => {
    ctx.assert(db.has(ctx.params.name), 404)

    const data = await db.index().findOne({
      name: ctx.params.name
    })

    ctx.body = {
      kind: 'collection',
      data
    }
  })
  .delete('collection', '/', async ctx => {
    await db.remove(ctx.params.name)

    ctx.status = 204
  })
  .post('method', '/:method', async ctx => {
    ctx.assert('args' in ctx.request.body, 400, `Field 'args' should be provided in body`)
    ctx.assert(Array.isArray(ctx.request.body.args), 400, `Field 'args' should be an array of arguments passed to Nedb instance method`)
    ctx.assert(!!ctx.request.body.args.length, 400, `No arguments provided in 'args' field`)

    const collection = db.get(ctx.params.name)

    ctx.assert(typeof collection[ctx.params.method] == 'function', 400, `Unknown Nedb instance method: '${ ctx.params.method }'`)

    const data = await collection[ctx.params.method](...ctx.request.body.args)

    ctx.body = {
      kind: 'collection#' + ctx.params.method,
      data
    }
  })

export default router
