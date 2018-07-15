import path from 'path'
import fs from 'fs'
import asyncForEach from 'async/forEach'
import Nedb from 'nedb-promise'
import Error from 'http-errors'

import argv from './argv'

const MAX_NAME_LENGTH = 32
const INDEX_DB_NAME = '_index'
const dbs = new Map()

const createPath = name => path.resolve(process.cwd(), argv.db || process.env.DB_PATH || 'var/db/', `${ name }.db`)

const createDb = (name, temp) => {
  if (typeof name != 'string') {
    throw new Error(400, 'Database name should be a string')
  }

  if (!name.length || name.length > MAX_NAME_LENGTH) {
    throw new Error(400, `Database name length should contain 1-${ MAX_NAME_LENGTH } characters`)
  }

  if (dbs.has(name)) {
    throw new Error(400, 'Database name already exists')
  }

  const options = {}

  if (temp !== true) {
    options.autoload = true
    options.filename = createPath(name)
  }

  const db = new Nedb(options)

  dbs.set(name, db)

  return db
}

(async function init() {
  try {
    const indexDb = await createDb(INDEX_DB_NAME, false)

    const dbNames = await indexDb.find({})

    asyncForEach(dbNames, async ({
      name,
      temp
    }) => {
      await createDb(name, temp)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()

export const create = async (name, temp) => {
  if (name == INDEX_DB_NAME) {
    throw new Error(400, 'Could not use reserved database name')
  }

  const db = createDb(name, temp)

  await dbs.get(INDEX_DB_NAME).insert({
    name,
    temp: !!temp,
    created: Date.now()
  })

  return db
}

export const remove = async name => {
  if (typeof name != 'string' || !name.length) {
    throw new Error(400, 'Database name should be a string')
  }

  if (!dbs.has(name)) {
    throw new Error(404, 'Database does not exist')
  }

  await dbs.get(INDEX_DB_NAME).remove({
    name
  })

  await new Promise((resolve, reject) => {
    fs.unlink(createPath(name), (err, data) => err ? reject(err) : resolve(data))
  })

  dbs.delete(name)
}

export const index = () => dbs.get(INDEX_DB_NAME)

export const get = name => dbs.get(name)
export const has = name => dbs.has(name)
