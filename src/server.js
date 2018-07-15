import Koa from 'koa'
import minimist from 'minimist'

import argv from './argv'

import dbRouter from './router'

const app = new Koa()

app.use(dbRouter.routes())
app.use(dbRouter.allowedMethods())

export default app
