import Db from './nedbWrapper'
import argv from './argv'

const db = new Db({
  path: argv.db || process.env.DB_PATH
})

db.init().catch(error => {
  console.error(error)
  process.exit(1)
})

export default db
