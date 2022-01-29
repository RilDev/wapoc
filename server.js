const express = require('express')
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const app = express()

const getFile = filePath => fs.readFileSync(path.join(__dirname, filePath))

// prepare scripts to inject
const files = [
  ".wapoc/live-reload.js",
  ".wapoc/tailwindcss.js",
  "node_modules/alpinejs/dist/cdn.min.js",
  "node_modules/axios/dist/axios.min.js",
  ".wapoc/yank.js", // must be loaded after axios
]

const filesToInject = "<body>" + files.reduce((full, filePath) => full + `<script src="${filePath}" defer></script>\n\n`, "") + "</body>"

// catch all get requests
app.get('/*', function (req, res) {
  servePage(req.params[0], res)
})

// decide what page to serve
const servePage = (route, res) => {
  if (!route || fs.existsSync(route)) {
    // if route is empty, serve index.html page
    if (!route || !fs.statSync(route).isFile()) {
      route = path.join(route, 'index.html')
    }

    // load page to serve
    let file = getFile(route)

    // if page is html file, append live reload script
    if (route.endsWith('.html')) {
      file = filesToInject + file
    }

    // send page
    res.status(200).end(file)
  } else {
    // if the route doesn't match any file, serve 404 page
    let file = getFile('404.html')
    file = filesToInject + file

    res.status(404).end(file)
  }
}

// open web socket port for 2 way communication with client
new WebSocket.Server({port: 3001})
// start api server
app.listen(3000)

