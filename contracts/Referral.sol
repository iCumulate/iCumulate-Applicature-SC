pragma solidity 0.4.24;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './allocator/MintableTokenAllocator.sol';
import './crowdsale/CrowdsaleImpl.sol';
import './Ownable.sol';


contract Referral is Ownable {

    using SafeMath for uint256;

    MintableTokenAllocator public allocator;
    CrowdsaleImpl public crowdsale;

    uint256 public constant DECIMALS = 18;

    uint256 public totalSupply;
    bool public unLimited;
    bool public sentOnce;

    mapping(address => bool) public claimed;
    mapping(address => uint256) public claimedBalances;

    constructor(
        uint256 _totalSupply,
        address _allocator,
        address _crowdsale,
        bool _sentOnce
    ) public {
        require(_allocator != address(0) && _crowdsale != address(0));
        totalSupply = _totalSupply;
        if (totalSupply == 0) {
            unLimited = true;
        }
        allocator = MintableTokenAllocator(_allocator);
        crowdsale = CrowdsaleImpl(_crowdsale);
        sentOnce = _sentOnce;
    }

    function setAllocator(address _allocator) public onlyOwner {
        require(_allocator != address(0));
        allocator = MintableTokenAllocator(_allocator);
    }

    function setCrowdsale(address _crowdsale) public onlyOwner {
        require(_crowdsale != address(0));
        crowdsale = CrowdsaleImpl(_crowdsale);
    }

    function multivestMint(
        address _address,
        uint256 _amount,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        require(true == crowdsale.signers(verify(msg.sender, _amount, _v, _r, _s)));
        if (true == sentOnce) {
            require(claimed[_address] == false);
            claimed[_address] = true;
        }
        require(
            _address == msg.sender &&
            _amount > 0 &&
            (true == unLimited || _amount <= totalSupply)
        );
        claimedBalances[_address] = claimedBalances[_address].add(_amount);
        if (false == unLimited) {
            totalSupply = totalSupply.sub(_amount);
        }
        allocator.allocate(_address, _amount);
    }

    /// @notice check sign
    function verify(address _sender, uint256 _amount, uint8 _v, bytes32 _r, bytes32 _s) public pure returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(_sender, _amount));

        bytes memory prefix = '\x19Ethereum Signed Message:\n32';

        return ecrecover(keccak256(abi.encodePacked(prefix, hash)), _v, _r, _s);
    }
}
