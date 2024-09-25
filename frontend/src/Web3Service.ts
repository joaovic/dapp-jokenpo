import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abi.json";

type LoginResult = {
    account: string;
    isAdmin: boolean;
}

export async function doLogin() : Promise<LoginResult> {
    if (!window.ethereum)
        throw new Error('No MetaMask found.');

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length)
        throw new Error('Wallet not found/allowed.');

    const contract = new web3.eth.Contract(ABI as AbiItem[], process.env.REACT_APP_CONTRACT_ADDRESS, {from: accounts[0]});
    const ownerAddressRaw = await contract.methods.owner().call();
    const ownerAddress = String(ownerAddressRaw).toLowerCase();
    const isAdmin = accounts[0] === ownerAddress;

    localStorage.setItem("account", accounts[0]);
    localStorage.setItem("isAdmin", `${isAdmin}`);

    return {
        account: accounts[0],
        isAdmin: isAdmin
    } as LoginResult;

}