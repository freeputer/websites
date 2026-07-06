# CryptoToken - Virtual Currency Software

## Introduction

CryptoToken is a Node.js-based virtual currency creation and distribution software that allows you to easily create and manage your own cryptocurrency.

## Features

- One-click token creation
- Open source code
- High performance

## Tech Stack

- Node.js ≥ 18.0.0
- JavaScript (ES6+)

## Installation

1. Ensure Node.js 18.0.0 or higher is installed
2. Extract the software package
3. Navigate to the directory
4. Run the demo program

```bash
cd src
node app.js
```

## Usage

### Create Token

```javascript
const TokenCreator = require('./token-creator');
const tokenCreator = new TokenCreator();

const token = tokenCreator.createToken('Token Name', 'Symbol', totalSupply);
```

### Mint Token

```javascript
tokenCreator.mintToken(token.id, address, amount);
```

### Transfer

```javascript
tokenCreator.transferToken(token.id, fromAddress, toAddress, amount);
```

### Query Balance

```javascript
const balance = tokenCreator.getTokenBalance(token.id, address);
```

## License

MIT License