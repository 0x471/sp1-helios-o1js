// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract TokenBridge {
    address public bridgeOperator;
    mapping(address => uint256) public lockedTokens;

    event TokensLocked(address indexed user, uint256 amount, uint256 when);

    constructor() {
        bridgeOperator = msg.sender;
    }

    function lockTokens() public payable {
        require(msg.value > 0, "You must send some Ether to lock");

        lockedTokens[msg.sender] += msg.value;

        emit TokensLocked(msg.sender, msg.value, block.timestamp);
    }
}