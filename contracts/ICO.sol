pragma solidity 0.4.19;

import "./crowdsale/RefundableCrowdsale.sol";
import "./contribution/DistributedDirectContributionForwarder.sol";
import "./pricing/TokenDateBonusTiersPricingStrategy.sol";
import "./allocator/MintableTokenAllocator.sol";


contract ICO is RefundableCrowdsale {

    TokenDateBonusTiersPricingStrategy public pricingStrategyImpl;

    uint256 public constant PRE_ICO_TIER = 0;

    uint256 public bonusAmount = uint256(400500000).mul(10 ** 18);
    bool public isBonusIncreased;

    mapping(address => uint256) public contributorBonuses;
event Debug(string n, uint256 v);
    function ICO(
        MintableTokenAllocator _allocator,
        DistributedDirectContributionForwarder _contributionForwarder,
        TokenDateBonusTiersPricingStrategy _pricingStrategy
    ) public
        RefundableCrowdsale(
            _allocator,
            _contributionForwarder,
            _pricingStrategy,
            1525996800,
            1526601600,
            true,
            true,
            false,
            uint256(5000000).mul(10 ** 18),
            uint256(23500000).mul(10 ** 18)
        )
    {
        pricingStrategyImpl = TokenDateBonusTiersPricingStrategy(_pricingStrategy);
    }

    function updateState() public {
        (startDate, endDate) = pricingStrategyImpl.getActualDates(tokensSold);
        super.updateState();
    }

    function claimBonuses() public {
        updateState();
        State state = getState();
        if (state == State.Success && contributorBonuses[msg.sender] > 0) {
            allocator.allocate(msg.sender, contributorBonuses[msg.sender]);
            contributorBonuses[msg.sender] = 0;
        }
    }

    function updateBonusesAmount() internal {
        if (isBonusIncreased == true) {
            return;
        }
        uint256 tokenInWei;
        uint256 maxTokensCollected;
        uint256 bonusPercents;
        uint256 minInvestInWei;
        uint256 startTime;
        uint256 endTime;
        (
            tokenInWei,
            maxTokensCollected,
            bonusPercents,
            minInvestInWei,
            startTime,
            endTime
        ) = pricingStrategyImpl.tiers(PRE_ICO_TIER);
        if (block.timestamp > endTime) {
            bonusAmount = bonusAmount.add(maxTokensCollected.sub(tokensSold));
            isBonusIncreased = true;
        }
    }

    function internalContribution(address _contributor, uint256 _wei) internal {
        updateState();
        updateBonusesAmount();
        require(block.timestamp >= startDate && block.timestamp <= endDate);

        uint256 tokensAvailable = allocator.tokensAvailable();
        uint256 collectedWei = contributionForwarder.weiCollected();

        uint256 tokens;
        uint256 tokensExcludingBonus;
        uint256 bonus;

        (tokens, tokensExcludingBonus, bonus) = pricingStrategy.getTokens(
        _contributor, tokensAvailable, tokensSold, _wei, collectedWei);

        require(
            tokensExcludingBonus > 0 &&
            tokensExcludingBonus < tokensAvailable &&
            hardCap > tokensSold.add(tokensExcludingBonus)
        );

        tokensSold = tokensSold.add(tokensExcludingBonus);

        allocator.allocate(_contributor, tokensExcludingBonus);

        // transfer only if softcap is reached
        if (tokensSold >= softCap) {
            if (msg.value > 0) {
                contributionForwarder.forward.value(msg.value)();
            }
        } else {
            // store contributor if it is not stored before
            if (contributorsWei[_contributor] == 0) {
                contributors.push(_contributor);
                contributors.push(_contributor);
            }
            contributorsWei[_contributor] = contributorsWei[_contributor].add(msg.value);
        }

        if (bonusAmount >= bonus) {
            contributorBonuses[_contributor] = contributorBonuses[_contributor].add(bonus);
            bonusAmount = bonusAmount.sub(bonus);
        }

        Contribution(_contributor, _wei, tokensExcludingBonus, bonus);
    }

}