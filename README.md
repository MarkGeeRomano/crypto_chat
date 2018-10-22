Crypto Chat
==========
Simple and fun dev-tools based encrypted chat app for demoing the newly public [`ara-crypto`](https://github.com/AraBlocks/ara-crypto) repo from my team [@AraBlocks](https://github.com/AraBlocks).

## Goal
To demo the ed25519 `sign` and `verify` functions available in the `ara-crypto` module, specifically how easy it is to use the cryptographic functions in this module, their efficacy, and how one only really needs a high level understanding of cryptography to make use the functions.

## Getting started 
```
$ npm i
$ npm start
```

Open two tabs. Navigate to `localhost:3000` on both and open dev tools. Call `makeRandomKeys` in each. This will give you a keypair to use for the chat. You can then call `sendMessage(<msg>)` to chat with the other tab.

Want to try to be someone else? Copy the other users `publicKey`. Call the following function in the console.

```
publicKey = Buffer.from(<other's public key>, 'hex')
```

You're now attempting to impersonate the other person. Send a message and look at what happens in the other tab.
