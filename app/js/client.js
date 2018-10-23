import araCrypto from 'ara-crypto'
import { Buffer } from 'buffer'
import socket from './socket'

export default {
	socket,
	Buffer,

	makeRandomKeys() {
		const seed = araCrypto.randomBytes(32)
		const { publicKey, secretKey } = araCrypto.keyPair(seed)
		Object.assign(window, { publicKey }, { secretKey })
		console.warn(`Your new secretKey key is: ${secretKey.toString('hex')} 🤫`)
		console.warn(`Your new public key is: ${publicKey.toString('hex')} 🗣`)
		return
	},

	sendMessage(message) {
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