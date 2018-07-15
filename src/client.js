import Rapid from 'rapid.js'

class NedbClient extends Rapid {
  constructor() {
    let config = {}, urlScheme = 'http://', baseURL

    if(typeof arguments[0] == 'object') {
      config = arguments[0]
      if(config.secure) {
        urlScheme = 'https://'
      }
      baseURL = urlScheme + config.host || config.hostname + ':' + config.port
    } else if(typeof arguments[0] == 'string') {
      baseURL = urlScheme + arguments[0]
    }

    super({
      baseURL
    })

    Object.assign(this.config, config)
  }

  collection(name) {
    return this.append(name)
  }

  async method(name, ...args) {
    if(!this.urlParams) {
      throw new Error('Database name parameter has not been set')
    }

    const { data } = await this
      .append(name)
      .withParams({
        args
      }).post()

    return data
  }
}

export default NedbClient
