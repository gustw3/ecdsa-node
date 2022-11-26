const secp = require("ethereum-cryptography/secp256k1");
const toHex = require('to-hex')

const privateKey = secp.utils.randomPrivateKey();

console.log(`Voici votre private key: ${toHex(privateKey)}`)

const publicKeyBytes = secp.getPublicKey(privateKey);
const publicKey = toHex(publicKeyBytes.slice(1).slice(44, 64))

console.log(`Voici votre public key: 0x${(publicKey)}`);
