import commander from 'commander'

commander.option('--db <dbPath>', 'path to store db files')

export default commander.parse(process.argv)
