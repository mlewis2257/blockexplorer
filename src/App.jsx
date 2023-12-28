import { useEffect, useState } from "react";
import "./App.css";

const { Alchemy, Network } = require("alchemy-sdk");

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
// const REACT_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
const settings = {
  apiKey: "gb-LVIsSZe1m9_0puSSJJYPZ44Owquds",
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
const baycAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

function App() {
  const [blockNumber, setBlockNumber] = useState([]);
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    async function getblockNumber() {
      const data = await alchemy.core.getBlockNumber();
      setBlockNumber(data);

      const nfts = await alchemy.nft.getNftsForOwner("vitalik.eth");

      setNftList(nfts);
    }
    getblockNumber();
  }, []);

  async function main() {
    for await (const nft of alchemy.nft.getNftsForContractIterator(
      baycAddress,
      {
        omitMetadata: true,
      }
    )) {
      await alchemy.nft
        .getOwnersForNft(nft.contract.address, nft.tokenId)
        .then((response) =>
          console.log("owners:", response.owners, "tokenId:", nft.tokenId)
        );
    }
  }

  const nftCollection = Object.values(nftList);
  const strCollection = JSON.stringify(nftCollection);

  return (
    <>
      <div className="App">
        Block Number: {blockNumber}
        <div className="nft_owner">
          <h1>Nft Collection Data: </h1>
          {strCollection}
        </div>
      </div>
    </>
  );
}

export default App;
