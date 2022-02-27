const spawn = require('child_process').spawn
const chokidar = require('chokidar')
const path = require('path')

const cwd = process.cwd()

const spawnServer = () => {
  return spawn('node', [path.join(cwd, '.wapoc/server.js')])
}

let server = spawnServer()

const fileWatcher = () => {
  const watchedPaths = path.join(cwd, '/**/*')
  const ignoredPaths = /node_modules|db.json/

  chokidar.watch(watchedPaths, {ignored: ignoredPaths}).on('change', path => {
    console.log('changed', path)
    console.log('reloading...')
    reload()
  })
}

const reload = () => {
  if (server) {
    server.kill('SIGTERM')
  }

  server = spawnServer()
}

fileWatcher()
