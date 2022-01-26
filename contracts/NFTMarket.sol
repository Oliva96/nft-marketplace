//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract NFTMarket is ReentrancyGuard {

    /**
    * TODO: need to add sales commissions
    */

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint listingPrice = 0.000025 ether;
    uint perCentComission = 4; // % comission for sale 

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable createdBy;
        address payable owner;
        uint price;
        uint comission;
        bool forSale;
    }

    mapping(uint => MarketItem) private MarketItemId;

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address createdBy,
        address owner,
        uint price,
        uint comission,
        bool forSale
    );

    event MarketItemSold(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address createdBy,
        address seller,
        address owner,
        uint price,
        uint comission
    );

    function getListingPrice() public view returns(uint) {
        return listingPrice;
    }

    function setListingPrice(uint _price) public {
        require(msg.sender == owner, "You need to be the owner");
        listingPrice = _price;
    }

    function getPerCentComission() public view returns(uint) {
        return perCentComission;
    }

    function setPerCentComission(uint _perCent) public {
        require(msg.sender == owner, "You need to be the owner");
        perCentComission = _perCent;
    }

    function createMarketItem(address nftContract, uint tokenId, uint price, bool forSale) public payable nonReentrant{
        
        require(price > 0, "Price must be greater than 0");
        require(msg.value == listingPrice, "Price must be equal to listingPrice");

        _itemIds.increment();
        uint itemId = _itemIds.current();

        uint comission = price * perCentComission / 100;

        MarketItemId[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), // created by
            payable(msg.sender), // owner's address
            price,
            comission,
            forSale
        );
        // IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId, 
            nftContract, 
            tokenId, 
            msg.sender, // created by
            msg.sender, // owner
            price, 
            comission,
            forSale
        );

    }

    function getItemById(uint itemId) public view returns(MarketItem memory) {
        return MarketItemId[itemId];
    }

    function createMarketSale(address nftContract, uint itemId) public payable nonReentrant{

        uint price = MarketItemId[itemId].price;
        uint tokenId = MarketItemId[itemId].tokenId;
        uint comission = MarketItemId[itemId].comission;

        require(msg.value == (price + comission), "Please submit the correct price to the market");
        //require(msg.value == price, "Please submit the correct price to the market");

        //pay the value to the seller
        address payable seller = MarketItemId[itemId].owner;
        seller.transfer(price);

        //transfer nft's ownership from the seller to the buyer
        IERC721(nftContract).transferFrom(seller, msg.sender, tokenId);

        MarketItemId[itemId].owner = payable(msg.sender); //mark buyer as the new owner
        _itemsSold.increment();

        MarketItemId[itemId].forSale = false;

        owner.transfer(comission);

        emit MarketItemSold(
            itemId, 
            nftContract, 
            tokenId, 
            MarketItemId[itemId].createdBy, 
            seller,
            msg.sender, 
            price, 
            comission
        );
    }

    ///@notice total items unsold on the market
    function fetchMarketItems() public view returns(MarketItem[] memory) {
        uint itemsCount = _itemIds.current();
        uint unSoldItemsCount = itemsCount - _itemsSold.current();
        MarketItem[] memory items = new MarketItem[](unSoldItemsCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= itemsCount; i++) {
            if(MarketItemId[i].forSale){
                items[currentIndex++] = MarketItemId[i];
            }
        }
        return items;
    }

    ///@notice fecth Nft's list owned by a user
    function myNFTs() public view returns(MarketItem[] memory) {

        uint totalItems = _itemIds.current();

        uint numberOfItemsByOwner = 0;
        uint currentId = 0;

        for (uint i = 1; i <= totalItems; i++) {
            if(MarketItemId[i].owner == msg.sender){
                numberOfItemsByOwner++;
            }
        }

        MarketItem[] memory items = new MarketItem[](numberOfItemsByOwner);

        for (uint i = 1; i <= totalItems; i++) {
            if(MarketItemId[i].owner == msg.sender){
                items[currentId++] = MarketItemId[i];
            }
        }

        return items;
    }

    ///@notice fecth Nft's list created by a user
    function fecthItemsCreated() public view returns(MarketItem[] memory) {

        uint totalItems = _itemIds.current();

        uint numberOfItemsByOwner = 0;
        uint currentId = 0;

        for (uint i = 1; i <= totalItems; i++) {
            if(MarketItemId[i].createdBy == msg.sender){
                numberOfItemsByOwner++;
            }
        }

        MarketItem[] memory items = new MarketItem[](numberOfItemsByOwner);

        for (uint i = 1; i <= totalItems; i++) {
            if(MarketItemId[i].createdBy == msg.sender){
                items[currentId++] = MarketItemId[i];
            }
        }
        
        return items;
    }
}