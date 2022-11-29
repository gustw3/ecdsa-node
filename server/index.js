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
  "0x1cdb8a6b7efa94649b9b9bdac0e9b6649abdeefb": 100,
  "0xfefdc9d01c2795bcc490cfb00a18b673fb013e98": 50,
  "0x961ce5f4083069bd7d5aae5e6363047051c3c317": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { privateKey, recipient, amount } = req.body;
  const msgHash = keccak256(utf8ToBytes(`sent ${amount} to ${recipient}`))
  const sign = await secp.sign(msgHash, privateKey, { recovered: true });
  const recoveryBit = secp.recoverPublicKey(msgHash, sign[0], sign[1])
  const sender = `0x${toHex(recoveryBit.slice(1).slice(44, 64))}`
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;[]
    res.send({ recoveryBit: sign[1], balance: balances[sender] });
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
