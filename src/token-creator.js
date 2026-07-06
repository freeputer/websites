const crypto = require('crypto');

class TokenCreator {
    constructor() {
        this.tokens = {};
    }

    createToken(name, symbol, totalSupply, decimals = 18) {
        const tokenId = crypto.randomUUID();
        const token = {
            id: tokenId,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            decimals: decimals,
            balances: {},
            createdAt: new Date().toISOString()
        };
        this.tokens[tokenId] = token;
        return token;
    }

    mintToken(tokenId, address, amount) {
        if (!this.tokens[tokenId]) {
            throw new Error('Token not found');
        }
        if (!this.tokens[tokenId].balances[address]) {
            this.tokens[tokenId].balances[address] = 0;
        }
        this.tokens[tokenId].balances[address] += amount;
        return this.tokens[tokenId].balances[address];
    }

    transferToken(tokenId, from, to, amount) {
        if (!this.tokens[tokenId]) {
            throw new Error('Token not found');
        }
        if (!this.tokens[tokenId].balances[from] || this.tokens[tokenId].balances[from] < amount) {
            throw new Error('Insufficient balance');
        }
        if (!this.tokens[tokenId].balances[to]) {
            this.tokens[tokenId].balances[to] = 0;
        }
        this.tokens[tokenId].balances[from] -= amount;
        this.tokens[tokenId].balances[to] += amount;
        return true;
    }

    getTokenBalance(tokenId, address) {
        if (!this.tokens[tokenId]) {
            throw new Error('Token not found');
        }
        return this.tokens[tokenId].balances[address] || 0;
    }

    getAllTokens() {
        return Object.values(this.tokens);
    }
}

module.exports = TokenCreator;