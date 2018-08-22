import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import db from '../db'

const router = new Router()
const collectionRouter = require('./collection').prefix('/:name')

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
  .use(collectionRouter.routes())
  .use(collectionRouter.allowedMethods())
  .get('index', '/', async ctx => {
    const list = await db.index().find({})

    ctx.body = {
      kind: 'collections',
      data: list.map(({
        name
      }) => ({
        name,
        location: ctx.router.url('collection', {
          name
        })
      }))
    }
  })
  .post('/', async ctx => {
    ctx.assert('name' in ctx.request.body, 400, `Field 'name' should be provided in body`)
    ctx.assert(!('inMemory' in ctx.request.body) || typeof ctx.request.body.inMemory == 'boolean', 400, `Field 'inMemory' should be boolean`)

    const {
      name,
      inMemory
    } = ctx.request.body

    await db.create({
      name,
      inMemory
    })

    ctx.set('Location', ctx.router.url('collection', {
      name
    }))

    ctx.status = 201
  })

export default router
