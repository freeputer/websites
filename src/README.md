# CryptoToken - 虚拟货币发放软件

## 简介

CryptoToken是一个基于Node.js的虚拟货币创建和发放软件，让您可以轻松创建和管理自己的加密货币。

## 功能特性

- 一键创建代币
- 批量发放代币
- 安全可靠的交易系统
- 实时余额查询
- 完整源码支持二次开发

## 技术栈

- Node.js ≥ 18.0.0
- JavaScript (ES6+)

## 安装步骤

1. 确保已安装 Node.js 18.0.0 或更高版本
2. 解压软件包
3. 进入目录
4. 运行演示程序

```bash
cd src
node app.js
```

## 使用说明

### 创建代币

```javascript
const TokenCreator = require('./token-creator');
const tokenCreator = new TokenCreator();

const token = tokenCreator.createToken('代币名称', '符号', 总供应量);
```

### 铸造代币

```javascript
tokenCreator.mintToken(token.id, 地址, 数量);
```

### 转账

```javascript
tokenCreator.transferToken(token.id, 转出地址, 转入地址, 数量);
```

### 查询余额

```javascript
const balance = tokenCreator.getTokenBalance(token.id, 地址);
```

## 许可证

MIT License