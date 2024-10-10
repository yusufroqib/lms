// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Certificate is ERC721URIStorage {
    uint256 private nextTokenId; 

    mapping(string => mapping(string => uint256)) public studentCertificates;

    // Add the event declaration
    event CertificateMinted(
        uint256 indexed NFTId,
        address walletAddress,
        string studentId,
        string courseId
    );

    constructor() ERC721("Learniverse Certificate", "LRNV") {
        nextTokenId = 1;
    }

    function mintCertificate(
        string memory studentId,
        string memory courseId,
        string memory tokenURI
    ) public returns (uint256) {
        require(
            studentCertificates[studentId][courseId] == 0,
            "Certificate already exists for this student and course"
        );

        uint256 newItemId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        studentCertificates[studentId][courseId] = newItemId;

        // Emit the event
        emit CertificateMinted(newItemId, msg.sender, studentId, courseId);

        return newItemId;
    }
}
