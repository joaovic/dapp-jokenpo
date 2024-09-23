// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IJoKenPo.sol";
import "./JoKenPoLibrary.sol";

contract JoKenPoAdapter {
    IJoKenPo private joKenPo;

    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function upgrade(address newImplementation) external {
        require(msg.sender == owner, "Youy do not have permission");
        require(newImplementation != address(0), "Empty address is not permitted");

        joKenPo = IJoKenPo(newImplementation);
    }
}