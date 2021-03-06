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
      console.log('LOGIN')
      users[message.username] = ws
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === Websocket.OPEN) {
          client.send(JSON.stringify({ type: 'LOGIN', info: `${message.username} has connected` }))
        }
      })
    } else if (message.type === 'INIT') {
      console.log('INIT')
      const user = users[message.to]
      user.send(JSON.stringify({
        type: 'INIT_REQUEST',
        load: message.request,
        sender: message.username
      }))
    } else if (message.type === 'ACCEPT') {
      console.log('ACCEPT') 
      const user = users[message.to]
      user.send(JSON.stringify({
        load: message.load,
        from: message.from,
        type: 'ACCEPT_REQUEST'
      }))
    }
  })
})

app.listen(3000, () => console.log('App running on port 3000...'))