import server from "./server";
import * as secp from '@noble/secp256k1';
import { toHex } from 'ethereum-cryptography/utils'


function Wallet({ privateKey, address, setPrivateKey, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
		const publicKeyBytes = secp.getPublicKey(privateKey);
		const address = `0x${toHex(publicKeyBytes.slice(1).slice(44, 64))}`;

		setPrivateKey(privateKey)
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
			setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type your private key" onChange={onChange}></input>
      </label>
			<div className="balance">Wallet Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
