const express = require('express')
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const app = express()

const getFile = filePath => fs.readFileSync(path.join(__dirname, filePath))

// prepare scripts to inject
const files = [
  { path: ".wapoc/live-reload.js" },
  { path: ".wapoc/tailwindcss.js" },
  { path: "node_modules/alpinejs/dist/cdn.min.js", defer: true },
  { path: "node_modules/axios/dist/axios.min.js" },
  { path: ".wapoc/yank.js" }, // must be loaded after axios
]

const filesToInject = "<body>" + files.reduce((full, file) => full + `<script src="${file.path}" ${file.defer ? "defer" : ""}></script>\n\n`, "") + "</body>"

// catch all get requests
app.get('/*', function (req, res) {
  servePage(req.params[0], res)
})

// decide what page to serve
const servePage = (route, res) => {
  res.status(200)

  // if route is empty, serve index.html page
  if (!route) {
    route = 'index.html'
  }

  // if route points to folder containing index.html
  if (fs.existsSync(path.join(route, 'index.html'))) {
    route = path.join(route, 'index.html')
  }

  // if the route points to a file without the .html extenssion
  if(fs.existsSync(route + '.html')) {
    route += '.html'
  }

  // if the route is invalid, get 404
  if(!fs.existsSync(route) || !path.extname(route)) {
    route = '404.html'
    res.status(404)
  }

  // load page to serve
  let file = getFile(route)

  // if page is html file, inject scripts
  if (route.endsWith('.html')) {
    file = filesToInject + file
  }

  res.end(file)
}

// open web socket port for 2 way communication with client
new WebSocket.Server({port: 3001})
// start api server
app.listen(3000)

