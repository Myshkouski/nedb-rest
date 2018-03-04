import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import * as dbs from './dbs'

const router = new Router()

const mapDbKeys = ({ name, temp, created }) => ({ name, temp, created })

router
  .use(bodyParser({
    enableTypes: ['json']
  }))
  .get('/', async ctx => {
    const list = await dbs.index().find({})

    ctx.body = {
      data: {
        databases: list.map(mapDbKeys)
      }
    }
  })
  .get('/:name', async ctx => {
    ctx.assert(dbs.has(ctx.params.name), 404)

    const db = await dbs.index().findOne({ name: ctx.params.name })

    ctx.body = {
      data: mapDbKeys(db)
    }
  })
  .post('/:name/:method', async ctx => {
    const db = dbs.get(ctx.params.name)

    ctx.assert(typeof db[ctx.params.method] == 'function', 400, `Unknown nedb instance method: '${ ctx.params.method }'`)

    const data = await db[ctx.params.method](ctx.request.body)

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
