import Koa from 'koa'

import dbRouter from './dbRouter'

const app = new Koa()

app.use(dbRouter.routes())
app.use(dbRouter.allowedMethods())

const PORT = 27001
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${ HOST }:${ PORT }`)
})

export default app
