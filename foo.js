const crypto = require('ara-crypto')

const seed0 = crypto.randomBytes(32)
const seed1 = crypto.randomBytes(32)

const ckp = crypto.kx.keyPair(seed0)
const skp = crypto.kx.keyPair(seed1)

const client = crypto.kx.client({
  publicKey: ckp.publicKey,
  secretKey: ckp.secretKey,
  server: { publicKey: skp.publicKey }
})

const server = crypto.kx.server({
  publicKey: skp.publicKey,
  secretKey: skp.secretKey,
  client: { publicKey: ckp.publicKey }
})

const message = Buffer.from('hello')
const sealed = crypto.seal(message, { publicKey: skp.publicKey })

const decryptedMessage = crypto.seal.open(sealed, {
  publicKey: skp.publicKey,
  secretKey: skp.secretKey
})