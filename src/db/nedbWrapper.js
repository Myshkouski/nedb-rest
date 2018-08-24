import path from 'path'
import fs from 'fs'
import EventEmitter from 'events'
import Nedb from 'nedb-promise'
import Error from 'http-errors'

const MAX_NAME_LENGTH = 32
const INDEX_DB_NAME = '_index'

function _createPath(name) {
  return path.resolve(process.cwd(), this._path || 'var/db/', name + '.db')
}

function _create(options = {}) {
  const {
    name,
    inMemory
  } = options

  if (typeof name != 'string') {
    throw new Error(400, 'Database name should be a string')
  }

  if (!name.length || name.length > this._maxNameLength) {
    throw new Error(400, `Database name length should contain 1-${ this._maxNameLength } characters`)
  }

  const dbs = this._dbs

  if (dbs.has(name)) {
    throw new Error(400, 'Database name already exists')
  }

  options = {}

  if (inMemory !== true) {
    options.autoload = true
    options.filename = _createPath.call(this, name)
  }

  const db = new Nedb(options)

  dbs.set(name, db)

  return db
}

export default class Db extends EventEmitter {
  constructor(options = {}) {
    super()

    this._dbs = new Map()
    this._path = options.path
    this._maxNameLength = options.maxNameLength || MAX_NAME_LENGTH
    this._indexDbName = options.indexDbName || INDEX_DB_NAME
  }

  async init() {
    const indexDb = _create.call(this, {
      name: this._indexDbName,
      inMemory: false
    })

    const dbOptions = await indexDb.find({})

    dbOptions.forEach(options => {
      _create.call(this, options)
    })

    this.emit('init', dbOptions)

    return dbOptions
  }

  async create(options = {}) {
    const {
      name,
      inMemory
    } = options

    if (name == this._indexDbName) {
      throw new Error(400, 'Could not use reserved database name')
    }

    const db = _create.call(this, options)

    options = {
      name,
      inMemory: !!inMemory,
      created: Date.now()
    }

    await this._dbs.get(this._indexDbName).insert(options)

    this.emit('created', options)

    return db
  }

  async remove(name) {
    if (typeof name != 'string' || !name.length) {
      throw new Error(400, 'Database name should be a string')
    }

    const dbs = this._dbs

    if (!dbs.has(name)) {
      throw new Error(404, 'Database does not exist')
    }

    const indexDb = await dbs.get(this._indexDbName)
    const options = await indexDb.find({
      name
    })

    if (!options.inMemory) {
      await new Promise((resolve, reject) => {
        fs.unlink(_createPath.call(this, name), (err, data) => err ? reject(err) : resolve(data))
      })
    }

    await indexDb.remove({
      name
    })

    dbs.delete(name)

    this.emit('removed', name)
  }

  index() {
    return this._dbs.get(this._indexDbName)
  }

  get(name) {
    return this._dbs.get(name)
  }

  has(name) {
    return this._dbs.has(name)
  }
}
