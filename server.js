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
    return res.status(400).json({ success: false, message: '请提供有效的交易哈希' });
  }

  if (!/^[0-9a-fA-F]{64}$/.test(txHash)) {
    return res.status(400).json({ success: false, message: '交易哈希格式不正确' });
  }

  if (verifiedTransactions.has(txHash)) {
    return res.status(200).json({ success: true, message: '交易已验证，可下载软件' });
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
          return res.status(400).json({ success: false, message: '交易已上链但尚未被索引，请等待约1分钟后再试' });
        }
      } catch (e) {
        console.log('直接查询交易失败:', e.message);
      }
      
      return res.status(400).json({ success: false, message: '交易未找到，请确认交易哈希正确或等待约1分钟后再试' });
    }

    if (targetTx.to.toLowerCase() !== PAYMENT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ success: false, message: '交易收款地址不正确' });
    }

    if (targetTx.token_info && targetTx.token_info.address && 
        targetTx.token_info.address.toLowerCase() !== USDT_CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ success: false, message: '交易代币不是USDT(TRC20)' });
    }

    const amount = parseFloat(targetTx.value) / 1000000;

    if (amount >= REQUIRED_AMOUNT) {
      verifiedTransactions.add(txHash);
      return res.status(200).json({ 
        success: true, 
        message: '支付验证成功！',
        amount: amount,
        downloadUrl: '/download'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: `支付金额不足，需要 ${REQUIRED_AMOUNT} USDT，实际支付 ${amount} USDT` 
      });
    }

  } catch (error) {
    console.error('验证交易时出错:', error.message);
    return res.status(500).json({ success: false, message: '验证服务暂时不可用，请稍后再试' });
  }
});

app.get('/download', (req, res) => {
  const zipPath = path.join(__dirname, 'software', 'crypto-token-software.zip');
  
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'crypto-token-software.zip', (err) => {
      if (err) {
        console.error('下载失败:', err);
        res.status(500).json({ success: false, message: '下载失败，请重试' });
      }
    });
  } else {
    res.status(404).json({ success: false, message: '软件包不存在' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`收款地址: ${PAYMENT_ADDRESS}`);
});