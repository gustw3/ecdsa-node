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
  "0x161c02c2fa3c2adc7156af4e9b1bf6de358768b6": 100,
  "0x81fb0dd8aa9bf5e6c669aaf3cc1c64827fe8f118": 50,
  "0xeded9ac35ddf5b1aab3d28c4330a93757cea7d61": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sign, sender, recipient, amount } = req.body;
	const msgHash = keccak256(utf8ToBytes(amount));
	const signature = sign
	const recovery = sign[1];

	console.log(sign);
	const recoverPublicKey = secp.recoverPublicKey(msgHash,signature, recovery);

	console.log(recoverPublicKey);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;[]
    res.send({ balance: balances[sender] });
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
