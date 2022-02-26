// file watcher
const spawn = require('child_process').spawn
const chokidar = require('chokidar')
const path = require('path')

const spawnServer = () => {
  return spawn('node', ['server.js'])
}

let server = spawnServer()

const fileWatcher = () => {
  const watchedPaths = path.join(process.cwd(), '/**/*')
  const ignoredPaths = /node_modules|db.json/

  chokidar.watch(watchedPaths, {ignored: ignoredPaths}).on('change', (event, path) => {
    console.log(event)
    console.log('reload...')
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
