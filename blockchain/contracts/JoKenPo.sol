// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IJoKenPo.sol";
import "./JoKenPoLibrary.sol";

contract JoKenPo is IJoKenPo {
    JoKenPoLibrary.Options private choice1 = JoKenPoLibrary.Options.NONE;
    address private player1;
    string private result = "";

    address payable private immutable owner;
    uint256 private bid = 0.01 ether;
    uint8 private commission = 10; //percentage

    JoKenPoLibrary.Player[] public players;

    constructor(){
        owner = payable(msg.sender);
    }

    function getResult() external view returns (string memory) {
        return result;
    }

    function getBid() external view returns (uint256) {
        return bid;
    }

    function setBid(uint256 newBid) external {
        require(msg.sender == owner, "You do not have permission");
        require(player1 == address(0), "You cannot change the Bid with a game in progress");

        bid = newBid;
    }

    function getCommission() external view returns (uint8) {
        return commission;
    }

    function setCommission(uint8 newCommission) external {
        require(msg.sender == owner, "You do not have permission");
        require(player1 == address(0), "You cannot change the Commission with a game in progress");

        commission = newCommission;
    }

    function updateWinner(address winner) private {
        for(uint i=0; i < players.length; i++){
            if(players[i].wallet == winner){ 
                players[i].wins++;
                return;
            }
        }

        players.push(JoKenPoLibrary.Player(winner, 1));
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer((contractAddress.balance / 100) * (100-commission));
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        choice1 = JoKenPoLibrary.Options.NONE;
    }

    function getBalance() external view returns(uint) {
        require(owner == msg.sender, "You do not have this permission");
        return address(this).balance;
    }

    function play(JoKenPoLibrary.Options newChoice) external payable {
        require(msg.sender != owner, "The owner can not play");
        require(newChoice != JoKenPoLibrary.Options.NONE, "Invalid choice");
        require(player1 != msg.sender, "Wait the another player");
        require(msg.value >= bid, "Invalid bid");

        if(choice1 == JoKenPoLibrary.Options.NONE){
            player1 = msg.sender;
            choice1 = newChoice;
            result = "Player 1 choose his/her option. Waiting player 2";
        }
        else if(choice1 == JoKenPoLibrary.Options.ROCK && newChoice == JoKenPoLibrary.Options.SCISSORS)
            finishGame("Rock breaks scissors. Player 1 won", player1);
        else if(choice1 == JoKenPoLibrary.Options.PAPER && newChoice == JoKenPoLibrary.Options.ROCK)
            finishGame("Paper wraps rock. Player 1 won", player1);
        else if(choice1 == JoKenPoLibrary.Options.SCISSORS && newChoice == JoKenPoLibrary.Options.PAPER)
            finishGame("Scissors cuts paper. Player 1 won", player1);
        else if(choice1 == JoKenPoLibrary.Options.SCISSORS && newChoice == JoKenPoLibrary.Options.ROCK)
            finishGame("Rock breaks scissors. Player 2 won", msg.sender);
        else if(choice1 == JoKenPoLibrary.Options.ROCK && newChoice == JoKenPoLibrary.Options.PAPER)
            finishGame("Paper wraps rock. Player 2 won", msg.sender);
        else if(choice1 == JoKenPoLibrary.Options.PAPER && newChoice == JoKenPoLibrary.Options.SCISSORS)
            finishGame("Scissors cuts paper. Player 2 won", msg.sender);
        else {
            result = "Draw game. The prize was doubled";
            player1 = address(0);
            choice1 = JoKenPoLibrary.Options.NONE;
        }
    }

    function getLeaderboard() external view returns(JoKenPoLibrary.Player[] memory){
        if(players.length < 2) return players;

        JoKenPoLibrary.Player[] memory arr = new JoKenPoLibrary.Player[](players.length);
        for(uint i=0; i < players.length; i++)
            arr[i] = players[i];

        for(uint i=0; i < arr.length - 1; i++){
            for(uint j=1; j < arr.length; j++){
                if(arr[i].wins < arr[j].wins){
                    JoKenPoLibrary.Player memory change = arr[i];
                    arr[i] = arr[j];
                    arr[j] = change;
                }
            }
        }

        return arr;
    }
}
