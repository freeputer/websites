const ADDRESS = 'TRVfny686RZXBvVECy4SEDf9DFpcSTVBb2';

function initQRCode() {
    const qrcode = new QRCode(document.getElementById('qrcode'), {
        text: ADDRESS,
        width: 150,
        height: 150,
        colorDark: '#00d4ff',
        colorLight: '#1a1a2e',
        correctLevel: QRCode.CorrectLevel.H
    });
}

function copyAddress() {
    const address = document.getElementById('address').innerText;
    navigator.clipboard.writeText(address).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerText;
        btn.innerText = '✅';
        setTimeout(() => {
            btn.innerText = originalText;
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

async function verifyPayment() {
    const txHash = document.getElementById('txHash').value.trim();
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyResult = document.getElementById('verifyResult');
    const downloadLink = document.getElementById('downloadLink');

    if (!txHash) {
        showResult('请输入交易哈希', 'error');
        return;
    }

    if (!/^[0-9a-fA-F]{64}$/.test(txHash)) {
        showResult('请输入有效的交易哈希', 'error');
        return;
    }

    verifyBtn.disabled = true;
    showResult('正在验证交易，请稍候...', 'loading');
    downloadLink.style.display = 'none';

    try {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txHash })
        });

        const data = await response.json();

        if (data.success) {
            showResult(data.message, 'success');
            downloadLink.style.display = 'block';
        } else {
            showResult(data.message, 'error');
        }
    } catch (error) {
        showResult('验证失败，请稍后再试', 'error');
        console.error('验证错误:', error);
    } finally {
        verifyBtn.disabled = false;
    }
}

function showResult(message, type) {
    const verifyResult = document.getElementById('verifyResult');
    verifyResult.innerText = message;
    verifyResult.className = `verify-result ${type}`;
}

document.addEventListener('DOMContentLoaded', () => {
    initQRCode();

    const verifyBtn = document.getElementById('verifyBtn');
    verifyBtn.addEventListener('click', verifyPayment);

    const txInput = document.getElementById('txHash');
    txInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPayment();
        }
    });
});