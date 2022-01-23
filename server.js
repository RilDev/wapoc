const express = require('express')
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const app = express()

// load the live-reload script to inject it in the served html files
const liveReload = fs.readFileSync(path.join(__dirname, "live-reload.js"))

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
    let file = fs.readFileSync(path.join(__dirname, route))

    // if page is html file, append live reload script
    if (route.endsWith('.html')) {
      file = `<script>${liveReload}</script>\n\n${file.toString()}`
    }

    // send page
    res.status(200).end(file)
  } else {
    // if the route doesn't match any file, serve 404 page
    let file = fs.readFileSync(path.join(__dirname, '404.html'))
    file = `<script>${liveReload}</script>\n\n${file.toString()}`

    res.status(404).end(file)
  }
}

// open web socket port for 2 way communication with client
new WebSocket.Server({port: 3001})
// start api server
app.listen(3000)

