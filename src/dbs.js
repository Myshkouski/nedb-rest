import path from 'path'
import fs from 'fs'
import async from 'async'
import Nedb from 'nedb-promise'
import Error from 'http-errors'

import paths from '~paths'

const MAX_NAME_LENGTH = 32
const indexDbName = '_index'
const dbs = new Map()

const createPath = name => path.resolve(paths.var, `${ name }.db`)

const createDb = (name, temp) => {
  if(typeof name != 'string') {
    throw new Error(400, 'Database name should be a string')
  }

  if(!name.length || name.length > MAX_NAME_LENGTH) {
    throw new Error(400, `Database name length should contain 1-${ MAX_NAME_LENGTH }`)
  }

  if(dbs.has(name)) {
    throw new Error(400, 'Database name already exists')
  }

  const db = new Nedb({
    autoload: true,
    filename: temp ? undefined : createPath(name)
  })

  dbs.set(name, db)

  return db
}

(async function init() {
  try {
    const indexDb = await createDb(indexDbName, false)

    const dbNames = await indexDb.find({})

    async.forEach(dbNames, async ({ name, temp }) => {
      await createDb(name, temp)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
})()

export const create = async (name, temp) => {
  if(name == indexDbName) {
    throw new Error(400, 'Could not use reserved database name')
  }

  const db = createDb(name, temp)

  await dbs.get(indexDbName).insert({
    name,
    temp: !!temp,
    created: Date.now()
  })

  return db
}

export const remove = async name => {
  if(typeof name != 'string' || !name.length) {
    throw new Error(400, 'Database name should be a string')
  }

  if(!dbs.has(name)) {
    throw new Error(404, 'Database does not exist')
  }

  await dbs.get(indexDbName).remove({ name })

  await new Promise((resolve, reject) => {
    fs.unlink(createPath(name), err => err ? reject() : resolve())
  })

  dbs.delete(name)
}

export const index = () => dbs.get(indexDbName)

export const get = name => dbs.get(name)
export const has = name => dbs.has(name)
