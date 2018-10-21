const express = require('express')
const Websocket = require('ws')

const app = express()
const wss = new Websocket.Server({ port: 8080 })

app.use(express.static('app'))

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === Websocket.OPEN) {
        client.send(message);
      }
    })
  })
})

app.listen(3000, () => console.log('App running on port 3000...'))