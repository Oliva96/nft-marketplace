const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

const filterEvents = (marketContract) => {
  marketContract.events.MarketItemCreated(async (err, event) => {
    if (err) {
      console.error('Error on event', err)
      return
    }
    console.log(event);
  })

  marketContract.events.MarketItemSold(async (err, event) => {
    if (err) {
      console.error('Error on event', err)
      return
    }
    console.log(event);
  })
}

describe("NFTMarket", function () {

  let market, nft;
  const provider = waffle.provider;

  this.beforeAll(async () => {
    const Market = await ethers.getContractFactory("NFTMarket");
    market = await Market.deploy();
    await market.deployed();
  
    const Nft = await ethers.getContractFactory("NFT");
    nft = await Nft.deploy(market.address);
    await nft.deployed();

  });

  it("Should creates nft", async function () {
    const id1 = await nft.createToken('tokenUri1');
    const id2 = await nft.createToken('tokenUri2');
  });

  it("Should set listing price", async function () {
    const price = ethers.utils.parseUnits('0.00000001', 'ether');
    await market.setListingPrice(price);
    const newPrice = await market.getListingPrice();
    console.log("newPrice: ",newPrice);
  });

  it("Should create a maket item", async function () {
    const listingPrice = await market.getListingPrice();
    console.log("getListingPrice: ", listingPrice);

    const auctionPrice1 = ethers.utils.parseUnits('7', 'ether');
    const auctionPrice2 = ethers.utils.parseUnits('5', 'ether');

    await market.createMarketItem(nft.address, 1, auctionPrice1, true, {value: listingPrice});
    await market.createMarketItem(nft.address, 2, auctionPrice2, true, {value: listingPrice});
  });

  it("Should make a sale", async function () {
    const auctionPrice1 = ethers.utils.parseUnits('7', 'ether');
    const nft_1 = await market.getItemById(1);
    
    const willPay = auctionPrice1.add(nft_1.comission);

    const [owner, addr1] = await ethers.getSigners();
    
    await market.connect(addr1).createMarketSale(nft.address, 1, {value: willPay});
  });

  it("Should fetch the market items", async function () {
    let items = await market.fetchMarketItems();

    items = await Promise.all(items.map( async (i) => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        price: ethers.utils.formatUnits(i.price.toString(), 'ether'),
        tokenId: i.tokenId.toString(),
        createdBy: i.createdBy,
        owner: i.owner,
        forSale: i.forSale,
        tokenUri
      }
      return item;
    }))

    console.log(items);
  });
  
  it("Should fetch the items owned by a user", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const itemsOwner = await market.connect(owner).myNFTs();
    const itemsAddr1 = await market.connect(addr1).myNFTs();
    console.log("Owner",itemsOwner);
    console.log("Addr1",itemsAddr1);
  });

  it("Should fetch the items created by a user", async function() {
    const [owner] = await ethers.getSigners();
    const itemsOwner = await market.connect(owner).fecthItemsCreated();
    console.log("Created by owner",itemsOwner);
  });
});
