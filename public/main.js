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
        console.error('Copy failed:', err);
    });
}

async function verifyPayment() {
    const txHash = document.getElementById('txHash').value.trim();
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyResult = document.getElementById('verifyResult');
    const downloadLink = document.getElementById('downloadLink');

    if (!txHash) {
        showResult('Please enter the transaction hash', 'error');
        return;
    }

    if (!/^[0-9a-fA-F]{64}$/.test(txHash)) {
        showResult('Please enter a valid transaction hash', 'error');
        return;
    }

    verifyBtn.disabled = true;
    showResult('Verifying transaction, please wait...', 'loading');
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
        showResult('Verification failed, please try again later', 'error');
        console.error('Verification error:', error);
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