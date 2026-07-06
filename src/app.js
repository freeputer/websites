const TokenCreator = require('./token-creator');

const tokenCreator = new TokenCreator();

console.log('========================================');
console.log('    CryptoToken 软件启动');
console.log('========================================');

const myToken = tokenCreator.createToken('MyToken', 'MTK', 1000000000);
console.log(`\n✅ 代币创建成功:`);
console.log(`   代币名称: ${myToken.name}`);
console.log(`   代币符号: ${myToken.symbol}`);
console.log(`   总供应量: ${myToken.totalSupply}`);
console.log(`   代币ID: ${myToken.id}`);

const address1 = '0x1234567890abcdef1234567890abcdef12345678';
const address2 = '0xabcdef1234567890abcdef1234567890abcdef12';

tokenCreator.mintToken(myToken.id, address1, 1000000);
console.log(`\n✅ 铸造成功: 向 ${address1} 发放 1,000,000 ${myToken.symbol}`);

tokenCreator.mintToken(myToken.id, address2, 500000);
console.log(`✅ 铸造成功: 向 ${address2} 发放 500,000 ${myToken.symbol}`);

console.log(`\n📊 余额查询:`);
console.log(`   ${address1}: ${tokenCreator.getTokenBalance(myToken.id, address1)} ${myToken.symbol}`);
console.log(`   ${address2}: ${tokenCreator.getTokenBalance(myToken.id, address2)} ${myToken.symbol}`);

tokenCreator.transferToken(myToken.id, address1, address2, 100000);
console.log(`\n🔄 转账成功: 从 ${address1} 向 ${address2} 转账 100,000 ${myToken.symbol}`);

console.log(`\n📊 更新后余额:`);
console.log(`   ${address1}: ${tokenCreator.getTokenBalance(myToken.id, address1)} ${myToken.symbol}`);
console.log(`   ${address2}: ${tokenCreator.getTokenBalance(myToken.id, address2)} ${myToken.symbol}`);

console.log(`\n========================================`);
console.log('    CryptoToken 演示完成');
console.log('========================================');