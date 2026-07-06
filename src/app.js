const TokenCreator = require('./token-creator');

const tokenCreator = new TokenCreator();

console.log('========================================');
console.log('    CryptoToken Software Started');
console.log('========================================');

const myToken = tokenCreator.createToken('MyToken', 'MTK', 1000000000);
console.log(`\n[OK] Token created successfully:`);
console.log(`   Token name: ${myToken.name}`);
console.log(`   Token symbol: ${myToken.symbol}`);
console.log(`   Total supply: ${myToken.totalSupply}`);
console.log(`   Token ID: ${myToken.id}`);

const address1 = '0x1234567890abcdef1234567890abcdef12345678';
const address2 = '0xabcdef1234567890abcdef1234567890abcdef12';

tokenCreator.mintToken(myToken.id, address1, 1000000);
console.log(`\n[OK] Minted: 1,000,000 ${myToken.symbol} sent to ${address1}`);

tokenCreator.mintToken(myToken.id, address2, 500000);
console.log(`[OK] Minted: 500,000 ${myToken.symbol} sent to ${address2}`);

console.log(`\n[INFO] Balance query:`);
console.log(`   ${address1}: ${tokenCreator.getTokenBalance(myToken.id, address1)} ${myToken.symbol}`);
console.log(`   ${address2}: ${tokenCreator.getTokenBalance(myToken.id, address2)} ${myToken.symbol}`);

tokenCreator.transferToken(myToken.id, address1, address2, 100000);
console.log(`\n[OK] Transfer: 100,000 ${myToken.symbol} sent from ${address1} to ${address2}`);

console.log(`\n[INFO] Updated balances:`);
console.log(`   ${address1}: ${tokenCreator.getTokenBalance(myToken.id, address1)} ${myToken.symbol}`);
console.log(`   ${address2}: ${tokenCreator.getTokenBalance(myToken.id, address2)} ${myToken.symbol}`);

console.log(`\n========================================`);
console.log('    CryptoToken Demo Completed');
console.log('========================================');