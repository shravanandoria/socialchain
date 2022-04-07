// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialChain {
    string public name;
    uint256 public imageCount;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address author
    );

    constructor() {
        name = "SocialChain";
    }

    function uploadImage(string memory _hash, string memory _description)
        public
    {
        require(bytes(_hash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0));

        imageCount++;
        images[imageCount] = Image(
            imageCount,
            _hash,
            _description,
            0,
            payable(msg.sender)
        );

        emit ImageCreated(imageCount, _hash, _description, 0, msg.sender);
    }

    function tipImageOwner(uint256 index) public payable {
        require(index > 0 && index <= imageCount);
        Image memory image = images[index];
        address payable _author = image.author;
        _author.transfer(msg.value);
        image.tipAmount = image.tipAmount + msg.value;
        images[index] = image;
        emit ImageTipped(
            index,
            image.hash,
            image.description,
            image.tipAmount,
            _author
        );
    }
}
