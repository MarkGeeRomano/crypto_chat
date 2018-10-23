const express = require('express')
const Websocket = require('ws')

const app = express()
const wss = new Websocket.Server({ port: 8080 })

app.use(express.static('app'))

const users = {}

wss.on('connection', ws => {
  ws.on('message', message => {
    message = JSON.parse(message)
    if (message.type === 'LOGIN') {
      users[message.username] = ws
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === Websocket.OPEN) {
          client.send(`${message.username} has connected`)
        }
      })
    } else if (message.type.initialize) {
      const user = users[message.to]
      user.send({ request: message.request, sender: message.username })
    } else {
      const user = users[message.to]
      user.send({ response: message.response, sender: message.username })
    }
  })
})

app.listen(3000, () => console.log('App running on port 3000...'))