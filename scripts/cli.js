const commander = require('commander')
const {
  version
} = require('../package')

const timeoutOption = ['-t, --timeout <timeout>', 'set timeout in ms', parseInt]
const verboseOption = ['-v, --verbose', 'verbose output (usage, etc.)']

commander.version(version)

commander.command('serve')
  .description('run NeDB web server')
  .option('-p, --port <port>', 'set listening port', parseInt)
  .action(options => {
    require('../lib/runServer')({
      port: options.port,
      log: true
    })
  })

commander.parse(process.argv)
