# CryptoToken - 虚拟货币发放软件销售网站

基于 Node.js + Express 的虚拟货币销售网站，支持 USDT (TRC20) 支付和自动发货。

## 功能特性

- 一键创建代币
- 完整源码
- 高性能

## 技术栈

- Node.js ≥ 18.0.0
- Express
- TronGrid API (支付验证)

## 安装运行

```bash
npm install
npm start
```

服务器运行在 http://localhost:3000

## 项目结构

```
websites/
├── server.js             # Express 服务器
├── package.json          # 项目配置
├── public/               # 前端静态资源
│   ├── index.html
│   ├── styles.css
│   └── main.js
└── src/                  # 软件源码
    ├── token-creator.js  # 代币创建核心
    ├── app.js            # 演示程序
    └── README.md
```

## 支付流程

1. 用户向收款地址支付 20 USDT (TRC20)
2. 用户输入交易哈希进行验证
3. 服务器调用 TronGrid API 验证交易
4. 验证通过后显示下载链接

## 客服支持

邮箱：tworksweb@outlook.com
