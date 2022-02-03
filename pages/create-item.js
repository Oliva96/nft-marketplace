import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient} from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

import { nftAddress, nftMarketAddress} from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateItem = () => {

    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, setFormInput] = useState({price: '', name: '', description: ''});
    const router = useRouter();

    const onChange = async (e) => {
        const file = e.target.files[0];
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url)
        } catch (e) {
            console.log(e);
        }
    }
    
    const createItem = async () => {
        const {name, description, price} = formInput;

        if(!name || !description || !price || !fileUrl) return;
        
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            createSale(url);
        } catch (error) {
            console.log('Error uploading file', error);
        }
    }

    const createSale = async (url) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        
        let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait();

        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price, 'ether');

        contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();

        transaction = await contract.createMarketItem(nftAddress, tokenId, price, true, {value: listingPrice});
        await transaction.wait();
        router.push('/');
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    required
                    placeholder='Asset Name'
                    className='mt-8 border rounded p-4' 
                    onChange={ e => setFormInput({ ...formInput, name: e.target.value})}
                />
                <textarea
                    required
                    placeholder='Asset Description'
                    className='mt-2 border rounded p-4' 
                    onChange={ e => setFormInput({ ...formInput, description: e.target.value})}
                />
                <input
                    required
                    placeholder='Asset Price in Eth'
                    className='mt-2 border rounded p-4' 
                    onChange={ e => setFormInput({ ...formInput, price: e.target.value})}
                />
                <input
                    required
                    type='file'
                    name='Asset'
                    className='my-4'
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className='rounded mt-4' width="350" src={fileUrl}/>
                    )
                }
                <button
                    onClick={createItem}
                    className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'
                >
                    Create Digital Asset
                </button>
            </div>
        </div>
    );
};
export default CreateItem;