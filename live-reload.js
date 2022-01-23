(() => {
  console.log('live reload initialized!')
  let socket = new WebSocket('ws://localhost:3001');
  let retries = 0

  // when the server restarts, reloads the page
  const reloadOnConnect = () => {
    retries++

    // stop trying to connect after too many attempts
    if (retries > 50) {
      console.error('impossible to connect to dev server!')
      return
    }

    // re-instanciate web socket
    socket = new WebSocket('ws://localhost:3001');
    // if couldn't connect, re-invoke reloadOnConnect
    socket.addEventListener('error', () => {
      setTimeout(reloadOnConnect, 100)
    })
    // if server restarted, relaod the page
    socket.addEventListener('open', () => {
      location.reload();
    })
  }

  // when a file is changed, the server restarts, the socket is closed
  // try to reconnect to the restarted server
  socket.addEventListener('close', () => {
    console.log('try to reconnect to dev server...')
    reloadOnConnect()
  });
})()
