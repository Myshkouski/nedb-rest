import Axios from 'axios'

class NedbCollection {
  constructor(options) {
    this._transport = options.transport
    this._name = options.name
  }

  async method(method, ...args) {
    const {
      data
    } = await this._transport.post(this._name + '/' + method, {
      args
    })

    return data
  }
}

class NedbClient {
  constructor() {
    let config = {},
      urlScheme = 'http://',
      baseURL

    if (typeof arguments[0] == 'object') {
      config = arguments[0]
      if (config.secure) {
        urlScheme = 'https://'
      }
      baseURL = urlScheme + config.host || config.hostname + ':' + config.port
    } else if (typeof arguments[0] == 'string') {
      baseURL = urlScheme + arguments[0]
    }

    this._transport = Axios.create({
      baseURL
    })

    this._config = config
  }

  collection(name) {
    return new NedbCollection({
      transport: this._transport,
      name
    })
  }
}

export default NedbClient
