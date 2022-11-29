import { useState } from "react";
import server from "./server";
import * as secp from '@noble/secp256k1';
import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex } from 'ethereum-cryptography/utils'

function Transfer({ privateKey, address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
	const [recoveryBit, setRecoveryBit] = useState("")
  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {

    evt.preventDefault();

    try {
      const {
        data: { recoveryBit, balance },
      } = await server.post(`send`, {
        privateKey: privateKey,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
      setRecoveryBit(recoveryBit);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder="Recovery Bit"
          value={recoveryBit}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
