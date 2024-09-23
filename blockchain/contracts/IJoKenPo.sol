// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./JoKenPoLibrary.sol";

interface IJoKenPo {
    function getResult() external view returns (string memory);

    function getBid() external view returns (uint256);

    function setBid(uint256 newBid) external;

    function getCommission() external view returns (uint8);

    function setCommission(uint8 newCommission) external;

    function getBalance() external view returns(uint);

    function play(JoKenPoLibrary.Options newChoice) external payable;

    function getLeaderboard() external view returns(JoKenPoLibrary.Player[] memory);
}
