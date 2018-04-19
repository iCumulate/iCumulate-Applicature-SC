pragma solidity ^0.4.18;


import './../../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import './TokenAllocator.sol';
import '../token/MintableToken.sol';


/// @title MintableTokenAllocator
/// @author Applicature
/// @notice Contract responsible for defining distribution logic of tokens.
/// @dev implementation
contract MintableTokenAllocator is TokenAllocator {


    using SafeMath for uint256;

    MintableToken public token;

    function MintableTokenAllocator(MintableToken _token) public {
        require(address(0) != address(_token));
        token = _token;
    }

    /// @return available tokens
    function tokensAvailable() public constant returns (uint256) {
        return token.availableTokens();
    }

    /// @notice transfer tokens on holder account
    function allocate(address _holder, uint256 _tokens) public onlyCrowdsale() {
        internalAllocate(_holder, _tokens);
    }

    /// @notice Check whether contract is initialised
    /// @return true if initialized
    function isInitialized() public constant returns (bool) {
        return token.mintingAgents(this);
    }

    /// @notice update instance of MintableToken
    function setToken(MintableToken _token) public onlyOwner {
        token = _token;
    }

    function internalAllocate(address _holder, uint256 _tokens) internal {
        token.mint(_holder, _tokens);
    }

}
