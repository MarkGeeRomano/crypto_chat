import client from './js/client'
import Peer from 'simple-peer'

const peer = new Peer({ initiator: location.hash === '#1', trickle: false })

peer.on('error', (err) => console.log('error', err) )

peer.on('signal', (data) => {
  console.log('SIGNAL', JSON.stringify(data))
  client.socket.send(JSON.stringify(data))
})

Object.assign(window, client)