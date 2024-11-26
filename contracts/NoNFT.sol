// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts@5.1.0/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts@5.1.0/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts@5.1.0/token/ERC721/extensions/ERC721URIStorage.sol";

contract CocktailNft is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address minter) ERC721("CocktailNft", "CNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }
    uint256 public tokenIds = 0;

    // https://raw.githubusercontent.com/<USERNAME>/<REPO_NAME>/refs/heads/<BRANCH>/<PATH>
    string baseUri = "https://raw.githubusercontent.com/turinglabsorg/no-nft/refs/heads/master/metadata/";
    // 1 = AMERICANO
    // 2 = MOJITO
    // 3 = MANHATTAN
    // 4 = OLD FASHION
    // 5 = GIN FIZZ

    string[] public cocktails = ["AMERICANO", "MOJITO", "MANHATTAN", "OLD FASHION", "GIN FIZZ"];

    function safeMint(address to, string memory cocktail)
        public
        onlyRole(MINTER_ROLE)
    {
        tokenIds++;
        _safeMint(to, tokenIds);
        _setTokenURI(tokenIds, cocktails[cocktail]);
    }

    // The following functions are overrides required by Solidity.
    // https://docs.opensea.io/docs/metadata-standards <- This is the standard for NFT metadata
    //For OpenSea to pull in off-chain metadata for ERC721 and ERC1155 assets, your contract will need to return a URI where we can find the metadata. 
    // To find this URI, we use the tokenURI method in ERC721 and the uri method in ERC1155.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        // baseURI                                                                                 cocktails[tokenId]      .json
        // https://raw.githubusercontent.com/turinglabsorg/no-nft/refs/heads/master/metadata/      AMERICANO               .json
        return string.concat(baseUri, cocktails[tokenId], ".json");
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
