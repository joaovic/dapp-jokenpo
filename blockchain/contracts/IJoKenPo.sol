// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

inter IJoKenPo {
    enum Options { NONE, ROCK, PAPER, SCISSORS } // 0, 1, 2, 3

    struct Player {
        address wallet;
        uint32 wins;
    }

    Player[] public players;

    function getResult() external view returns (string memory);

    function getBid() external view returns (uint256);

    function setBid(uint256 newBid) external;

    function getCommission() external view returns (uint8);

    function setCommission(uint8 newCommission) external;

    function getBalance() external view returns(uint);

    function play(Options newChoice) external payable;

    function getLeaderboard() external view returns(Player[] memory);
}
