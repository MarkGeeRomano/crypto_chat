import Peer from 'simple-peer'
import araCrypto from 'ara-crypto'
import { Buffer } from 'buffer'

const socket = new WebSocket('ws://localhost:8080')

socket.addEventListener('open', () => console.log('Connected to socket on 8080'))

socket.addEventListener('message', ({ data }) => {
	const _data = JSON.parse(data)
	if (_data.type === 'LOGIN') {
		console.log(_data.info)
	} else if (_data.type === 'INIT_REQUEST') {
		console.log({INIT_REQUEST:_data})
		peer = new Peer({ initiator: false, trickle: false })
		peer.signal(_data.load)
		peer.on('signal', signal => {
			console.log('Accepting...')
			socket.send(JSON.stringify({
				from: username,
				to: _data.sender,
				load: signal,
				type: 'ACCEPT'
			}))
		})
		peer.on('connect', () => console.log('connected'))
		peer.on('data', data => console.log(data))
	} else if (_data.type === 'ACCEPT_REQUEST') {
		peer.signal(_data.load)
	}

	// const { from, message, signature } = JSON.parse(data)
	// const verified = araCrypto.verify(Buffer(signature.data), Buffer(message), Buffer(from))
	// !verified && console.error('The following message appears to be forged 😬')
	// console.log(JSON.stringify({
	// 	from: Buffer(from).toString('hex'),
	// 	message
	// }, null, 2))
})

let peer
let username
export default {
	socket,
	Buffer,

	login(_username) {
		username = _username
		socket.send(JSON.stringify({ type: 'LOGIN', username }))
	},

	initiate(to) {
		if (!username) { return console.log('Login first!') }
		peer = new Peer({ initiator: true, trickle: false })
		peer.on('error', (err) => console.log('error', err))
		peer.on('connect', () => console.log('connected'))
		peer.on('data', data => console.log(data))
		peer.on('signal', data => {
			socket.send(JSON.stringify({
				type: 'INIT',
				username,
				to,
				request: data
			}))
		})
	},

	makeRandomKeys() {
		const seed = araCrypto.randomBytes(32)
		const { publicKey, secretKey } = araCrypto.keyPair(seed)
		Object.assign(window, { publicKey }, { secretKey })
		console.warn(`Your new secretKey key is: ${secretKey.toString('hex')} 🤫`)
		console.warn(`Your new public key is: ${publicKey.toString('hex')} 🗣`)
		return
	},

	sendMessage(message) {
		if (!peer) { return console.log('Not connected with anyone')}
		peer.send(message)
	},

	xsendMessage(message) {
		const { publicKey, secretKey } = window
		if (!publicKey || !secretKey) {
			console.error('You have not created a keypair. Invoke `makeRandomKeys` first')
			return
		}
		socket.send(JSON.stringify({
			from: publicKey,
			message,
			signature: araCrypto.sign(Buffer(message), secretKey)
		}))
		return
	}
}