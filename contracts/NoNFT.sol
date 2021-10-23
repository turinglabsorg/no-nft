// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NoNFT
 * NoNFT - ERC-721 NoNFT
 */
contract NoNFT is ERC721, Ownable {
    address openseaProxyAddress;
    string public contract_ipfs_json;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    bool public is_collection_revealed = false;
    string public contract_base_uri = "https://raw.githubusercontent.com/turinglabsorg/no-nft/master/metadata/nft.json";
    uint256 public mint_price = 0.01 ether;
    constructor(
        address _openseaProxyAddress,
        string memory _name,
        string memory _ticker,
        string memory _contract_ipfs
    ) ERC721(_name, _ticker) {
        openseaProxyAddress = _openseaProxyAddress;
        contract_ipfs_json = _contract_ipfs;
    }

    function _baseURI() internal view override returns (string memory) {
        return contract_base_uri;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        if(_tokenId > 0){
            return contract_base_uri;
        }else{
            return string(abi.encodePacked(""));
        }
    }

    function contractURI() public view returns (string memory) {
        return contract_ipfs_json;
    }

    function fixContractURI(string memory _newURI) public onlyOwner {
        contract_ipfs_json = _newURI;
    }

    function fixBaseURI(string memory _newURI) public onlyOwner {
        contract_base_uri = _newURI;
    }

    /*
        This method will allow anyone to mint the token.
    */
    function buyNFT()
        public
        payable
    {
        require(msg.value % mint_price == 0, 'NoNFT, Amount must be a multiple of price');
        uint256 amount = msg.value / mint_price;
        require(amount >= 1, 'NoNFT: Amount should be at least 1');
        uint j = 0;
        for (j = 0; j < amount; j++) {
            _tokenIdCounter.increment();
            uint256 newTokenId = _tokenIdCounter.current();
            _mint(msg.sender, newTokenId);
        }
    }

    /*
        This method will allow owner to get the balance of the smart contract
     */

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /*
        This method will allow owner tow withdraw all ethers
     */

    function withdrawMatic() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, 'NoNFT: Nothing to withdraw!');
        payable(msg.sender).transfer(balance);
    }

    /**
     * Override isApprovedForAll to whitelist proxy accounts
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {

        // Approving for UMi and Opensea address
        if (_operator == address(openseaProxyAddress)) {
            return true;
        }

        return super.isApprovedForAll(_owner, _operator);
    }
}
