import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [transactions,setTransactions] = useState([])
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };
   const getAllTransactions = async ()=>{
    try{
      if (!ethereum) return alert("please install metamask");
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions()
      const structuredTransactions = availableTransactions.map(transaction=>({
        addressTo:transaction.reciever,
        addressFrom:transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString(),
        message:transaction.message,
        keyword:transaction.keyword,
        amount:parseInt(transaction.amount._hex) / (10**18) //get the real eth amount

      }))
      console.log(structuredTransactions)
      setTransactions(structuredTransactions)

    }
    catch (err) {
      console.log(err)

    }
   }


  const checkWallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length != 0) {
        setCurrentAccount(accounts[0]);
        getAllTransactions()
      } else {
        console.log("no account found");
      }
    } catch (err) {
      console.log(err);
      throw new Error("no eth object");
    }
  };
  const checkTransactions = async ()=>{
    try{
      const transactionContract = getEthereumContract();
      const transactionCount = transactionContract.getTransactionCount();

      localStorage.setItem("transactionCount",transactionCount)

    }
    catch (err) {
      console.log(err);
      throw new Error("no eth object");
       
    }
  }
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
      throw new Error("no eth object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //21000 GWAI = 0.000021 ether
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`loading ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`success ${transactionHash.hash}`);
      const transactionCount = transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (err) {
      console.log(err);
      throw new Error("no eth object");
    }
  };

  useEffect(() => {
    checkWallet();
    checkTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
