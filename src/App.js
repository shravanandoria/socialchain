import "./App.css";
import Socialchain from "./abis/SocialChain.json";
import Web3 from "web3";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Spinner from "./Components/Spinner.js";
//Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const [socialchain, setSocialchain] = useState();
  const [posts, setPosts] = useState([]);
  const [reload, setReload] = useState(false);
  const [web3, setWeb3] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      const web3 = window.web3;
      setWeb3(web3);
      const account = await web3.eth.getAccounts();
      setAccount(account[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = Socialchain.networks[networkId];
      if (networkData) {
        const socialchain = new web3.eth.Contract(
          Socialchain.abi,
          networkData.address
        );
        setSocialchain(socialchain);
        const imageCount = await socialchain.methods.imageCount().call();

        const images = [];
        for (let i = 1; i <= imageCount; i++) {
          const image = await socialchain.methods.images(i).call();
          images.push(image);
        }
        const invert = images.sort((a, b) => b.id - a.id);
        setPosts(invert);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
    setReload(false);
  };

  // https://ipfs.io/ipfs/
  const uploadImage = async (imageHash, description) => {
    setLoading(true);
    setError(false);
    try {
      const image = await ipfs.add(imageHash);
      const imageUrl = `https://ipfs.infura.io/ipfs/${image.path}`;
      const post = await socialchain.methods
        .uploadImage(imageUrl, description)
        .send({ from: account });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
    if (!reload) {
      return setReload(true);
    }
    setReload(false);
  };

  const tipImage = async (index, amount) => {
    setLoading(true);
    try {
      setError(false);
      const web3 = window.web3;
      await socialchain.methods
        .tipImageOwner(index)
        .send({ from: account, value: web3.utils.toWei(amount, "ether") });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
    if (!reload) {
      return setReload(true);
    }
    setReload(false);
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [reload]);

  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <Navbar account={account} />
        {loading && <Spinner />}
        <Home
          web3={web3}
          setReload={setReload}
          error={error}
          loading={loading}
          uploadImage={uploadImage}
          posts={posts}
          tipImage={tipImage}
        />
        <Footer />
      </div>
    </>
  );
}
export default App;
