// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleFaucet is Ownable {
    uint256 public dispenseAmount = 0.1 ether;
    uint256 public cooldown = 1 hours;
    mapping(address => uint256) public lastClaim;

    event Claimed(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function claim() external {
        require(block.timestamp >= lastClaim[msg.sender] + cooldown, "Cooldown not met");
        require(address(this).balance >= dispenseAmount, "Insufficient faucet balance");

        lastClaim[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(dispenseAmount);

        emit Claimed(msg.sender, dispenseAmount);
    }

    function deposit() external payable onlyOwner {}

    function setDispenseAmount(uint256 amount) external onlyOwner {
        dispenseAmount = amount;
    }

    function setCooldown(uint256 time) external onlyOwner {
        cooldown = time;
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }
} 