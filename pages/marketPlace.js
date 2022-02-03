import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketAddress} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider);
  
    const data = await marketContract.fetchMarketItems();
  
    const items = await Promise.all(data.map(async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);

      let price = i.price.add(i.comission);
      price = ethers.utils.formatUnits(price.toString(), 'ether');
      
      let item = {
        price: price,
        tokenId: i.tokenId.toNumber(),
        createdBy: i.createdBy,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item;
    }))
    setNfts(items);
    setLoading('loaded');
  }

  const buyNft = async (NftTokenId) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    const nft = await contract.getItemById(NftTokenId);
    console.log(nft);
    const totalPay = nft.price.add(nft.comission);

    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {value: totalPay});
    await transaction.wait();
    loadNFTs();

  }

  if(loading === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
  )

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{maxWidth: '1600px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, i) => (
              <div key={i} className='border shadow rounded-xl overflow-hidden'>
                <img src={nft.image} />
                <div className='p-4'>
                  <p style={{height: '64px'}} className='text-2xl font-semibold '>
                    {nft.name}
                  </p>
                  <div style={{height: '64px', overflow: 'hidden'}}>
                    <p className='text-gray-400'>{nft.description}</p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-2xl mb-4 font-bold text-white'>{nft.price} ETH</p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
                    onClick={()=> buyNft(nft.tokenId)}>
                      Buy
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
