// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public count;

    function incrementCount() public returns (uint) {
        return count++;
    }

    function decrementCount() public returns (uint) {
        return count--;
    }
}
