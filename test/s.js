// var
//     ICUStrategy = artifacts.require("./test/ICUStrategyTest.sol"),
//     ICUAgent = artifacts.require("./ICUAgent.sol"),
//     ICUToken = artifacts.require("./ICUToken.sol"),
//     Utils = require("./utils"),
//     BigNumber = require('bignumber.js'),
//     precision = new BigNumber("1000000000000000000"),
//     usdPrecision = new BigNumber("100000"),
//     icoSince = parseInt(new Date().getTime() / 1000 - 3600),
//     icoTill = parseInt(new Date().getTime() / 1000) + 3600;
//
// contract('ICUStrategy', function (accounts) {
//     let strategy, agent;
//
//     beforeEach(async function () {
//         strategy = await ICUStrategy.new([
//             new BigNumber('0.01').mul(usdPrecision).valueOf(),//tokenInUSD
//             new BigNumber('10000000').mul(usdPrecision).valueOf(),//maxTokensCollected
//             new BigNumber('0').mul(precision).valueOf(),//discountPercents
//             new BigNumber('20').mul(precision).valueOf(),//minInvestInUSD
//             new BigNumber('28').mul(1).valueOf(),//startDate
//             new BigNumber('82').mul(1).valueOf(),//endDate
//
//             new BigNumber('0.01').mul(usdPrecision).valueOf(),//tokenInUSD
//             new BigNumber('13500000').mul(usdPrecision).valueOf(),//maxTokensCollected
//             new BigNumber('0').mul(precision).valueOf(),//discountPercents
//             new BigNumber('0.1').mul(precision).valueOf(),//minInvestInUSD
//             new BigNumber('28').mul(1).valueOf(),//startDate
//             new BigNumber('82').mul(1).valueOf()//endDate
//         ], [
//             new BigNumber('10000000').mul(usdPrecision).valueOf(), new BigNumber('30').mul(1).valueOf(),
//             0, 0,
//             0, 0,
//             new BigNumber('4000000').mul(usdPrecision).valueOf(), new BigNumber('15').mul(1).valueOf(),
//             new BigNumber('12000000').mul(usdPrecision).valueOf(), new BigNumber('6').mul(1).valueOf(),
//             new BigNumber('13500000').mul(usdPrecision).valueOf(), new BigNumber('3').mul(1).valueOf(),
//         ], new BigNumber('400').mul(usdPrecision));
//         await strategy.updateDates(0, icoSince, icoTill);
//         await strategy.updateDates(1, icoTill + 3600, icoTill + 3600 * 2);
//     });
// /*
//     it('check getTierIndex returns  properly index', async function () {
//         let id = await strategy.getTierIndex.call();
//         await assert.equal(new BigNumber(id).valueOf(), 0, "getTierIndex is not equal");
//
//         await strategy.updateSoldTokens(0, new BigNumber('10000000').sub('1').mul(usdPrecision).valueOf());
//         id = await strategy.getTierIndex.call();
//         await assert.equal(new BigNumber(id).valueOf(), 0, "getTierIndex is not equal");
//
//         await strategy.updateSoldTokens(0, new BigNumber('10000000').mul(usdPrecision).valueOf());
//         id = await strategy.getTierIndex.call();
//         await assert.equal(new BigNumber(id).valueOf(), 2, "getTierIndex is not equal");
//
//         await strategy.updateDates(0, icoSince - 28, icoSince);
//         await strategy.updateDates(1, icoSince, icoTill);
//
//         id = await strategy.getTierIndex.call();
//         await assert.equal(new BigNumber(id).valueOf(), 1, "getTierIndex is not equal");
//
//         await strategy.updateSoldTokens(1, new BigNumber('23500000').mul(usdPrecision).valueOf());
//
//         id = await strategy.getTierIndex.call();
//         await assert.equal(new BigNumber(id).valueOf(), 2, "getTierIndex is not equal");
//     });
//
//     it('check getActualDates.call()', async function () {
//         let dates = await strategy.getActualDates.call();
//         await assert.equal(new BigNumber(dates[0]).valueOf(), icoSince, "strat is not equal");
//         await assert.equal(new BigNumber(dates[1]).valueOf(), icoTill, "end is not equal");
//
//         await strategy.updateSoldTokens(0, new BigNumber('1000000000').mul(precision).valueOf());
//
//         dates = await strategy.getActualDates.call();
//         await assert.equal(new BigNumber(dates[0]).valueOf(), icoTill + 3600, "strat is not equal");
//         await assert.equal(new BigNumber(dates[1]).valueOf(), icoTill + 3600 + 3600, "end is not equal");
//
//         await strategy.updateDates(0, icoSince - (3600 * 2), icoSince - 3600);
//         await strategy.updateDates(1, icoSince, icoSince + 1);
//
//         dates = await strategy.getActualDates.call();
//         await assert.equal(new BigNumber(dates[0]).valueOf(), icoSince, "strat is not equal");
//         await assert.equal(new BigNumber(dates[1]).valueOf(), icoSince + 1, "end is not equal");
//     });
// */
//     describe('check getTokens', async function () {
// /*
//         it('zero weis  should return zero tokens', async function () {
//             let tokens = await strategy.getTokens.call(accounts[0], 5000000, 0, 0, 0)
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), 0, "bonus is not equal")
//         });
//
//         it('less than  min purchase', async function () {
//             //minInvest 100$
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('19.9999999999').mul(precision).valueOf(),
//                 0
//             );
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "tokens is not equal");
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensExcludingBonus is not equal");
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), 0, "bonus is not equal");
//
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(1000000000000).mul(precision),
//                 0,
//                 new BigNumber('20').mul(precision).valueOf(),
//                 0
//             );
//             //20 * 400 / 0.01 = 800000
//             //20 * 400 / 0.01 * 130/100 = 1040000
//             //20 * 400 / 0.01 * 3/10 = 240000
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('1040000').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('800000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "bonus is not equal")
//         });
//
//         it('before sale period ', async function () {
//             await strategy.updateDates(0, icoSince - 28, icoSince);
//             await strategy.updateDates(1, icoSince - 28, icoSince);
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('1').mul(precision).valueOf(),
//                 0
//             );
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), 0, "bonus is not equal")
//         });
//
//         it('outdated', async function () {
//             await strategy.updateDates(0, icoTill - 28, icoTill);
//             await strategy.updateDates(1, icoTill - 28, icoTill);
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('1').mul(precision).valueOf(),
//                 0
//             );
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), 0, "bonus is not equal")
//         });
//
//         it('tokens less than available', async function () {
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber('1040000').mul(precision).valueOf(),
//                 0,
//                 new BigNumber('20').mul(precision).valueOf(),
//                 0
//             );
//             //100$ = minIvest
//             //price = 0.075$(with discount)
//             //discount = 75%
//             //airdrop bonus = 0%
//             //100 / 0.75 = 133.333333333333333333
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('1040000').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('800000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "bonus is not equal")
//
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber('1040000').mul(precision).valueOf(),
//                 0,
//                 new BigNumber('20.1').mul(precision).valueOf(),
//                 0
//             );
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), 0, "bonus is not equal")
//         });
//
//         it('success for each  tier and check maxTokensCollected', async function () {
//             await strategy.updateSoldTokens(0, new BigNumber('10000000').sub('8000').mul(usdPrecision).valueOf());
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('20').mul(precision).valueOf(),
//                 0
//             );
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('1040000').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('800000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "bonus is not equal")
//
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('20.28').mul(precision).valueOf(),
//                 0
//             );
//
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "bonus is not equal")
//
//             await strategy.updateDates(0, icoSince - 28, icoSince);
//
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('20').mul(precision).valueOf(),
//                 0
//             );
//
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "bonus is not equal")
//
//             await strategy.updateDates(1, icoSince, icoTill);
//
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('1').mul(precision).valueOf(),
//                 0
//             );
//
//             //1 * 400 / 0.01 = 40000
//             //1 * 400 / 0.01 * 115/100 = 46000
//             //1 * 400 / 0.01 * 15/100 = 6000
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('46000').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('40000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('6000').mul(precision).valueOf(), "bonus is not equal")
//         });
// */
//         it('check airdrop threshhold', async function () {
//             await strategy.updateDates(0, icoSince - 28, icoSince);
//             await strategy.updateDates(1, icoSince, icoTill);
//
//             await strategy.updateSoldTokens(1, new BigNumber('4000000').sub('300').mul(usdPrecision).valueOf());
//
//             let tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber(100000000).mul(precision),
//                 0,
//                 new BigNumber('1').mul(precision).valueOf(),
//                 0
//             );
//             //400 / 0.01 = 40000
//             //300 / 0.01 * 115/100 = 34500
//             //300 / 0.01 * 15/100 = 4500
//             //100 / 0.01 * 106/100 = 10600
//             //100 / 0.01 * 6/100 = 600
//             await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('34500').add('10600').mul(precision).valueOf(), "tokens is not equal")
//             await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('40000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('5100').mul(precision).valueOf(), "bonus is not equal")
//
//             await strategy.updateSoldTokens(1, new BigNumber('4000000').sub('10000').mul(usdPrecision).valueOf());
// console.log('tututu');
//             tokens = await strategy.getTokens.call(
//                 accounts[0],
//                 new BigNumber('13500000000000000000000').mul(precision),
//                 0,
//                 new BigNumber('22500').mul(precision).valueOf(),
//                 0
//             );
//             console.log(tokens);
//             //900000000
//             //1000000 * 15/100 = 150000 | 150000
//             //800000000 * 6/100 = 48000000 | 48000000
//             //99000000 * 3/100 = 2970000 | 2970000
//             // await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('900000000').add('150000').add('48000000').add('2970000').mul(precision).valueOf(), "tokens is not equal")
//             // await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('900000000').mul(precision).valueOf(), "tokensExcludingBonus is not equal")
//             // await assert.equal(new BigNumber(tokens[2]).valueOf(), new BigNumber('150000').add('48000000').add('2970000').mul(precision).valueOf(), "bonus is not equal")
//         });
//     });
// /*
//         describe('check getWeis', async function () {
//
//             it('zero tokens should return zero weis', async function () {
//                 let tokens = await strategy.getWeis.call(0, 0, 0)
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), 0, "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), 0, "tokensBonus is not equal")
//             });
//
//             it('less than  min purchase', async function () {
//                 let tokens = await strategy.getWeis.call(0, 0, new BigNumber('800000').mul(precision).valueOf());
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('20').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "tokensBonus is not equal")
//                 tokens = await strategy.getWeis.call(0, 0, new BigNumber('800000').sub('1').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensBonus is not equal")
//             });
//
//             it('outdated', async function () {
//                 await strategy.updateDates(0, icoTill - 28, icoTill);
//                 await strategy.updateDates(1, icoTill - 28, icoTill);
//                 let tokens = await strategy.getWeis.call(0, 0, new BigNumber('40000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensBonus is not equal")
//             });
//
//             it('before sale period', async function () {
//                 await strategy.updateDates(0, icoSince - 28, icoSince);
//                 await strategy.updateDates(1, icoSince - 28, icoSince);
//                 let tokens = await strategy.getWeis.call(0, 0, new BigNumber('40000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensBonus is not equal")
//             });
//
//             it('tokens less than available | maxTokensCollected', async function () {
//                 await strategy.updateSoldTokens(0, new BigNumber('1000000000').sub('800000').mul(precision).valueOf());
//                 let tokens = await strategy.getWeis.call(0, 0, new BigNumber('800000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('20').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "tokensBonus is not equal")
//
//                 tokens = await strategy.getWeis.call(0, 0, new BigNumber('800001').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensBonus is not equal")
//
//             });
//
//             it('success for each  tier', async function () {
//                 let tokens = await strategy.getWeis.call(0, 0, new BigNumber('800000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('20').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('240000').mul(precision).valueOf(), "tokensBonus is not equal")
//
//                 await strategy.updateDates(0, icoSince - 28, icoSince);
//
//                 tokens = await strategy.getWeis.call(0, 0, new BigNumber('800000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('0').mul(precision).valueOf(), "tokensBonus is not equal")
//
//                 await strategy.updateDates(1, icoSince, icoTill);
//
//                 tokens = await strategy.getWeis.call(0, 0, new BigNumber('40000').mul(precision).valueOf())
//                 await assert.equal(new BigNumber(tokens[0]).valueOf(), new BigNumber('1').mul(precision).valueOf(), "totalWeiAmount is not equal")
//                 await assert.equal(new BigNumber(tokens[1]).valueOf(), new BigNumber('6000').mul(precision).valueOf(), "tokensBonus is not equal")
//
//             });
//
//         });
//
//         describe('check methods', async function () {
//
//             it('updateTierTokens', async function () {
//                 //checked with contribution
//             });
//
//             it('setCrowdsaleAgent', async function () {
//                 assert.equal(await strategy.agent.call(), 0x0, "agent is not equal");
//                 await strategy.setCrowdsaleAgent(accounts[8], {from: accounts[3]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//
//                 await strategy.setCrowdsaleAgent(accounts[5], {from: accounts[0]})
//                     .then(Utils.receiptShouldSucceed)
//                 assert.equal(await strategy.agent.call(), accounts[5], "agent is not equal");
//             });
//
//             it('getArrayOfUSTiers | updateTierTokens', async function () {
//                 let usTiersData = await strategy.getArrayOfTiers.call();
//
//                 assert.equal(usTiersData[0], new BigNumber('0.01').mul(usdPrecision).valueOf(), "tokenInUSD is not equal");
//                 assert.equal(usTiersData[1], new BigNumber('1000000000').mul(precision).valueOf(), "maxTokensCollected is not equal");
//                 assert.equal(usTiersData[2], new BigNumber('0').mul(precision).valueOf(), "soldTierTokens is not equal");
//                 assert.equal(usTiersData[3], new BigNumber('0').mul(1).valueOf(), "discountPercents is not equal");
//                 assert.equal(usTiersData[4], new BigNumber('8000').mul(usdPrecision).valueOf(), "minInvestInUSD is not equal");
//                 assert.equal(usTiersData[5], icoSince, "startDate is not equal");
//                 assert.equal(usTiersData[6], icoTill, "endDate is not equal");
//
//                 await strategy.setCrowdsaleAgent(accounts[5], {from: accounts[0]})
//                     .then(Utils.receiptShouldSucceed);
//
//                 await strategy.updateTierTokens(0, 56, 28, {from: accounts[0]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTierTokens(28, 56, 28, {from: accounts[5]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTierTokens(0, 0, 28, {from: accounts[5]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTierTokens(0, 56, 28, {from: accounts[5]})
//                     .then(Utils.receiptShouldSucceed);
//
//                 usTiersData = await strategy.getArrayOfTiers.call();
//
//                 assert.equal(usTiersData[0], new BigNumber('0.01').mul(usdPrecision).valueOf(), "tokenInUSD is not equal");
//                 assert.equal(usTiersData[1], new BigNumber('1000000000').mul(precision).valueOf(), "maxTokensCollected is not equal");
//                 assert.equal(usTiersData[2], new BigNumber('0').mul(precision).add('56').valueOf(), "soldTierTokens is not equal");
//                 assert.equal(usTiersData[3], new BigNumber('0').mul(1).valueOf(), "discountPercents is not equal");
//                 assert.equal(usTiersData[4], new BigNumber('8000').mul(usdPrecision).valueOf(), "minInvestInUSD is not equal");
//                 assert.equal(usTiersData[5], icoSince, "startDate is not equal");
//                 assert.equal(usTiersData[6], icoTill, "endDate is not equal");
//             });
//
//             it('getArrayOfNonUSTiers | updateTier', async function () {
//                 // strategy = await CHLStrategy.new([], new BigNumber('1000').mul(usdPrecision));
//                 const token = await ICUToken.new(icoTill);
//                 agent = await ICUAgent.new(accounts[1], token.address, strategy.address);
//                 await strategy.updateDates(1, icoSince, icoTill);
//
//                 await token.updateStateChangeAgent(agent.address, true);
//
//                 let nonUsTiersData = await strategy.getArrayOfTiers.call();
//
//                 assert.equal(nonUsTiersData[7], new BigNumber('0.01').mul(usdPrecision).valueOf(), "tokenInUSD is not equal");
//                 assert.equal(nonUsTiersData[8], new BigNumber('1350000000').mul(precision).valueOf(), "maxTokensCollected is not equal");
//                 assert.equal(nonUsTiersData[9], new BigNumber('0').mul(precision).valueOf(), "soldTierTokens is not equal");
//                 assert.equal(nonUsTiersData[10], new BigNumber('0').mul(1).valueOf(), "discountPercents is not equal");
//                 assert.equal(nonUsTiersData[11], new BigNumber('80').mul(usdPrecision).valueOf(), "minInvestInUSD is not equal");
//                 assert.equal(nonUsTiersData[12], icoSince, "startDate is not equal");
//                 assert.equal(nonUsTiersData[13], icoTill, "endDate is not equal");
//                 assert.equal(await token.time.call(), icoTill, "time is not equal");
//
//                 await strategy.setCrowdsaleAgent(agent.address, {from: accounts[0]})
//                     .then(Utils.receiptShouldSucceed);
//
//                 //_tierId _start _end _minInvest _price _discount _capsData updateLockNeeded
//
//                 await strategy.updateTier(1, 27, 28, 28, 28, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[1]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTier(1, 0, 28, 28, 28, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[0]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTier(1, 27, 28, 28, 0, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[0]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTier(1, 28, 28, 28, 28, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[0]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTier(2, 27, 28, 28, 28, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[0]})
//                     .then(Utils.receiptShouldFailed)
//                     .catch(Utils.catchReceiptShouldFailed);
//                 await strategy.updateTier(1, 27, 28, 28, 28, 28, [0, 0, 0, 0, 0, 0], true, {from: accounts[0]})
//                     // .then(Utils.receiptShouldFailed);
//                     .then(Utils.receiptShouldSucceed);
//
//                 nonUsTiersData = await strategy.getArrayOfTiers.call();
//
//                 assert.equal(nonUsTiersData[7], new BigNumber('28').mul(1).valueOf(), "tokenInUSD is not equal");
//                 assert.equal(nonUsTiersData[8], new BigNumber('1350000000').mul(precision).valueOf(), "maxTokensCollected is not equal");
//                 assert.equal(nonUsTiersData[9], new BigNumber('0').mul(1).valueOf(), "soldTierTokens is not equal");
//                 assert.equal(nonUsTiersData[10], new BigNumber('28').mul(1).valueOf(), "discountPercents is not equal");
//                 assert.equal(nonUsTiersData[11], new BigNumber('28').mul(1).valueOf(), "minInvestInUSD is not equal");
//                 assert.equal(nonUsTiersData[12], 27, "startDate is not equal");
//                 assert.equal(nonUsTiersData[13], 28, "endDate is not equal");
//                 assert.equal(await token.time.call(), 28, "time is not equal");
//             });
//         });
// */
// });