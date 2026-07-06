const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PAYMENT_ADDRESS = 'TRVfny686RZXBvVECy4SEDf9DFpcSTVBb2';
const REQUIRED_AMOUNT = 20;
const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

const verifiedTransactions = new Set();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/address', (req, res) => {
  res.json({
    address: PAYMENT_ADDRESS,
    amount: REQUIRED_AMOUNT,
    network: 'TRON (TRC20)',
    contract: USDT_CONTRACT_ADDRESS
  });
});

app.post('/api/verify', async (req, res) => {
  const { txHash } = req.body;

  if (!txHash || typeof txHash !== 'string') {
    return res.status(400).json({ success: false, message: 'Please provide a valid transaction hash' });
  }

  if (!/^[0-9a-fA-F]{64}$/.test(txHash)) {
    return res.status(400).json({ success: false, message: 'Invalid transaction hash format' });
  }

  if (verifiedTransactions.has(txHash)) {
    return res.status(200).json({ success: true, message: 'Transaction verified, ready to download' });
  }

  try {
    const trc20Response = await axios.get(`https://api.trongrid.io/v1/accounts/${PAYMENT_ADDRESS}/transactions/trc20`, {
      params: {
        limit: 200,
        order_by: 'block_timestamp,desc'
      }
    });

    const trc20Transactions = trc20Response.data.data;
    let targetTx = trc20Transactions.find(tx => tx.transaction_id.toLowerCase() === txHash.toLowerCase());

    if (!targetTx) {
      try {
        const directResponse = await axios.get(`https://api.trongrid.io/v1/transactions/${txHash}`);
        const transaction = directResponse.data.data[0];
        
        if (transaction && transaction.ret && transaction.ret[0] && transaction.ret[0].contractRet === 'SUCCESS') {
          return res.status(400).json({ success: false, message: 'Transaction confirmed on-chain but not yet indexed, please wait about 1 minute' });
        }
      } catch (e) {
        console.log('Direct query failed:', e.message);
      }
      
      return res.status(400).json({ success: false, message: 'Transaction not found, please verify the hash or wait about 1 minute' });
    }

    if (targetTx.to.toLowerCase() !== PAYMENT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Incorrect recipient address' });
    }

    if (targetTx.token_info && targetTx.token_info.address && 
        targetTx.token_info.address.toLowerCase() !== USDT_CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Token is not USDT (TRC20)' });
    }

    const amount = parseFloat(targetTx.value) / 1000000;

    if (amount >= REQUIRED_AMOUNT) {
      verifiedTransactions.add(txHash);
      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully!',
        amount: amount,
        downloadUrl: 'https://github.com/freeputer/autocoins/archive/refs/heads/master.zip'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient payment, ${REQUIRED_AMOUNT} USDT required, but ${amount} USDT received` 
      });
    }

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Verification service temporarily unavailable, please try again later' });
  }
});

app.get('/download', (req, res) => {
  const zipPath = path.join(__dirname, 'software', 'crypto-token-software.zip');
  
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'crypto-token-software.zip', (err) => {
      if (err) {
        console.error('Download failed:', err);
        res.status(500).json({ success: false, message: 'Download failed, please try again' });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'Software package not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Recipient address: ${PAYMENT_ADDRESS}`);
});