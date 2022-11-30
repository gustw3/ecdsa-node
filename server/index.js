const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const toHex = require('to-hex')


app.use(cors());
app.use(express.json());

const balances = {
  "0x5a6309b0be2095215f1b577b26855ec20ce1968e": 100,
  "0x7d95dac1b55ed29eeeb5f098a348583470a3ae3f": 50,
  "0x4d209a1b6e4e9537ac4a35bc563f61be5d3d1fc4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { signClient, recipient, amount } = req.body;
  signatureArray = [];
  Object.keys(signClient[0]).forEach(function(key, index) {
    signatureArray.push(signClient[0][index]);
  });
  const recoveryBit = signClient[1];
  signatureUint8Array = new Uint8Array(signatureArray);
  const msgHash = keccak256(utf8ToBytes(`sent ${amount} to ${recipient}`));

  const recoverPublicKey = secp.recoverPublicKey(msgHash, signatureUint8Array, recoveryBit)
  const sender = `0x${toHex(recoverPublicKey.slice(1).slice(44, 64))}`
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;[]
    res.send({ recoveryBit: recoveryBit, balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
