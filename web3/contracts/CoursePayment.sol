// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 893591312500000000
// 1548464343750000000
contract CoursePayment is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public usdcToken;
    uint256 public platformFeePercentage = 10;

    struct Tutor {
        string id; // MongoDB _id as string
        address walletAddress;
        uint256 balance;
        bool isRegistered;
    }

    mapping(string => Tutor) public tutorsById;
    string[] public tutorIds;

    event TutorRegistered(string id, address walletAddress);
    event TutorAddressUpdated(
        string id,
        address oldAddress,
        address newAddress
    );
    event CoursePurchased(
        address student,
        string tutorId,
        uint256 amount,
        string courseId
    );
    event TutorWithdrawal(string tutorId, uint256 amount);
    event PlatformFeeUpdated(uint256 newPercentage);

    constructor(address _usdcTokenAddress) Ownable(msg.sender) { 
        usdcToken = IERC20(_usdcTokenAddress);
    }

    function registerTutor(string memory _id) external {
        require(!tutorsById[_id].isRegistered, "Tutor already registered");
        require(!isAddressUsed(msg.sender), "Address already used");

        tutorsById[_id] = Tutor({
            id: _id,
            walletAddress: msg.sender,
            balance: 0,
            isRegistered: true
        });
        tutorIds.push(_id);

        emit TutorRegistered(_id, msg.sender);
    }

    function updateTutorAddress(
        string memory _id,
        address _newAddress
    ) external {
        require(tutorsById[_id].isRegistered, "Tutor not registered");
        require(
            msg.sender == tutorsById[_id].walletAddress ||
                msg.sender == owner(),
            "Unauthorized"
        );
        require(!isAddressUsed(_newAddress), "New address already used");

        address oldAddress = tutorsById[_id].walletAddress;
        tutorsById[_id].walletAddress = _newAddress;

        emit TutorAddressUpdated(_id, oldAddress, _newAddress);
    }

    function withdrawTutorBalance(
        string memory _tutorId,
        uint256 amount
    ) external {
        require(tutorsById[_tutorId].isRegistered, "Tutor not registered");
        require(
            msg.sender == tutorsById[_tutorId].walletAddress,
            "Unauthorized"
        );
        require(tutorsById[_tutorId].balance >= amount, "Insufficient balance");

        tutorsById[_tutorId].balance -= amount;
        usdcToken.safeTransfer(msg.sender, amount);

        emit TutorWithdrawal(_tutorId, amount);
    }
    function isAddressUsed(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < tutorIds.length; i++) {
            if (tutorsById[tutorIds[i]].walletAddress == _address) {
                return true;
            }
        }
        return false;
    }

    // Other functions (purchaseCourse, getTutorBalance, etc.) remain largely unchanged
    // ...

    function purchaseCourse(
        string memory _tutorId,
        uint256 amount,
        string memory _courseId
    ) external {
        require(tutorsById[_tutorId].isRegistered, "Tutor not registered");

        // Check allowance
        require(checkAllowance(msg.sender, amount), "Insufficient allowance");

        // Use safeTransferFrom instead of transferFrom for added security
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 platformFee = (amount * platformFeePercentage) / 100;
        uint256 tutorAmount = amount - platformFee;

        tutorsById[_tutorId].balance += tutorAmount;

        emit CoursePurchased(msg.sender, _tutorId, amount, _courseId);
    }

    // Helper function to check allowance
    function checkAllowance(
        address _user,
        uint256 _amount
    ) public view returns (bool) {
        return usdcToken.allowance(_user, address(this)) >= _amount;
    }

    function getTutorBalance(
        string memory _tutorId
    ) external view returns (uint256) {
        return tutorsById[_tutorId].balance;
    }

    function getContractBalance() public view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    function getTotalTutorBalances() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < tutorIds.length; i++) {
            total += tutorsById[tutorIds[i]].balance;
        }
        return total;
    }

    function getPlatformFee() public view returns (uint256) {
        uint256 contractBalance = usdcToken.balanceOf(address(this));
        uint256 tutorBalances = getTotalTutorBalances();
        if (contractBalance > tutorBalances) {
            return contractBalance - tutorBalances;
        }
        return 0;
    }

    function updatePlatformFeePercentage(
        uint256 newFeePercentage
    ) external onlyOwner {
        require(newFeePercentage <= 20, "Fee percentage too high");
        platformFeePercentage = newFeePercentage;
        emit PlatformFeeUpdated(newFeePercentage);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        usdcToken.safeTransfer(owner(), balance); // Changed from transfer to safeTransfer
    }
}
