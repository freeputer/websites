# CryptoToken - Virtual Currency Sales Website

A Node.js + Express based virtual currency sales website with USDT (TRC20) payment support and automatic delivery.

## Features

- One-click token creation
- Open source code
- High performance

## Tech Stack

- Node.js ≥ 18.0.0
- Express
- TronGrid API (Payment Verification)

## Installation

```bash
npm install
npm start
```

Server runs at http://localhost:3000

## Project Structure

```
websites/
├── server.js             # Express server
├── package.json          # Project config
├── public/               # Frontend static files
│   ├── index.html
│   ├── styles.css
│   └── main.js
└── src/                  # Software source code
    ├── token-creator.js  # Token creation core
    ├── app.js            # Demo program
    └── README.md
```

## Payment Flow

1. User sends 20 USDT (TRC20) to the recipient address
2. User enters the transaction hash for verification
3. Server verifies the transaction via TronGrid API
4. Download link is displayed after successful verification

## Support

Email: tworksweb@outlook.com