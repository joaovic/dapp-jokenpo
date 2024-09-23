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

    modifier restricted() {
        require(msg.sender == owner, "You do not have permission");
        _;
    }

    modifier upgraded() {
        require(address(joKenPo) != address(0), "You must upgrade first");
        _;
    }
    
    function getImplementationAddress() external view returns (address) {
        return address(joKenPo);
    }

    function upgrade(address newImplementation) external restricted {
        require(newImplementation != address(0), "Empty address is not permitted");

        joKenPo = IJoKenPo(newImplementation);
    }

    function getResult() external view upgraded returns (string memory) {
        return joKenPo.getResult();
    }

    function getBid() external view upgraded returns (uint256){
        return joKenPo.getBid();
    }

    function setBid(uint256 newBid) external upgraded restricted {
        joKenPo.setBid(newBid);
    }

    function getCommission() external view upgraded returns (uint8){
        return joKenPo.getCommission();
    }

    function setCommission(uint8 newCommission) external upgraded restricted {
        joKenPo.setCommission(newCommission);
    }

    function getBalance() external view upgraded returns(uint){
        return joKenPo.getBalance();
    }

    function play(JoKenPoLibrary.Options newChoice) external payable upgraded {
        joKenPo.play{value: msg.value}(newChoice);
    }

    function getLeaderboard() external view upgraded returns(JoKenPoLibrary.Player[] memory) {
        return joKenPo.getLeaderboard();
    }    
}