import araCrypto from 'ara-crypto'
import { Buffer } from 'buffer'
const socket = new WebSocket('ws://localhost:8080')

socket.addEventListener('open', () => console.log('Connected to socket on 8080'))

socket.addEventListener('message', ({ data }) => {
	console.log(data)
	// const { from, message, signature } = JSON.parse(data)
	// const verified = araCrypto.verify(Buffer(signature.data), Buffer(message), Buffer(from))
	// !verified && console.error('The following message appears to be forged 😬')
	// console.log(JSON.stringify({
	// 	from: Buffer(from).toString('hex'),
	// 	message
	// }, null, 2))
})

export default socket